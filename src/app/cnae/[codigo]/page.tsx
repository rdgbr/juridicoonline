import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { topByCnae, UFS, ufNome } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import { Building2, MapPin, ArrowRight } from "lucide-react";

export const revalidate = 86400; // 1 day

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const clean = codigo.replace(/\D/g, "");
  if (clean.length < 5) return { title: "CNAE não encontrado" };

  const empresas = await topByCnae(clean, undefined, 1);
  const descricao = empresas[0]?.cnae_descricao || `CNAE ${clean}`;

  const title = `${descricao} (CNAE ${clean}) — Empresas no Brasil`;
  const description = `Lista de empresas com atividade econômica ${descricao} (CNAE ${clean}) no Brasil. Consulte CNPJ, endereço, sócios e situação cadastral. Atualizado hoje.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/cnae/${clean}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CnaePage({ params }: Props) {
  const { codigo } = await params;
  const clean = codigo.replace(/\D/g, "");
  if (clean.length < 5) notFound();

  const empresas = await topByCnae(clean, undefined, 50);
  if (empresas.length === 0) notFound();

  const descricao = empresas[0].cnae_descricao || `CNAE ${clean}`;
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Empresas: ${descricao}`,
    description: descricao,
    numberOfItems: empresas.length,
    itemListElement: empresas.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Organization",
        name: e.razao_social,
        taxID: formatCNPJ(e.cnpj_completo),
        url: `${SITE_URL}/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "CNAEs", item: `${SITE_URL}/cnae` },
      { "@type": "ListItem", position: 3, name: descricao, item: `${SITE_URL}/cnae/${clean}` },
    ],
  };

  // Group by UF for state-level distribution links
  const porUF = empresas.reduce((acc, e) => {
    if (e.uf) acc[e.uf] = (acc[e.uf] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const ufsSorted = Object.entries(porUF).sort((a, b) => b[1] - a[1]);

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li><Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link></li>
          <li>/</li>
          <li className="text-slate-700">CNAE {clean}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {descricao}
        </h1>
        <p className="mt-2 text-slate-600 text-sm">
          CNAE <span className="font-mono">{clean}</span> · {empresas.length}+ empresas ativas catalogadas
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold tracking-tight mb-3">Maiores empresas do setor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {empresas.map((e) => (
            <Link
              key={e.cnpj_completo}
              href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate group-hover:text-[#0F4C81]">{e.razao_social}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatCNPJ(e.cnpj_completo)}</div>
                  {e.municipio_nome && (
                    <div className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}
                    </div>
                  )}
                  {e.capital_social ? (
                    <div className="text-[11px] text-slate-400 mt-0.5">Cap. {formatCurrency(e.capital_social)}</div>
                  ) : null}
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0F4C81] mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {ufsSorted.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight mb-3">Distribuição por estado</h2>
          <div className="flex flex-wrap gap-2">
            {ufsSorted.map(([uf, count]) => (
              <Link
                key={uf}
                href={`/empresas/${uf.toLowerCase()}/${clean}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition"
              >
                <span className="font-medium text-slate-900">{ufNome(uf)}</span>
                <span className="ml-1.5 text-slate-500">({count})</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">Veja também</h2>
        <div className="flex flex-wrap gap-2">
          {UFS.slice(0, 12).map((u) => (
            <Link
              key={u.sigla}
              href={`/empresas/${u.sigla.toLowerCase()}/${clean}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#0F4C81]"
            >
              {descricao} em {u.nome}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
