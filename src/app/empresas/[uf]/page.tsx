import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { UFS, ufNome, listByUF, listMunicipiosByUF } from "@/lib/meili";
import { empresaSlug, formatCNPJ, formatCurrency, razaoSocialDisplay } from "@/lib/cnpj";
import { Building2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 86400;

const PER_PAGE = 50;
const MAX_PAGES = 1000; // cap pra evitar abuso de crawler em paginação infinita

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
  const ufLow = uf.toLowerCase();

  const pageSuffix = page > 1 ? ` - Página ${page}` : "";
  // Para SEO: páginas paginadas usam canonical próprio (não consolidar com page=1)
  // — assim cada página vira indexable independente, capturando long-tail.
  const canonical = page > 1 ? `/empresas/${ufLow}?page=${page}` : `/empresas/${ufLow}`;

  return {
    title: `Empresas em ${nome} (${sigla})${pageSuffix} - consulta de CNPJs ativos`,
    description: `Lista de empresas ativas em ${nome}${pageSuffix}. Pesquise por município, CNAE, porte. Dados oficiais da Receita Federal.`.slice(0, 160),
    alternates: { canonical },
    // robots: noindex em páginas vazias futuras seria gerenciado em runtime — aqui
    // confiamos que getStaticProps + notFound() já protege contra páginas além do total.
  };
}

export default async function UFPage({ params, searchParams }: Props) {
  const { uf } = await params;
  const { page: pageRaw } = await searchParams;
  const page = clampPage(pageRaw);
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();

  const nome = ufNome(sigla);
  const ufLow = uf.toLowerCase();

  const [empresas, municipios] = await Promise.all([
    listByUF(sigla, page, PER_PAGE),
    page === 1 ? listMunicipiosByUF(sigla) : Promise.resolve([]),
  ]);

  const totalHits = empresas.estimatedTotalHits ?? 0;
  const totalPages = Math.min(Math.ceil(totalHits / PER_PAGE), MAX_PAGES);
  const top50Mun = municipios.slice(0, 50);

  // Se a página solicitada está vazia, 404 pra não desperdiçar crawl budget
  if (empresas.hits.length === 0 && page > 1) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-[#0F4C81]">Início</Link> /{" "}
        <Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link> /{" "}
        <span className="text-slate-700">{nome}</span>
        {page > 1 && <> / <span className="text-slate-500">Página {page}</span></>}
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas em {nome}
          {page > 1 && <span className="text-slate-400"> · Página {page}</span>}
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          {totalHits.toLocaleString("pt-BR")} empresas ativas em {nome}.
          {page === 1 ? " Pesquise por CNPJ, razão social ou navegue pelos municípios." : ` Exibindo página ${page} de ${totalPages.toLocaleString("pt-BR")}.`}
        </p>
      </header>

      <div className={page === 1 ? "grid lg:grid-cols-[1fr_320px] gap-8" : ""}>
        {/* Empresas em destaque (lista paginada) */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#0F4C81]" />
            {page === 1 ? "Empresas em destaque" : `Empresas — Página ${page}`}
          </h2>
          <div className="space-y-2">
            {empresas.hits.map((e) => {
              const nameDisp = razaoSocialDisplay(e.razao_social) || e.razao_social;
              return (
                <Link
                  key={e.cnpj_completo}
                  href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition"
                >
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

          {/* Pagination — rel=prev/next sinaliza pro Google sequência */}
          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-between gap-2" aria-label="Paginação">
              {page > 1 ? (
                <Link
                  href={page === 2 ? `/empresas/${ufLow}` : `/empresas/${ufLow}?page=${page - 1}`}
                  rel="prev"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-[#0F4C81] hover:text-[#0F4C81]"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Link>
              ) : <span />}
              <span className="text-xs text-slate-500">
                Página {page} de {totalPages.toLocaleString("pt-BR")}
              </span>
              {page < totalPages ? (
                <Link
                  href={`/empresas/${ufLow}?page=${page + 1}`}
                  rel="next"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-[#0F4C81] hover:text-[#0F4C81]"
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </Link>
              ) : <span />}
            </nav>
          )}

          {/* Bottom internal linking: top N pages como links pra crawler descobrir */}
          {page === 1 && totalPages > 1 && (
            <div className="mt-6 text-xs text-slate-500">
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

        {/* Municípios — só renderiza na página 1 */}
        {page === 1 && (
          <aside>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#0F4C81]" />
              Principais municípios
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {top50Mun.map((m) => (
                <Link
                  key={m.name}
                  href={`/empresas/${ufLow}/${encodeURIComponent(m.name.toLowerCase())}`}
                  className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition"
                >
                  <span className="text-slate-700 truncate">{m.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{m.count.toLocaleString("pt-BR")}</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Empresas em ${nome}${page > 1 ? ` — Página ${page}` : ""}`,
            url: `/empresas/${ufLow}${page > 1 ? `?page=${page}` : ""}`,
            isPartOf: page > 1 ? { "@type": "WebPage", "@id": `/empresas/${ufLow}` } : undefined,
          }),
        }}
      />
    </div>
  );
}
