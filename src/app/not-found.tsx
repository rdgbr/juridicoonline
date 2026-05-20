import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { MapPin, BookOpen, Database, Building2, Search, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Página não encontrada — 404",
  robots: { index: false, follow: true },
};

const TOP_STATES = [
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "SC", nome: "Santa Catarina" },
];

const QUICK_LINKS = [
  { href: "/empresas", label: "Empresas por estado", icon: MapPin, desc: "27 UFs com listagens" },
  { href: "/blog", label: "Blog", icon: BookOpen, desc: "Guias sobre CNPJ e tributário" },
  { href: "/dados", label: "Datasets abertos", icon: Database, desc: "CSV grátis por estado" },
  { href: "/buscar", label: "Busca avançada", icon: Search, desc: "Filtros por UF, CNAE, porte" },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="text-7xl font-bold bg-gradient-to-br from-[#0F4C81] to-[#10B981] bg-clip-text text-transparent">
            404
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-3 text-slate-600 max-w-md mx-auto">
          O endereço acessado não existe ou foi movido. Tente buscar uma empresa
          pelo CNPJ, razão social ou nome de sócio:
        </p>
      </div>

      <div className="mb-10">
        <SearchBox />
      </div>

      {/* Top states */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Empresas nos estados mais buscados
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TOP_STATES.map((s) => (
            <Link
              key={s.sigla}
              href={`/empresas/${s.sigla.toLowerCase()}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition group flex items-center gap-2"
            >
              <Building2 className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81]" />
              <span className="text-sm text-slate-700 group-hover:text-[#0F4C81]">{s.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Ferramentas
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {QUICK_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group flex items-start gap-3"
              >
                <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F4C81]">
                    {l.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{l.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F4C81] shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm text-[#0F4C81] hover:underline inline-flex items-center gap-1"
        >
          ← Voltar à página inicial
        </Link>
      </div>
    </div>
  );
}
