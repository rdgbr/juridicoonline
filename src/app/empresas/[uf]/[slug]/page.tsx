/**
 * Smart dispatcher: /empresas/[uf]/[slug] routes by content
 *   - slug is digits (5-7) → CNAE page (e.g. /empresas/sp/4711301)
 *   - slug is alpha       → Municipality page (e.g. /empresas/sp/jundiai)
 *
 * Resolves Next 16's restriction on two dynamic siblings with same parent.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UFS, ufNome, listByUF, topByCnae } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import { Building2, MapPin } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ uf: string; slug: string }> };

function isCnae(s: string): boolean {
  return /^\d{5,7}$/.test(s);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf, slug } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === ufUpper)) return { title: "Não encontrado" };

  if (isCnae(slug)) {
    const empresas = await topByCnae(slug, ufUpper, 1);
    const descricao = empresas[0]?.cnae_descricao || `CNAE ${slug}`;
    const ufName = ufNome(ufUpper);
    const title = `${descricao} em ${ufName} (${ufUpper}) — Empresas CNAE ${slug}`;
    return {
      title,
      description: `Lista de empresas com atividade ${descricao} em ${ufName}. CNPJ, endereço, sócios e situação cadastral. Atualizado hoje.`.slice(0, 160),
      alternates: { canonical: `/empresas/${ufUpper.toLowerCase()}/${slug}` },
    };
  }

  const cidade = decodeURIComponent(slug).toUpperCase();
  const cidadeDisplay = cidade.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Empresas em ${cidadeDisplay}/${ufUpper}`,
    description: `Empresas ativas em ${cidadeDisplay}, ${ufNome(ufUpper)}. Consulta gratuita de CNPJ, razão social, telefones e sócios.`.slice(0, 160),
    alternates: { canonical: `/empresas/${ufUpper.toLowerCase()}/${slug.toLowerCase()}` },
  };
}

export default async function UfSlugPage({ params }: Props) {
  const { uf, slug } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === ufUpper)) notFound();

  return isCnae(slug)
    ? <CnaeView uf={ufUpper} cnae={slug} />
    : <MunicipioView uf={ufUpper} municipioSlug={slug} />;
}

// ─── CNAE × UF view ──────────────────────────────────────────────
async function CnaeView({ uf, cnae }: { uf: string; cnae: string }) {
  const empresas = await topByCnae(cnae, uf, 50);
  if (empresas.length === 0) notFound();
  const descricao = empresas[0].cnae_descricao || `CNAE ${cnae}`;
  const ufName = ufNome(uf);
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: ufName, item: `${SITE_URL}/empresas/${uf.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: descricao, item: `${SITE_URL}/empresas/${uf.toLowerCase()}/${cnae}` },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${descricao} em ${ufName}`,
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

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <nav className="text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li><Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link></li>
          <li>/</li>
          <li><Link href={`/empresas/${uf.toLowerCase()}`} className="hover:text-[#0F4C81]">{ufName}</Link></li>
          <li>/</li>
          <li className="text-slate-700">CNAE {cnae}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{descricao} em {ufName}</h1>
        <p className="mt-2 text-slate-600 text-sm">
          CNAE <Link href={`/cnae/${cnae}`} className="font-mono text-[#0F4C81] hover:underline">{cnae}</Link> · {empresas.length}+ empresas ativas em {ufName} ({uf})
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {empresas.map((e) => (
            <Link
              key={e.cnpj_completo}
              href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0"><Building2 className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate group-hover:text-[#0F4C81]">{e.razao_social}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatCNPJ(e.cnpj_completo)}</div>
                  {e.municipio_nome && (
                    <div className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}</div>
                  )}
                  {e.capital_social ? <div className="text-[11px] text-slate-400 mt-0.5">Cap. {formatCurrency(e.capital_social)}</div> : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">{descricao} em outros estados</h2>
        <div className="flex flex-wrap gap-2">
          {UFS.filter((u) => u.sigla !== uf).slice(0, 26).map((u) => (
            <Link key={u.sigla} href={`/empresas/${u.sigla.toLowerCase()}/${cnae}`} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#0F4C81]">{u.nome}</Link>
          ))}
        </div>
      </section>
    </article>
  );
}

// ─── Município view ───────────────────────────────────────────────
async function MunicipioView({ uf, municipioSlug }: { uf: string; municipioSlug: string }) {
  const cidadeRaw = decodeURIComponent(municipioSlug).toUpperCase().replace(/-/g, " ");
  const cidadeDisplay = cidadeRaw.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const empresas = await listByUF(uf, 1, 50, cidadeRaw);
  if (empresas.estimatedTotalHits === 0) notFound();

  const ufName = ufNome(uf);
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: ufName, item: `${SITE_URL}/empresas/${uf.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: cidadeDisplay, item: `${SITE_URL}/empresas/${uf.toLowerCase()}/${municipioSlug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li><Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link></li>
          <li>/</li>
          <li><Link href={`/empresas/${uf.toLowerCase()}`} className="hover:text-[#0F4C81]">{ufName}</Link></li>
          <li>/</li>
          <li className="text-slate-700">{cidadeDisplay}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Empresas em {cidadeDisplay}/{uf}</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          {empresas.estimatedTotalHits.toLocaleString("pt-BR")} empresas ativas em {cidadeDisplay}.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-[#0F4C81]" /> Empresas</h2>
        <div className="space-y-2">
          {empresas.hits.map((e) => (
            <Link
              key={e.cnpj_completo}
              href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">{e.razao_social}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span className="font-mono">{formatCNPJ(e.cnpj_completo)}</span>
                    {e.cnae_descricao && <span className="truncate max-w-[50ch]">{e.cnae_descricao}</span>}
                  </div>
                </div>
                {e.capital_social ? (
                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400">Capital</div>
                    <div className="text-sm font-semibold text-slate-700">{formatCurrency(e.capital_social)}</div>
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
