import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import type { Empresa } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { UFS, ufNome } from "@/lib/meili";

export type UfListConfig = {
  routePrefix: string;       // e.g. "/maiores-empresas"
  h1: (ufName: string) => string;
  metaDescription: (ufName: string) => string;
  emptyMessage: string;
  showCapital?: boolean;
  showDataAbertura?: boolean;
};

export function UfListView({
  uf,
  ufName,
  empresas,
  config,
}: {
  uf: string;
  ufName: string;
  empresas: Empresa[];
  config: UfListConfig;
}) {
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: ufName, item: `${SITE_URL}/empresas/${uf.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: config.h1(ufName), item: `${SITE_URL}${config.routePrefix}/${uf.toLowerCase()}` },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.h1(ufName),
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
          <li className="text-slate-700">{config.h1("")}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{config.h1(ufName)}</h1>
        <p className="mt-2 text-slate-600 text-sm">{empresas.length}+ empresas em {ufName}</p>
      </header>

      {empresas.length === 0 ? (
        <p className="text-slate-600">{config.emptyMessage}</p>
      ) : (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {empresas.map((e, i) => (
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
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium text-slate-900 truncate group-hover:text-[#0F4C81]">
                        #{i + 1} · {e.razao_social}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatCNPJ(e.cnpj_completo)}</div>
                    {e.municipio_nome && (
                      <div className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}
                      </div>
                    )}
                    {config.showCapital && e.capital_social ? (
                      <div className="text-xs text-slate-700 mt-0.5 font-medium">
                        Cap. {formatCurrency(e.capital_social)}
                      </div>
                    ) : null}
                    {config.showDataAbertura && e.data_inicio_atividade && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Aberta {e.data_inicio_atividade.slice(6, 8)}/{e.data_inicio_atividade.slice(4, 6)}/{e.data_inicio_atividade.slice(0, 4)}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">{config.h1("")} em outros estados</h2>
        <div className="flex flex-wrap gap-2">
          {UFS.filter((u) => u.sigla !== uf).map((u) => (
            <Link
              key={u.sigla}
              href={`${config.routePrefix}/${u.sigla.toLowerCase()}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-[#0F4C81]"
            >
              {u.nome}
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
