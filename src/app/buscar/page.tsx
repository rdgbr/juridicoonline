import Link from "next/link";
import type { Metadata } from "next";
import { searchEmpresas } from "@/lib/meili";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import { SearchBox } from "@/components/SearchBox";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  if (!q) return { title: "Buscar empresas" };
  return {
    title: `Resultados para "${q}"`,
    description: `Resultados da busca por "${q}" em empresas brasileiras.`,
    robots: { index: false, follow: true },
  };
}

export default async function BuscarPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const perPage = 25;

  const res = q
    ? await searchEmpresas({ q, limit: perPage, offset: (page - 1) * perPage })
    : { hits: [], estimatedTotalHits: 0, processingTimeMs: 0, query: "" };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <SearchBox defaultValue={q} />
      </div>

      {q && (
        <p className="text-sm text-slate-500 mb-4">
          {res.estimatedTotalHits.toLocaleString("pt-BR")} resultados para <strong>"{q}"</strong>{" "}
          <span className="text-slate-400">({res.processingTimeMs}ms)</span>
        </p>
      )}

      {!q ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          Digite um termo de busca acima para começar.
        </div>
      ) : res.hits.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          Nenhuma empresa encontrada para <strong>"{q}"</strong>.
        </div>
      ) : (
        <div className="space-y-2">
          {res.hits.map((e) => (
            <Link
              key={e.cnpj_completo}
              href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition"
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
                    {e.municipio_nome && <span>{e.municipio_nome}/{e.uf}</span>}
                    {e.cnae_descricao && <span className="truncate max-w-[40ch]">{e.cnae_descricao}</span>}
                    <span className={e.situacao === "ATIVA" ? "text-emerald-600" : "text-rose-600"}>
                      {e.situacao}
                    </span>
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
      )}

      {q && res.estimatedTotalHits > perPage && (
        <div className="mt-8 flex items-center justify-between">
          {page > 1 ? (
            <Link
              href={`/buscar?q=${encodeURIComponent(q)}&page=${page - 1}`}
              className="text-sm text-[#0F4C81] hover:underline"
            >
              ← Anterior
            </Link>
          ) : <span />}
          <span className="text-xs text-slate-500">Página {page}</span>
          {page * perPage < res.estimatedTotalHits ? (
            <Link
              href={`/buscar?q=${encodeURIComponent(q)}&page=${page + 1}`}
              className="text-sm text-[#0F4C81] hover:underline"
            >
              Próxima →
            </Link>
          ) : <span />}
        </div>
      )}
    </div>
  );
}
