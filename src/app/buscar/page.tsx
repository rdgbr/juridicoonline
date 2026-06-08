import Link from "next/link";
import type { Metadata } from "next";
import { searchEmpresas, UFS } from "@/lib/meili";
import { searchSociosByQuery } from "@/lib/socios";
import { empresaSlug, formatCNPJ, formatCurrency, razaoSocialDisplay } from "@/lib/cnpj";
import { SearchBox } from "@/components/SearchBox";
import { Building2, Filter, X, MapPin, User, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = {
  q?: string;
  page?: string;
  uf?: string;
  situacao?: string;
  porte?: string;
  simples?: string;
  mei?: string;
  tipo?: string; // 'empresa' | 'socio' | undefined (= ambos)
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  if (!q) return { title: "Buscar empresas — Jurídico Online" };
  return {
    title: `Resultados para "${q}"`,
    description: `Resultados da busca por "${q}" — empresas, sócios e CNPJs.`,
    robots: { index: false, follow: true },
  };
}

function buildFilters(sp: SP): string[] {
  const f: string[] = [];
  if (sp.uf) f.push(`uf = "${sp.uf.toUpperCase()}"`);
  const situacao = sp.situacao?.toUpperCase() || "ATIVA";
  f.push(`situacao = "${situacao}"`);
  if (sp.porte) f.push(`porte = "${sp.porte.toUpperCase()}"`);
  if (sp.simples === "1") f.push('opcao_simples = "S"');
  if (sp.mei === "1") f.push('opcao_mei = "S"');
  return f;
}

function buildFiltersNoSituacao(sp: SP): string[] {
  const f: string[] = [];
  if (sp.uf) f.push(`uf = "${sp.uf.toUpperCase()}"`);
  if (sp.porte) f.push(`porte = "${sp.porte.toUpperCase()}"`);
  if (sp.simples === "1") f.push('opcao_simples = "S"');
  if (sp.mei === "1") f.push('opcao_mei = "S"');
  return f;
}

function buildHref(currentSp: SP, override: Partial<SP>): string {
  const next = { ...currentSp, ...override };
  if (Object.keys(override).some((k) => k !== "page")) next.page = undefined;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (v) params.set(k, String(v));
  }
  return `/buscar?${params.toString()}`;
}

// Detecta se a query parece ser nome de pessoa (sem dígitos, 2+ palavras)
function looksLikePerson(q: string): boolean {
  const words = q.trim().split(/\s+/);
  return words.length >= 2 && !/\d/.test(q);
}

