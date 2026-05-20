import Link from "next/link";
import type { Metadata } from "next";
import { searchEmpresas, UFS } from "@/lib/meili";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import { SearchBox } from "@/components/SearchBox";
import { Building2, Filter, X, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

type SP = {
  q?: string;
  page?: string;
  uf?: string;
  situacao?: string;
  porte?: string;
  simples?: string;
  mei?: string;
};

type Props = { searchParams: Promise<SP> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  if (!q) return { title: "Buscar empresas — Jurídico Online" };
  return {
    title: `Resultados para "${q}"`,
    description: `Resultados da busca por "${q}" em empresas brasileiras.`,
    robots: { index: false, follow: true },
  };
}

function buildFilters(sp: SP): string[] {
  const f: string[] = [];
  if (sp.uf) f.push(`uf = "${sp.uf.toUpperCase()}"`);
  if (sp.situacao) f.push(`situacao = "${sp.situacao.toUpperCase()}"`);
  if (sp.porte) f.push(`porte = "${sp.porte.toUpperCase()}"`);
  if (sp.simples === "1") f.push('opcao_simples = "S"');
  if (sp.mei === "1") f.push('opcao_mei = "S"');
  return f;
}

function buildHref(currentSp: SP, override: Partial<SP>): string {
  const next = { ...currentSp, ...override };
  // Reset page when filter changes
  if (Object.keys(override).some((k) => k !== "page")) next.page = undefined;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) {
    if (v) params.set(k, String(v));
  }
  return `/buscar?${params.toString()}`;
}

export default async function BuscarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const perPage = 25;
  const filters = buildFilters(sp);

  const res = q
    ? await searchEmpresas({
        q,
        limit: perPage,
        offset: (page - 1) * perPage,
        filter: filters.length ? filters : undefined,
        facets: ["uf", "situacao", "porte"],
      })
    : { hits: [], estimatedTotalHits: 0, processingTimeMs: 0, query: "" };

  const activeFilters = [
    sp.uf && { key: "uf", label: `UF: ${sp.uf.toUpperCase()}` },
    sp.situacao && { key: "situacao", label: `Situação: ${sp.situacao}` },
    sp.porte && { key: "porte", label: `Porte: ${sp.porte}` },
    sp.simples === "1" && { key: "simples", label: "Simples Nacional" },
    sp.mei === "1" && { key: "mei", label: "MEI" },
  ].filter(Boolean) as Array<{ key: string; label: string }>;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <SearchBox defaultValue={q} />
      </div>

      {q && (
        <div className="flex items-center justify-between mb-4 text-sm">
          <p className="text-slate-500">
            {res.estimatedTotalHits.toLocaleString("pt-BR")} resultados
            {activeFilters.length > 0 && " com filtros"}
            <span className="text-slate-400 ml-2">({res.processingTimeMs}ms)</span>
          </p>
          {activeFilters.length > 0 && (
            <Link
              href={`/buscar?q=${encodeURIComponent(q)}`}
              className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1"
            >
              <X className="h-3 w-3" /> Limpar filtros
            </Link>
          )}
        </div>
      )}

      {/* Active filter chips */}
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

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
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
              <RadioRow
                key={s}
                name="situacao"
                value={s}
                label={s.charAt(0) + s.slice(1).toLowerCase()}
                checked={sp.situacao === s}
                sp={sp}
              />
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

        {/* Results */}
        <div>
          {!q ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Digite um termo de busca acima para começar.
              <p className="text-xs text-slate-400 mt-2">
                Pesquise por CNPJ, razão social, nome de sócio, telefone ou endereço.
              </p>
            </div>
          ) : res.hits.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Nenhuma empresa encontrada para <strong>&quot;{q}&quot;</strong>
              {activeFilters.length > 0 && " com os filtros aplicados"}.
            </div>
          ) : (
            <div className="space-y-2">
              {res.hits.map((e) => (
                <Link
                  key={e.cnpj_completo}
                  href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] p-2 shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900">{e.razao_social}</div>
                      {e.nome_fantasia && e.nome_fantasia !== e.razao_social && (
                        <div className="text-sm text-slate-600">{e.nome_fantasia}</div>
                      )}
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="font-mono">{formatCNPJ(e.cnpj_completo)}</span>
                        {e.municipio_nome && (
                          <span className="inline-flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}
                          </span>
                        )}
                        {e.cnae_descricao && <span className="truncate max-w-[40ch]">{e.cnae_descricao}</span>}
                        <span className={e.situacao === "ATIVA" ? "text-emerald-600" : "text-rose-600"}>
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
          )}

          {q && res.estimatedTotalHits > perPage && (
            <nav className="mt-8 flex items-center justify-between">
              {page > 1 ? (
                <Link
                  href={buildHref(sp, { page: String(page - 1) })}
                  className="text-sm text-[#0F4C81] hover:underline"
                >
                  ← Anterior
                </Link>
              ) : (
                <span />
              )}
              <span className="text-xs text-slate-500">
                Página {page} de {Math.ceil(res.estimatedTotalHits / perPage)}
              </span>
              {page * perPage < res.estimatedTotalHits ? (
                <Link
                  href={buildHref(sp, { page: String(page + 1) })}
                  className="text-sm text-[#0F4C81] hover:underline"
                >
                  Próxima →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function RadioRow({
  name,
  value,
  label,
  checked,
  sp,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  sp: SP;
}) {
  return (
    <Link
      href={buildHref(sp, { [name]: value || undefined } as Partial<SP>)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition ${
        checked ? "bg-[#0F4C81]/8 text-[#0F4C81] font-medium" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span
        className={`size-3.5 rounded-full border-2 shrink-0 ${
          checked ? "border-[#0F4C81] bg-[#0F4C81]" : "border-slate-300"
        }`}
      />
      {label}
    </Link>
  );
}

function ToggleRow({
  name,
  label,
  checked,
  sp,
}: {
  name: string;
  label: string;
  checked: boolean;
  sp: SP;
}) {
  return (
    <Link
      href={buildHref(sp, { [name]: checked ? undefined : "1" } as Partial<SP>)}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition ${
        checked ? "bg-[#0F4C81]/8 text-[#0F4C81] font-medium" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span
        className={`size-3.5 rounded border-2 shrink-0 inline-flex items-center justify-center ${
          checked ? "border-[#0F4C81] bg-[#0F4C81]" : "border-slate-300"
        }`}
      >
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
