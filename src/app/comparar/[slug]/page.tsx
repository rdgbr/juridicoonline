/**
 * /comparar/[slug] — compara duas empresas pelo padrão "cnpjA-vs-cnpjB"
 * Captura intent comparativo ("empresa X vs empresa Y") — SEO valioso.
 */
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getEmpresaByCNPJ, type Empresa } from "@/lib/meili";
import { formatCNPJ, formatCurrency, formatDate, empresaSlug, age } from "@/lib/cnpj";
import { SITE_URL } from "@/lib/seo";
import { Building2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

function parseSlug(slug: string): { cnpjA?: string; cnpjB?: string } {
  const m = slug.match(/^(\d{14}).*?-vs-(\d{14})/);
  if (!m) return {};
  return { cnpjA: m[1], cnpjB: m[2] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { cnpjA, cnpjB } = parseSlug(slug);
  if (!cnpjA || !cnpjB) return { title: "Comparação não encontrada" };

  const [a, b] = await Promise.all([getEmpresaByCNPJ(cnpjA), getEmpresaByCNPJ(cnpjB)]);
  if (!a || !b) return { title: "Comparação não encontrada" };

  const title = `${a.razao_social} vs ${b.razao_social} — Comparação CNPJ`;
  const description = `Compare ${a.razao_social} (${formatCNPJ(cnpjA)}) e ${b.razao_social} (${formatCNPJ(cnpjB)}): capital, sócios, CNAE, situação cadastral, endereço. Dados Receita Federal.`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: `/comparar/${cnpjA}-vs-${cnpjB}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CompararPage({ params }: Props) {
  const { slug } = await params;
  const { cnpjA, cnpjB } = parseSlug(slug);
  if (!cnpjA || !cnpjB) notFound();

  const [a, b] = await Promise.all([getEmpresaByCNPJ(cnpjA), getEmpresaByCNPJ(cnpjB)]);
  if (!a || !b) notFound();

  // Canonical slug includes razão social (descobrir e redirecionar)
  const canonicalSlug = `${cnpjA}-${slugify(a.razao_social)}-vs-${cnpjB}-${slugify(b.razao_social)}`;
  if (slug !== `${cnpjA}-vs-${cnpjB}` && slug !== canonicalSlug) {
    redirect(`/comparar/${canonicalSlug}`);
  }

  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      { "@type": "ListItem", position: 3, name: `${a.razao_social} vs ${b.razao_social}`, item: `${SITE_URL}/comparar/${canonicalSlug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li><Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link></li>
          <li>/</li>
          <li className="text-slate-700">Comparação</li>
        </ol>
      </nav>

      <header className="mb-10 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-3">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {a.razao_social} <span className="text-slate-400">vs</span> {b.razao_social}
        </h1>
        <p className="mt-2 text-slate-600 text-sm">
          Comparação detalhada de dados cadastrais, capital, CNAE, situação e endereço
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <EmpresaCard empresa={a} accent="#0F4C81" />
        <EmpresaCard empresa={b} accent="#10B981" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <h2 className="px-6 py-4 text-lg font-semibold border-b border-slate-100">Comparativo lado a lado</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <Row label="CNPJ" a={formatCNPJ(a.cnpj_completo)} b={formatCNPJ(b.cnpj_completo)} mono />
              <Row label="Razão Social" a={a.razao_social} b={b.razao_social} />
              <Row label="Nome Fantasia" a={a.nome_fantasia || "—"} b={b.nome_fantasia || "—"} />
              <Row label="Situação" a={a.situacao || "—"} b={b.situacao || "—"} />
              <Row label="Porte" a={a.porte || "—"} b={b.porte || "—"} />
              <Row label="Natureza Jurídica" a={a.natureza_juridica || "—"} b={b.natureza_juridica || "—"} />
              <Row
                label="Capital Social"
                a={a.capital_social ? formatCurrency(a.capital_social) : "—"}
                b={b.capital_social ? formatCurrency(b.capital_social) : "—"}
                winner={a.capital_social && b.capital_social ? (a.capital_social > b.capital_social ? "a" : "b") : null}
              />
              <Row label="CNAE Principal" a={a.cnae_descricao || "—"} b={b.cnae_descricao || "—"} />
              <Row
                label="Data de Abertura"
                a={a.data_inicio_atividade ? `${formatDate(a.data_inicio_atividade)} (${age(a.data_inicio_atividade)})` : "—"}
                b={b.data_inicio_atividade ? `${formatDate(b.data_inicio_atividade)} (${age(b.data_inicio_atividade)})` : "—"}
              />
              <Row
                label="Localização"
                a={a.municipio_nome ? `${a.municipio_nome}/${a.uf}` : a.uf || "—"}
                b={b.municipio_nome ? `${b.municipio_nome}/${b.uf}` : b.uf || "—"}
              />
              <Row label="Simples Nacional" a={a.opcao_simples === "S" ? "Sim" : "Não"} b={b.opcao_simples === "S" ? "Sim" : "Não"} />
              <Row label="MEI" a={a.opcao_mei === "S" ? "Sim" : "Não"} b={b.opcao_mei === "S" ? "Sim" : "Não"} />
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 grid sm:grid-cols-2 gap-3">
        <Link
          href={`/empresa/${empresaSlug(a.cnpj_completo, a.razao_social)}`}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] flex items-center justify-between group"
        >
          <span className="text-sm text-slate-700">Ver detalhes de <strong className="text-slate-900">{a.razao_social}</strong></span>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81]" />
        </Link>
        <Link
          href={`/empresa/${empresaSlug(b.cnpj_completo, b.razao_social)}`}
          className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#10B981] flex items-center justify-between group"
        >
          <span className="text-sm text-slate-700">Ver detalhes de <strong className="text-slate-900">{b.razao_social}</strong></span>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#10B981]" />
        </Link>
      </section>
    </article>
  );
}

function Row({
  label,
  a,
  b,
  mono = false,
  winner = null,
}: {
  label: string;
  a: string;
  b: string;
  mono?: boolean;
  winner?: "a" | "b" | null;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide w-[180px] bg-slate-50">{label}</td>
      <td className={`px-6 py-3 text-slate-900 ${mono ? "font-mono" : ""} ${winner === "a" ? "bg-emerald-50/50 font-semibold" : ""}`}>
        {a}
        {winner === "a" && <CheckCircle2 className="inline-block h-3.5 w-3.5 text-emerald-600 ml-1.5 -mt-0.5" />}
      </td>
      <td className={`px-6 py-3 text-slate-900 ${mono ? "font-mono" : ""} ${winner === "b" ? "bg-emerald-50/50 font-semibold" : ""}`}>
        {b}
        {winner === "b" && <CheckCircle2 className="inline-block h-3.5 w-3.5 text-emerald-600 ml-1.5 -mt-0.5" />}
      </td>
    </tr>
  );
}

function EmpresaCard({ empresa, accent }: { empresa: Empresa; accent: string }) {
  const ativo = empresa.situacao === "ATIVA";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 relative">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: accent }} />
      <div className="flex items-start gap-3">
        <div className="rounded-lg p-2 shrink-0" style={{ background: `${accent}15`, color: accent }}>
          <Building2 className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 truncate">{empresa.razao_social}</h2>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{formatCNPJ(empresa.cnpj_completo)}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                ativo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {ativo ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {empresa.situacao || "—"}
            </span>
            {empresa.porte && (
              <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px]">{empresa.porte}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
