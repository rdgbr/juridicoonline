import Link from "next/link";
import type { Metadata } from "next";
import { UFS } from "@/lib/meili";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Empresas por estado — todos os estados do Brasil",
  description:
    "Explore empresas ativas em todos os 27 estados brasileiros. Mais de 65 milhões de CNPJs com dados oficiais da Receita Federal.",
  alternates: { canonical: "/empresas" },
};

export default function EmpresasIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas por estado
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Explore empresas ativas em qualquer um dos 27 estados brasileiros. Cada estado tem
          listagem por município, CNAE e porte.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {UFS.map((u) => (
          <Link
            key={u.sigla}
            href={`/empresas/${u.sigla.toLowerCase()}`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition flex items-center justify-between group"
          >
            <div>
              <div className="font-medium text-slate-900 group-hover:text-[#0F4C81]">
                {u.nome}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Empresas em {u.nome}</div>
            </div>
            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
              {u.sigla}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
