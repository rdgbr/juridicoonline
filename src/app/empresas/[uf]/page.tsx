import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { UFS, ufNome, listByUF, listMunicipiosByUF } from "@/lib/meili";
import { empresaSlug, formatCNPJ, formatCurrency } from "@/lib/cnpj";
import { Building2, MapPin } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ uf: string }> };

export async function generateStaticParams() {
  return UFS.map((u) => ({ uf: u.sigla.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) return { title: "Estado não encontrado" };
  const nome = ufNome(sigla);
  return {
    title: `Empresas em ${nome} (${sigla}) — consulta de CNPJs ativos`,
    description: `Lista de empresas ativas em ${nome}. Pesquise por município, CNAE, porte. Dados oficiais da Receita Federal.`,
    alternates: { canonical: `/empresas/${uf.toLowerCase()}` },
  };
}

export default async function UFPage({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();

  const nome = ufNome(sigla);

  const [empresas, municipios] = await Promise.all([
    listByUF(sigla, 1, 30),
    listMunicipiosByUF(sigla),
  ]);

  const top50Mun = municipios.slice(0, 50);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-[#0F4C81]">Início</Link> /{" "}
        <Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link> /{" "}
        <span className="text-slate-700">{nome}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas em {nome}
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          {empresas.estimatedTotalHits.toLocaleString("pt-BR")} empresas ativas em {nome}.
          Pesquise por CNPJ, razão social ou navegue pelos municípios.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Empresas em destaque */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#0F4C81]" />
            Empresas em destaque
          </h2>
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
                      {e.municipio_nome && <span>{e.municipio_nome}/{e.uf}</span>}
                      {e.cnae_descricao && <span className="truncate max-w-[40ch]">{e.cnae_descricao}</span>}
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

        {/* Municípios */}
        <aside>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#0F4C81]" />
            Principais municípios
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {top50Mun.map((m) => (
              <Link
                key={m.name}
                href={`/empresas/${uf.toLowerCase()}/${encodeURIComponent(m.name.toLowerCase())}`}
                className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50 transition"
              >
                <span className="text-slate-700 truncate">{m.name}</span>
                <span className="text-xs text-slate-400 font-mono">{m.count.toLocaleString("pt-BR")}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Empresas em ${nome}`,
            url: `/empresas/${uf.toLowerCase()}`,
          }),
        }}
      />
    </div>
  );
}
