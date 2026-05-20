/**
 * /empresas-abertas/[uf]/[periodo] — empresas abertas em UF + mês.
 * Periodo no formato YYYY-MM. Gera 27 UFs × 24 meses = 648 landings indexáveis.
 * Captura intent "empresas abertas em [estado]" — high-intent commercial.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { UFS, ufNome, listEmpresasAbertasNoPeriodo } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug, formatCNPJ, formatDate } from "@/lib/cnpj";
import { Building2, MapPin, Calendar } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ uf: string; periodo: string }> };

const MES_NOMES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function parsePeriodo(periodo: string): { ano: number; mes: number } | null {
  const m = periodo.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return null;
  const ano = parseInt(m[1], 10);
  const mes = parseInt(m[2], 10);
  if (mes < 1 || mes > 12) return null;
  if (ano < 2020 || ano > new Date().getFullYear() + 1) return null;
  return { ano, mes };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf, periodo } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) return { title: "Não encontrado" };
  const p = parsePeriodo(periodo);
  if (!p) return { title: "Período inválido" };

  const ufName = ufNome(sigla);
  const mesNome = MES_NOMES[p.mes - 1];

  const title = `Empresas abertas em ${ufName} em ${mesNome} de ${p.ano}`;
  const description = `Lista de empresas (CNPJ) abertas em ${ufName} em ${mesNome}/${p.ano}. Novos negócios, atividade econômica, sócios. Dados Receita Federal atualizados hoje.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/empresas-abertas/${uf.toLowerCase()}/${periodo}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function EmpresasAbertasPage({ params }: Props) {
  const { uf, periodo } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();
  const p = parsePeriodo(periodo);
  if (!p) notFound();

  const ufName = ufNome(sigla);
  const mesNome = MES_NOMES[p.mes - 1];
  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const { hits, total } = await listEmpresasAbertasNoPeriodo(sigla, p.ano, p.mes, 100);

  // Build prev/next month for navigation
  const prevDate = new Date(p.ano, p.mes - 2, 1);
  const nextDate = new Date(p.ano, p.mes, 1);
  const now = new Date();
  const prevPeriodo = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
  const nextPeriodo = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
  const hasNext = nextDate <= now;

  // Build last 12 months for navigation hub
  const last12: { periodo: string; label: string }[] = [];
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last12.push({
      periodo: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: `${MES_NOMES[d.getMonth()]} ${d.getFullYear()}`,
    });
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: ufName, item: `${SITE_URL}/empresas/${uf.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: `Abertas em ${mesNome}/${p.ano}`, item: `${SITE_URL}/empresas-abertas/${uf.toLowerCase()}/${periodo}` },
    ],
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Empresas abertas em ${ufName} em ${mesNome} de ${p.ano}`,
    numberOfItems: hits.length,
    itemListElement: hits.slice(0, 20).map((e, i) => ({
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
          <li className="text-slate-700">Abertas em {mesNome}/{p.ano}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas abertas em {ufName} em {mesNome} de {p.ano}
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          {total.toLocaleString("pt-BR")} novas empresas registradas no CNPJ da Receita Federal
          em {mesNome}/{p.ano} no estado de {ufName} ({sigla}).
        </p>
      </header>

      {/* Month navigation */}
      <nav className="mb-6 flex items-center justify-between gap-3">
        <Link
          href={`/empresas-abertas/${uf.toLowerCase()}/${prevPeriodo}`}
          className="text-sm text-[#0F4C81] hover:underline inline-flex items-center gap-1"
        >
          ← {MES_NOMES[prevDate.getMonth()]} {prevDate.getFullYear()}
        </Link>
        {hasNext && (
          <Link
            href={`/empresas-abertas/${uf.toLowerCase()}/${nextPeriodo}`}
            className="text-sm text-[#0F4C81] hover:underline inline-flex items-center gap-1"
          >
            {MES_NOMES[nextDate.getMonth()]} {nextDate.getFullYear()} →
          </Link>
        )}
      </nav>

      {hits.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          Nenhuma empresa encontrada para este período em {ufName}. Tente outro mês ou estado.
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#0F4C81]" />
            Lista de empresas abertas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hits.map((e) => (
              <Link
                key={e.cnpj_completo}
                href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-[#10B981]/10 text-[#10B981] p-2 shrink-0">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate group-hover:text-[#0F4C81]">{e.razao_social}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatCNPJ(e.cnpj_completo)}</div>
                    {e.cnae_descricao && (
                      <div className="text-xs text-slate-500 mt-1 truncate">{e.cnae_descricao}</div>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      {e.municipio_nome && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {e.municipio_nome}/{e.uf}
                        </span>
                      )}
                      {e.data_inicio_atividade && (
                        <span>aberta {formatDate(e.data_inicio_atividade)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Last 12 months hub */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">Últimos 12 meses em {ufName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {last12.map((m) => (
            <Link
              key={m.periodo}
              href={`/empresas-abertas/${uf.toLowerCase()}/${m.periodo}`}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Other UFs same period */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight mb-3">{mesNome}/{p.ano} em outros estados</h2>
        <div className="flex flex-wrap gap-2">
          {UFS.filter((u) => u.sigla !== sigla).map((u) => (
            <Link
              key={u.sigla}
              href={`/empresas-abertas/${u.sigla.toLowerCase()}/${periodo}`}
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
