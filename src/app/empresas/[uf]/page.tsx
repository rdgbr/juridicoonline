import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { UFS, ufNome, listByUF, getUFStats, type UFStats } from "@/lib/meili";
import { empresaSlug, formatCNPJ, formatCurrency, razaoSocialDisplay } from "@/lib/cnpj";
import { SITE_URL } from "@/lib/seo";
import { Building2, MapPin, TrendingUp, Users, ChevronLeft, ChevronRight, BarChart2 } from "lucide-react";

export const revalidate = 86400;

const PER_PAGE = 50;
const MAX_PAGES = 1000;

type Props = {
  params: Promise<{ uf: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  return UFS.map((u) => ({ uf: u.sigla.toLowerCase() }));
}

function clampPage(raw: string | undefined): number {
  const n = Math.max(1, parseInt(raw || "1", 10) || 1);
  return Math.min(n, MAX_PAGES);
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { uf } = await params;
  const { page: pageRaw } = await searchParams;
  const page = clampPage(pageRaw);
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) return { title: "Estado não encontrado" };
  const nome = ufNome(sigla);
  const pageSuffix = page > 1 ? ` - Página ${page}` : "";
  const canonical = page > 1 ? `/empresas/${uf.toLowerCase()}?page=${page}` : `/empresas/${uf.toLowerCase()}`;
  return {
    title: `Empresas em ${nome} (${sigla})${pageSuffix} - Consulta CNPJ`,
    description: `Consulte empresas ativas em ${nome}. CNPJ, razão social, sócios, endereço e situação cadastral. Mais de ${page === 1 ? "100 mil" : ""} empresas indexadas com dados oficiais da Receita Federal.`.slice(0, 160),
    alternates: { canonical },
    keywords: [`empresas ${nome}`, `CNPJ ${sigla}`, `consulta empresa ${nome}`, `empresas ativas ${sigla}`, "Receita Federal"],
  };
}