export default async function BuscarPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const perPage = 25;
  const tipo = sp.tipo || "";

  const isPerson = looksLikePerson(q);

  // Busca paralela: empresas (MeiliSearch) + sócios (Postgres)
  const runEmpresas = q && tipo !== "socio";
  const runSocios = q && tipo !== "empresa";

  const [empresaRes, socioHits] = await Promise.all([
    runEmpresas
      ? searchEmpresas({
          q,
          limit: perPage,
          offset: (page - 1) * perPage,
          filter: buildFilters(sp),
          sort: ["capital_social:desc"],
          facets: ["uf", "situacao", "porte"],
        })
      : Promise.resolve({ hits: [], estimatedTotalHits: 0, processingTimeMs: 0, query: "" }),

    runSocios ? searchSociosByQuery(q, 8) : Promise.resolve([]),
  ]);

  // Se zero empresas com filtro ATIVA, tenta sem filtro de situação para mostrar total real
  const zeroComFiltro = runEmpresas && empresaRes.estimatedTotalHits === 0 && !sp.situacao;
  const [semFiltroRes] = await Promise.all([
    zeroComFiltro
      ? searchEmpresas({ q, limit: 1, filter: buildFiltersNoSituacao(sp) })
      : Promise.resolve(null),
  ]);
  const totalSemFiltro = semFiltroRes?.estimatedTotalHits ?? 0;

  const empresaCount = empresaRes.estimatedTotalHits;
  const socioCount = socioHits.length;

  const activeFilters = [
    sp.uf && { key: "uf", label: `Estado: ${sp.uf.toUpperCase()}` },
    { key: "situacao", label: `Situação: ${(sp.situacao || "ATIVA")}` },
    sp.porte && { key: "porte", label: `Porte: ${sp.porte}` },
    sp.simples === "1" && { key: "simples", label: "Simples Nacional" },
    sp.mei === "1" && { key: "mei", label: "MEI" },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  const showEmpresas = tipo !== "socio";
  const showSocios = tipo !== "empresa";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <SearchBox defaultValue={q} />
      </div>

      {q && (
        <>
          {/* Tabs tipo de resultado */}
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            <TypeTab
              href={buildHref(sp, { tipo: undefined, page: undefined })}
              active={!tipo}
              label="Tudo"
              count={q ? empresaCount + socioCount : undefined}
            />
            <TypeTab
              href={buildHref(sp, { tipo: "empresa", page: undefined })}
              active={tipo === "empresa"}
              label="Empresas"
              icon={<Building2 className="h-3.5 w-3.5" />}
              count={empresaCount}
            />
            <TypeTab
              href={buildHref(sp, { tipo: "socio", page: undefined })}
              active={tipo === "socio"}
              label="Sócios"
              icon={<User className="h-3.5 w-3.5" />}
              count={socioCount}
            />
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <p className="text-slate-500">
              {showEmpresas && (
                <span>
                  <strong className="text-slate-700">{empresaCount.toLocaleString("pt-BR")}</strong> empresa{empresaCount !== 1 ? "s" : ""}
                  {activeFilters.length > 0 && " com filtros"}
                </span>
              )}
              {showEmpresas && showSocios && socioCount > 0 && <span className="text-slate-300 mx-2">·</span>}
              {showSocios && socioCount > 0 && (
                <span>
                  <strong className="text-slate-700">{socioCount}</strong> sócio{socioCount !== 1 ? "s" : ""}
                </span>
              )}
              {empresaRes.processingTimeMs > 0 && (
                <span className="text-slate-400 ml-2">({empresaRes.processingTimeMs}ms)</span>
              )}
            </p>
            {activeFilters.length > 0 && (
              <Link
                href={buildHref(sp, { uf: undefined, situacao: undefined, porte: undefined, simples: undefined, mei: undefined })}
                className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Limpar filtros
              </Link>
            )}
          </div>

          {/* Filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {activeFilters.map((f) => (
                <Link
                  key={f.key}
                  href={buildHref(sp, { [f.key]: undefined } as Partial<SP>)}
                  className="inline-flex items-center gap-1.5 bg-[#0F4C81]/8 text-[#0F4C81] text-xs px-2 py-1 rounded-full hover:bg-[#0F4C81]/12 transition"
                >
                  {f.label} <X className="h-3 w-3" />
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar — só aparece em busca de empresas */}
        {showEmpresas && tipo !== "socio" && (
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Filter className="h-3.5 w-3.5" /> Filtros
            </div>

            <FilterGroup title="Estado">
              <details className="group" {...(sp.uf ? { open: true } : {})}>
                <summary className="cursor-pointer list-none flex items-center justify-between text-xs text-slate-700 hover:text-[#0F4C81] py-1.5 px-2 rounded-md hover:bg-slate-50">
                  <span>{sp.uf ? UFS.find((u) => u.sigla === sp.uf)?.nome || sp.uf : "Selecionar estado"}</span>
                  <span className="text-slate-400 group-open:rotate-90 transition">›</span>
                </summary>
                <div className="mt-1 max-h-56 overflow-y-auto rounded-md border border-slate-200 bg-white">
                  <Link
                    href={buildHref(sp, { uf: undefined })}
                    className={`block px-3 py-1.5 text-xs hover:bg-slate-50 ${!sp.uf ? "text-[#0F4C81] font-medium" : "text-slate-700"}`}
                  >
                    Todos
                  </Link>
                  {UFS.map((u) => (
                    <Link
                      key={u.sigla}
                      href={buildHref(sp, { uf: u.sigla })}
                      className={`block px-3 py-1.5 text-xs hover:bg-slate-50 ${sp.uf === u.sigla ? "text-[#0F4C81] font-medium bg-[#0F4C81]/5" : "text-slate-700"}`}
                    >
                      {u.nome} <span className="text-slate-400">({u.sigla})</span>
                    </Link>
                  ))}
                </div>
              </details>
            </FilterGroup>

            <FilterGroup title="Situação cadastral">
              {["ATIVA", "BAIXADA", "SUSPENSA", "INAPTA"].map((s) => (
                <RadioRow key={s} name="situacao" value={s} label={s.charAt(0) + s.slice(1).toLowerCase()} checked={sp.situacao === s} sp={sp} />
              ))}
              <RadioRow name="situacao" value="" label="Todas" checked={!sp.situacao} sp={sp} />
            </FilterGroup>

            <FilterGroup title="Porte">
              <RadioRow name="porte" value="MICRO EMPRESA" label="Microempresa" checked={sp.porte === "MICRO EMPRESA"} sp={sp} />
              <RadioRow name="porte" value="EPP" label="EPP" checked={sp.porte === "EPP"} sp={sp} />
              <RadioRow name="porte" value="DEMAIS" label="Demais" checked={sp.porte === "DEMAIS"} sp={sp} />
              <RadioRow name="porte" value="" label="Todos" checked={!sp.porte} sp={sp} />
            </FilterGroup>

            <FilterGroup title="Regime tributário">
              <ToggleRow name="simples" label="Simples Nacional" checked={sp.simples === "1"} sp={sp} />
              <ToggleRow name="mei" label="MEI" checked={sp.mei === "1"} sp={sp} />
            </FilterGroup>
          </aside>
        )}

        {/* Results */}
        <div className={showEmpresas && tipo !== "socio" ? "" : "lg:col-span-2"}>
          {!q ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Digite um nome, CNPJ, telefone ou endereço para buscar.
              <p className="text-xs text-slate-400 mt-2">
                Ex: &ldquo;Petrobras&rdquo;, &ldquo;João Silva&rdquo;, &ldquo;33.000.167/0001-01&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* ── Sócios ───────────────────────────────────── */}
              {showSocios && socioHits.length > 0 && (
                <section>
                  {!tipo && <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Sócios encontrados</h2>}
                  <div className="space-y-1.5">
                    {socioHits.map((hit) => (
                      <Link
                        key={hit.nomeSlug}
                        href={`/socio/${hit.nomeSlug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#0F4C81] hover:shadow-sm transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 group-hover:text-[#0F4C81]">
                              {razaoSocialDisplay(hit.nome) || hit.nome}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Sócio ou representante em{" "}
                              <strong>{hit.count.toLocaleString("pt-BR")}</strong> empresa{hit.count !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81] shrink-0" />
                      </Link>
                    ))}
                  </div>
                  {tipo === "socio" && socioHits.length === 8 && (
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Mostrando os {socioHits.length} mais relevantes. Refine a busca para resultados mais precisos.
                    </p>
                  )}
                </section>
              )}

              {/* ── Empresas ─────────────────────────────────── */}
              {showEmpresas && (
                <section>
                  {!tipo && empresaRes.hits.length > 0 && (
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> Empresas encontradas
                    </h2>
                  )}

                  {empresaRes.hits.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                      {isPerson && tipo !== "empresa" ? (
                        // Query parece nome de pessoa e não achou empresa
                        socioHits.length > 0 ? null : (
                          <div>
                            <p className="font-medium">Nenhum resultado para <strong>&ldquo;{q}&rdquo;</strong></p>
                            <p className="text-sm mt-1">
                              Tente buscar pelo nome da empresa ou pelo CNPJ completo.
                            </p>
                          </div>
                        )
                      ) : (
                        <div>
                          <p className="font-medium">
                            Nenhuma empresa{" "}
                            {!sp.situacao && <span className="font-semibold">ativa</span>} encontrada para <strong>&ldquo;{q}&rdquo;</strong>
                            {activeFilters.length > 1 && " com os filtros aplicados"}.
                          </p>
                          {/* Sugere buscar sem filtro de situação */}
                          {!sp.situacao && totalSemFiltro > 0 && (
                            <p className="text-sm mt-2">
                              Encontramos{" "}
                              <Link
                                href={buildHref(sp, { situacao: "" })}
                                className="text-[#0F4C81] font-medium hover:underline"
                              >
                                {totalSemFiltro.toLocaleString("pt-BR")} empresa{totalSemFiltro !== 1 ? "s" : ""} em outras situações
                              </Link>
                              .
                            </p>
                          )}
                          {/* Sugere sócios se não estava já mostrando */}
                          {tipo === "empresa" && socioCount > 0 && (
                            <p className="text-sm mt-2">
                              <Link
                                href={buildHref(sp, { tipo: "socio" })}
                                className="text-[#0F4C81] font-medium hover:underline"
                              >
                                {socioCount} sócio{socioCount > 1 ? "s" : ""} encontrado{socioCount > 1 ? "s" : ""} com esse nome →
                              </Link>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        {empresaRes.hits.map((e) => (
                          <Link
                            key={e.cnpj_completo}
                            href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                            className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] p-2 shrink-0">
                                <Building2 className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900 group-hover:text-[#0F4C81]">
                                  {razaoSocialDisplay(e.razao_social) || e.razao_social}
                                </div>
                                {e.nome_fantasia && e.nome_fantasia !== e.razao_social && (
                                  <div className="text-sm text-slate-600">
                                    {razaoSocialDisplay(e.nome_fantasia) || e.nome_fantasia}
                                  </div>
                                )}
                                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                                  <span className="font-mono">{formatCNPJ(e.cnpj_completo)}</span>
                                  {e.municipio_nome && (
                                    <span className="inline-flex items-center gap-0.5">
                                      <MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}
                                    </span>
                                  )}
                                  {e.cnae_descricao && (
                                    <span className="truncate max-w-[40ch]">
                                      {razaoSocialDisplay(e.cnae_descricao) || e.cnae_descricao}
                                    </span>
                                  )}
                                  <span className={e.situacao === "ATIVA" ? "text-emerald-600 font-medium" : "text-rose-600"}>
                                    {e.situacao}
                                  </span>
                                </div>
                              </div>
                              {e.capital_social ? (
                                <div className="text-right shrink-0">
                                  <div className="text-xs text-slate-400">Capital</div>
                                  <div className="text-sm font-semibold text-slate-700">
                                    {formatCurrency(e.capital_social)}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Pagination */}
                      {empresaRes.estimatedTotalHits > perPage && (
                        <nav className="mt-8 flex items-center justify-between">
                          {page > 1 ? (
                            <Link href={buildHref(sp, { page: String(page - 1) })} className="text-sm text-[#0F4C81] hover:underline">
                              ← Anterior
                            </Link>
                          ) : <span />}
                          <span className="text-xs text-slate-500">
                            Página {page} de {Math.ceil(empresaRes.estimatedTotalHits / perPage).toLocaleString("pt-BR")}
                          </span>
                          {page * perPage < empresaRes.estimatedTotalHits ? (
                            <Link href={buildHref(sp, { page: String(page + 1) })} className="text-sm text-[#0F4C81] hover:underline">
                              Próxima →
                            </Link>
                          ) : <span />}
                        </nav>
                      )}
                    </>
                  )}
                </section>
              )}

              {/* Empty state geral — nenhum resultado em nada */}
              {q && !socioHits.length && empresaCount === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                  <p className="font-medium">Nenhum resultado para <strong>&ldquo;{q}&rdquo;</strong></p>
                  <p className="text-sm mt-2 text-slate-400">
                    Tente um CNPJ completo (14 dígitos), razão social ou nome de sócio.
                    {!sp.situacao && totalSemFiltro > 0 && (
                      <> Há {totalSemFiltro.toLocaleString("pt-BR")} empresa{totalSemFiltro !== 1 ? "s" : ""} em{" "}
                        <Link href={buildHref(sp, { situacao: "" })} className="text-[#0F4C81] hover:underline">
                          outras situações cadastrais
                        </Link>
                        .
                      </>
                    )}
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function TypeTab({
  href,
  active,
  label,
  count,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
        active
          ? "bg-[#0F4C81] text-white border-[#0F4C81]"
          : "border-slate-200 text-slate-600 hover:border-[#0F4C81] hover:text-[#0F4C81] bg-white"
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
          {count.toLocaleString("pt-BR")}
        </span>
      )}
    </Link>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function RadioRow({ name, value, label, checked, sp }: { name: string; value: string; label: string; checked: boolean; sp: SP }) {
  return (
    <Link
      href={buildHref(sp, { [name]: value || undefined } as Partial<SP>)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition ${checked ? "bg-[#0F4C81]/8 text-[#0F4C81] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
    >
      <span className={`size-3.5 rounded-full border-2 shrink-0 ${checked ? "border-[#0F4C81] bg-[#0F4C81]" : "border-slate-300"}`} />
      {label}
    </Link>
  );
}

function ToggleRow({ name, label, checked, sp }: { name: string; label: string; checked: boolean; sp: SP }) {
  return (
    <Link
      href={buildHref(sp, { [name]: checked ? undefined : "1" } as Partial<SP>)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition ${checked ? "bg-[#0F4C81]/8 text-[#0F4C81] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
    >
      <span className={`size-3.5 rounded border-2 shrink-0 inline-flex items-center justify-center ${checked ? "border-[#0F4C81] bg-[#0F4C81]" : "border-slate-300"}`}>
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </Link>
  );
}
