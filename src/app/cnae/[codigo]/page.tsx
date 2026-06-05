import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { topByCnae, UFS, ufNome } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug, formatCNPJ, formatCurrency, razaoSocialDisplay } from "@/lib/cnpj";
import { getCNAEStats } from "@/lib/meili";
import { Building2, MapPin, ArrowRight } from "lucide-react";

export const revalidate = 86400; // 1 day

type Props = { params: Promise<{ codigo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codigo } = await params;
  const clean = codigo.replace(/\D/g, "");
  if (clean.length < 5) return { title: "CNAE não encontrado" };

  const empresas = await topByCnae(clean, undefined, 1);
  const descricaoRaw = empresas[0]?.cnae_descricao || `CNAE ${clean}`;
  const descricao = razaoSocialDisplay(descricaoRaw) || descricaoRaw;

  const title = `${descricao} (CNAE ${clean}) - Empresas no Brasil`;
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

  const [empresas, cnaeStats] = await Promise.all([
    topByCnae(clean, undefined, 50),
    getCNAEStats(clean),
  ]);
  if (empresas.length === 0) notFound();

  const descricaoRaw = empresas[0].cnae_descricao || `CNAE ${clean}`;
  const descricao = razaoSocialDisplay(descricaoRaw) || descricaoRaw;
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Empresas: ${descricao}`,
    description: `${cnaeStats.totalNacional.toLocaleString("pt-BR")} empresas ativas com ${descricao} (CNAE ${clean}) no Brasil.`,
    numberOfItems: cnaeStats.totalNacional || empresas.length,
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

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `O que é o CNAE ${clean}?`,
        acceptedAnswer: { "@type": "Answer", text: `CNAE ${clean} corresponde à atividade econômica "${descricao}", conforme a Classificação Nacional de Atividades Econômicas da Receita Federal do Brasil.` },
      },
      {
        "@type": "Question",
        name: `Quantas empresas têm CNAE ${clean} no Brasil?`,
        acceptedAnswer: { "@type": "Answer", text: `Há ${cnaeStats.totalNacional.toLocaleString("pt-BR")} empresas ativas com CNAE ${clean} (${descricao}) no Brasil. Os dados são baseados no CNPJ público da Receita Federal, atualizados diariamente.` },
      },
      {
        "@type": "Question",
        name: `Em quais estados há mais empresas com CNAE ${clean}?`,
        acceptedAnswer: { "@type": "Answer", text: cnaeStats.topUFs.length > 0 ? `Os estados com mais empresas de ${descricao} são: ${cnaeStats.topUFs.slice(0, 5).map(u => `${u.nome} (${u.count.toLocaleString("pt-BR")})`).join(", ")}.` : "Dados de distribuição por estado disponíveis na página." },
      },
    ],
  };

  // Estados com mais empresas neste CNAE (da stats real)
  const topUFsForCnae = cnaeStats.topUFs.length > 0 ? cnaeStats.topUFs : (() => {
    const porUF = empresas.reduce((acc, e) => { if (e.uf) acc[e.uf] = (acc[e.uf] || 0) + 1; return acc; }, {} as Record<string, number>);
    return Object.entries(porUF).sort((a, b) => b[1] - a[1]).map(([uf, count]) => ({ uf, nome: ufNome(uf), count }));
  })();

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

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
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
          <span>CNAE <span className="font-mono font-medium">{clean}</span></span>
          {cnaeStats.totalNacional > 0 && (
            <span><strong className="text-slate-900">{cnaeStats.totalNacional.toLocaleString("pt-BR")}</strong> empresas ativas no Brasil</span>
          )}
          <span>Atualizado em {hoje}</span>
        </div>
      </header>

      {/* Stats por UF — texto editorial único */}
      {cnaeStats.topUFs.length > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
          <h2 className="font-semibold text-slate-900 mb-2">Sobre o CNAE {clean}</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            A atividade <strong>{descricao}</strong> (CNAE {clean}) conta com{" "}
            <strong>{cnaeStats.totalNacional.toLocaleString("pt-BR")} empresas ativas</strong> no Brasil.
            Os estados com maior concentração são{" "}
            {cnaeStats.topUFs.slice(0, 3).map((u, i) => (
              <span key={u.uf}>
                <Link href={`/empresas/${u.uf.toLowerCase()}/${clean}`} className="text-[#0F4C81] hover:underline">
                  {u.nome}
                </Link> ({u.count.toLocaleString("pt-BR")})
                {i < 2 ? ", " : ""}
              </span>
            ))}.{" "}
            Dados da Receita Federal atualizados diariamente.
          </p>
        </div>
      )}

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

      {topUFsForCnae.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight mb-3">
            {descricao} por estado
            {cnaeStats.totalNacional > 0 && <span className="text-slate-400 font-normal text-base"> — {cnaeStats.totalNacional.toLocaleString("pt-BR")} empresas no Brasil</span>}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {topUFsForCnae.map((u) => (
              <Link key={u.uf} href={`/empresas/${u.uf.toLowerCase()}/${clean}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition">
                <div className="text-sm font-medium text-slate-900">{u.nome}</div>
                <div className="text-xs text-slate-500 font-mono">{u.count.toLocaleString("pt-BR")} empresas</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Perguntas frequentes sobre CNAE {clean}</h2>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
          {(jsonLdFaq.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="group px-5 py-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-medium text-slate-900 text-sm">
                {q.name}
                <span className="text-slate-400 group-open:rotate-45 transition-transform text-lg leading-none flex-shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold tracking-tight mb-3 text-slate-700">Ver {descricao} em cada estado</h2>
        <div className="flex flex-wrap gap-2">
          {UFS.map((u) => (
            <Link key={u.sigla} href={`/empresas/${u.sigla.toLowerCase()}/${clean}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#0F4C81] hover:text-[#0F4C81]">
              {u.nome}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