// Porcentagem pra exibir no visual
function pct(n: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

export default async function UFPage({ params, searchParams }: Props) {
  const { uf } = await params;
  const { page: pageRaw } = await searchParams;
  const page = clampPage(pageRaw);
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();

  const nome = ufNome(sigla);
  const ufLow = uf.toLowerCase();

  // Busca empresas + stats em paralelo
  const [empresas, stats] = await Promise.all([
    listByUF(sigla, page, PER_PAGE),
    page === 1 ? getUFStats(sigla) : Promise.resolve(null as UFStats | null),
  ]);

  const totalHits = empresas.estimatedTotalHits ?? 0;
  const totalPages = Math.min(Math.ceil(totalHits / PER_PAGE), MAX_PAGES);
  if (empresas.hits.length === 0 && page > 1) notFound();

  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  // Schema.org
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: `Empresas em ${nome}`, item: `${SITE_URL}/empresas/${ufLow}` },
    ],
  };

  const jsonLdPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Empresas ativas em ${nome} (${sigla})`,
    description: `Lista de ${stats ? stats.totalAtivas.toLocaleString("pt-BR") : "mais de 100 mil"} empresas ativas em ${nome}, com CNPJ, situação cadastral, endereço e sócios. Dados Receita Federal.`,
    url: `${SITE_URL}/empresas/${ufLow}`,
    numberOfItems: stats?.totalAtivas,
    inLanguage: "pt-BR",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
  };

  // FAQ só na página 1
  const jsonLdFaq = stats ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quantas empresas existem em ${nome}?`,
        acceptedAnswer: { "@type": "Answer", text: `${nome} tem ${stats.totalAtivas.toLocaleString("pt-BR")} empresas ativas cadastradas na Receita Federal. São ${stats.totalMei.toLocaleString("pt-BR")} MEIs e ${stats.totalSimples.toLocaleString("pt-BR")} optantes pelo Simples Nacional.` },
      },
      {
        "@type": "Question",
        name: `Qual é o setor com mais empresas em ${nome}?`,
        acceptedAnswer: { "@type": "Answer", text: stats.topCnaes[0] ? `O setor mais comum em ${nome} é "${razaoSocialDisplay(stats.topCnaes[0].descricao) || stats.topCnaes[0].descricao}" (CNAE ${stats.topCnaes[0].codigo}), com ${stats.topCnaes[0].count.toLocaleString("pt-BR")} empresas ativas.` : "Informação não disponível." },
      },
      {
        "@type": "Question",
        name: `Quantas empresas foram abertas nos últimos 30 dias em ${nome}?`,
        acceptedAnswer: { "@type": "Answer", text: `Nos últimos 30 dias, foram abertas ${stats.abertas30d.toLocaleString("pt-BR")} novas empresas em ${nome}. Os dados são atualizados diariamente com base no CNPJ da Receita Federal.` },
      },
      {
        "@type": "Question",
        name: `Quais são os municípios com mais empresas em ${nome}?`,
        acceptedAnswer: { "@type": "Answer", text: `Os municípios com mais empresas ativas em ${nome} são: ${stats.topMunicipios.slice(0, 5).map(m => `${m.name} (${m.count.toLocaleString("pt-BR")} empresas)`).join(", ")}.` },
      },
    ],
  } : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPage) }} />
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-[#0F4C81]">Início</Link> /{" "}
        <Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link> /{" "}
        <span className="text-slate-700">{nome}</span>
        {page > 1 && <> / <span className="text-slate-500">Página {page}</span></>}
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas em {nome} ({sigla})
          {page > 1 && <span className="text-slate-400 text-2xl"> · Página {page}</span>}
        </h1>
        <p className="mt-3 text-slate-600 max-w-3xl">
          {stats ? (
            <>
              <strong>{stats.totalAtivas.toLocaleString("pt-BR")}</strong> empresas ativas em {nome} com dados
              oficiais da Receita Federal, atualizados em {hoje}.
              Inclui {stats.totalMei.toLocaleString("pt-BR")} MEIs e {stats.totalSimples.toLocaleString("pt-BR")} empresas
              do Simples Nacional — consulte CNPJ, sócios, telefones e situação cadastral gratuitamente.
            </>
          ) : (
            <>Empresas ativas em {nome} — Página {page} de {totalPages.toLocaleString("pt-BR")}.</>
          )}
        </p>
      </header>

      {/* Stats cards — só página 1 */}
      {stats && page === 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-[#0F4C81] mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Total ativas</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalAtivas.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-slate-500 mt-0.5">empresas no {sigla}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">MEI</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalMei.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-slate-500 mt-0.5">{pct(stats.totalMei, stats.totalAtivas)} do total</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Simples Nacional</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.totalSimples.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-slate-500 mt-0.5">{pct(stats.totalSimples, stats.totalAtivas)} do total</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-violet-600 mb-1">
              <BarChart2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Abertas (30d)</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.abertas30d.toLocaleString("pt-BR")}</div>
            <div className="text-xs text-slate-500 mt-0.5">novos CNPJs no mês</div>
          </div>
        </div>
      )}

      {/* Quick links de filtro — só página 1 */}
      {page === 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { href: `/maiores-empresas/${ufLow}`, label: `Maiores empresas do ${sigla}` },
            { href: `/empresas-mei/${ufLow}`, label: `MEI em ${nome}` },
            { href: `/empresas-simples/${ufLow}`, label: `Simples Nacional em ${sigla}` },
            { href: `/empresas-baixadas/${ufLow}`, label: `Empresas baixadas em ${sigla}` },
            { href: `/empresas-abertas/${ufLow}/${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`, label: `Abertas este mês` },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-[#0F4C81] hover:text-[#0F4C81] transition">
              {label}
            </Link>
          ))}
        </div>
      )}

      <div className={page === 1 ? "grid lg:grid-cols-[1fr_320px] gap-8" : ""}>
        {/* Lista de empresas */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#0F4C81]" />
            {page === 1 ? `Maiores empresas de ${nome}` : `Empresas em ${nome} — Página ${page}`}
          </h2>
          <div className="space-y-2">
            {empresas.hits.map((e) => {
              const nameDisp = razaoSocialDisplay(e.razao_social) || e.razao_social;
              return (
                <Link key={e.cnpj_completo}
                  href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{nameDisp}</div>
                      <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="font-mono">{formatCNPJ(e.cnpj_completo)}</span>
                        {e.municipio_nome && <span>{e.municipio_nome}/{e.uf}</span>}
                        {e.cnae_descricao && <span className="truncate max-w-[40ch]">{razaoSocialDisplay(e.cnae_descricao) || e.cnae_descricao}</span>}
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
              );
            })}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-between gap-2" aria-label="Paginação">
              {page > 1 ? (
                <Link href={page === 2 ? `/empresas/${ufLow}` : `/empresas/${ufLow}?page=${page - 1}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-[#0F4C81] hover:text-[#0F4C81]">
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Link>
              ) : <span />}
              <span className="text-xs text-slate-500">Página {page} de {totalPages.toLocaleString("pt-BR")}</span>
              {page < totalPages ? (
                <Link href={`/empresas/${ufLow}?page=${page + 1}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-[#0F4C81] hover:text-[#0F4C81]">
                  Próxima <ChevronRight className="h-4 w-4" />
                </Link>
              ) : <span />}
            </nav>
          )}

          {/* Bottom links crawler — só página 1 */}
          {page === 1 && totalPages > 1 && (
            <div className="mt-4 text-xs text-slate-400">
              Mais páginas:{" "}
              {Array.from({ length: Math.min(20, totalPages - 1) }, (_, i) => i + 2).map((p, idx, arr) => (
                <span key={p}>
                  <Link href={`/empresas/${ufLow}?page=${p}`} className="text-[#0F4C81] hover:underline">{p}</Link>
                  {idx < arr.length - 1 ? ", " : ""}
                </span>
              ))}
              {totalPages > 21 && <> ... <Link href={`/empresas/${ufLow}?page=${totalPages}`} className="text-[#0F4C81] hover:underline">{totalPages.toLocaleString("pt-BR")}</Link></>}
            </div>
          )}
        </section>

        {/* Sidebar — só página 1 */}
        {page === 1 && (
          <aside className="space-y-6">
            {/* Municípios */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0F4C81]" />
                Municípios com mais empresas
              </h2>
              <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                {(stats?.topMunicipios || []).slice(0, 20).map((m) => (
                  <Link key={m.name}
                    href={`/empresas/${ufLow}/${encodeURIComponent(m.name.toLowerCase())}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition">
                    <span className="text-slate-700 truncate">{m.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{m.count.toLocaleString("pt-BR")}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top CNAEs */}
            {stats && stats.topCnaes.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-[#0F4C81]" />
                  Setores mais comuns em {sigla}
                </h2>
                <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                  {stats.topCnaes.map((c) => (
                    <Link key={c.codigo}
                      href={`/empresas/${ufLow}/${c.codigo}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition group">
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-700 truncate group-hover:text-[#0F4C81] text-xs font-medium">
                          {razaoSocialDisplay(c.descricao) || c.descricao}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">CNAE {c.codigo}</div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono ml-2 shrink-0">{c.count.toLocaleString("pt-BR")}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* FAQ — só página 1 */}
      {page === 1 && jsonLdFaq && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Perguntas frequentes sobre empresas em {nome}
          </h2>
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
      )}

      {/* Texto editorial único por UF — indexável, não repetitivo */}
      {page === 1 && stats && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Sobre as empresas em {nome}</h2>
          <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              {nome} concentra <strong>{stats.totalAtivas.toLocaleString("pt-BR")} empresas ativas</strong> no
              Cadastro Nacional de Pessoas Jurídicas (CNPJ), mantido pela Receita Federal do Brasil.
              Do total, <strong>{pct(stats.totalMei, stats.totalAtivas)}</strong> são Microempreendedores Individuais (MEI)
              e <strong>{pct(stats.totalSimples, stats.totalAtivas)}</strong> são optantes pelo Simples Nacional.
            </p>
            <p>
              O setor econômico com maior número de empresas ativas em {nome} é{" "}
              <strong>
                {stats.topCnaes[0]
                  ? `${razaoSocialDisplay(stats.topCnaes[0].descricao) || stats.topCnaes[0].descricao} (CNAE ${stats.topCnaes[0].codigo})`
                  : "comércio varejista"}
              </strong>
              {stats.topCnaes[0] ? `, com ${stats.topCnaes[0].count.toLocaleString("pt-BR")} empresas` : ""}.
            </p>
            <p>
              Nos últimos 30 dias foram abertas <strong>{stats.abertas30d.toLocaleString("pt-BR")} novas empresas</strong> em {nome}.
              Os dados desta página são extraídos do CNPJ público da Receita Federal e atualizados diariamente.
              Para consultar o CNPJ de uma empresa específica, utilize a caixa de busca ou acesse diretamente
              a página da empresa pelo CNPJ.
            </p>
            <p className="text-xs text-slate-500">
              Fonte: Receita Federal do Brasil — CNPJ público. Atualizado em {hoje}.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
