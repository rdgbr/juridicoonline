/**
 * /comparar — Hub index pra comparações. Gera pares pre-listados por UF e CNAE
 * pra capturar long-tail "empresa X vs empresa Y". Cada link interno alimenta
 * a página /comparar/[slug].
 */
import type { Metadata } from "next";
import Link from "next/link";
import { UFS, ufNome, listByUF, type Empresa } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug, formatCNPJ, razaoSocialDisplay } from "@/lib/cnpj";
import { ArrowLeftRight } from "lucide-react";

export const revalidate = 86400; // 1 day ISR

export const metadata: Metadata = {
  title: "Comparar empresas - CNPJ vs CNPJ",
  description:
    "Compare empresas brasileiras lado a lado: razão social, CNPJ, capital, sócios, situação cadastral, CNAE. Veja as principais comparações por estado.",
  alternates: { canonical: "/comparar" },
  keywords: [
    "comparar empresas",
    "comparar CNPJ",
    "empresa vs empresa",
    "comparativo empresarial",
    "CNPJ vs CNPJ",
    "consulta comparativa",
  ],
};

function pairSlug(a: Empresa, b: Empresa): string {
  // padrão usado por /comparar/[slug]: ${cnpjA}-${slugA}-vs-${cnpjB}-${slugB}
  return `${empresaSlug(a.cnpj_completo, a.razao_social)}-vs-${empresaSlug(b.cnpj_completo, b.razao_social)}`;
}

export default async function CompararIndexPage() {
  // Top 4 empresas por UF — gera C(4,2) = 6 pares por UF = 162 pares totais
  const ufBlocks = await Promise.all(
    UFS.map(async (u) => {
      try {
        const res = await listByUF(u.sigla, 1, 4);
        return { uf: u.sigla, ufName: ufNome(u.sigla), empresas: res.hits };
      } catch {
        return { uf: u.sigla, ufName: ufNome(u.sigla), empresas: [] };
      }
    })
  );

  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  // ItemList schema com primeiros 50 pares (rich result + entity linking)
  const allPairs: { a: Empresa; b: Empresa; ufName: string }[] = [];
  for (const block of ufBlocks) {
    for (let i = 0; i < block.empresas.length; i++) {
      for (let j = i + 1; j < block.empresas.length; j++) {
        allPairs.push({ a: block.empresas[i], b: block.empresas[j], ufName: block.ufName });
      }
    }
  }

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Comparações de empresas brasileiras",
    description: "Pares de empresas para comparação lado a lado",
    numberOfItems: allPairs.length,
    itemListElement: allPairs.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/comparar/${pairSlug(p.a, p.b)}`,
      name: `${razaoSocialDisplay(p.a.razao_social)} vs ${razaoSocialDisplay(p.b.razao_social)}`,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Comparar empresas", item: `${SITE_URL}/comparar` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-slate-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#0F4C81]">Início</Link> /{" "}
        <span className="text-slate-700">Comparar empresas</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <ArrowLeftRight className="h-8 w-8 text-[#0F4C81]" />
          Comparar empresas
        </h1>
        <p className="mt-3 text-slate-600 max-w-3xl">
          Compare duas empresas brasileiras lado a lado — capital social, sócios, situação
          cadastral, CNAE, endereço e data de abertura. Selecione um par abaixo ou monte sua
          própria comparação acessando <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/comparar/[cnpjA]-vs-[cnpjB]</code>.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {allPairs.length.toLocaleString("pt-BR")} comparações populares atualizadas em {hoje}.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
        <h2 className="font-semibold text-slate-900 mb-2">Como funciona</h2>
        <ol className="list-decimal pl-5 text-sm text-slate-700 space-y-1">
          <li>Cada comparação mostra dados públicos da Receita Federal de duas empresas em colunas paralelas.</li>
          <li>Diferenças destacadas em capital social, idade da empresa, porte e regime tributário.</li>
          <li>Sócios em comum são identificados automaticamente quando houver.</li>
          <li>Útil para due diligence, prospecção comercial e análise de concorrência.</li>
        </ol>
      </section>

      <div className="grid gap-6">
        {ufBlocks
          .filter((b) => b.empresas.length >= 2)
          .map((block) => {
            const pairs: { a: Empresa; b: Empresa }[] = [];
            for (let i = 0; i < block.empresas.length; i++) {
              for (let j = i + 1; j < block.empresas.length; j++) {
                pairs.push({ a: block.empresas[i], b: block.empresas[j] });
              }
            }
            return (
              <section key={block.uf}>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Top comparações em {block.ufName}
                  </h2>
                  <Link
                    href={`/empresas/${block.uf.toLowerCase()}`}
                    className="text-xs text-[#0F4C81] hover:underline"
                  >
                    ver todas as empresas →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {pairs.map((p) => {
                    const aName = razaoSocialDisplay(p.a.razao_social) || p.a.razao_social;
                    const bName = razaoSocialDisplay(p.b.razao_social) || p.b.razao_social;
                    return (
                      <Link
                        key={pairSlug(p.a, p.b)}
                        href={`/comparar/${pairSlug(p.a, p.b)}`}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-[#0F4C81] hover:shadow-sm transition group"
                      >
                        <div className="text-xs text-slate-500 mb-0.5">comparar</div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">
                          {aName}
                        </div>
                        <div className="text-[11px] text-slate-400 my-0.5">vs</div>
                        <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">
                          {bName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
                          <span>{formatCNPJ(p.a.cnpj_completo).slice(0, 10)}…</span>
                          <span>{formatCNPJ(p.b.cnpj_completo).slice(0, 10)}…</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </div>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Perguntas frequentes</h2>
        <div className="space-y-3 text-sm text-slate-700">
          <details className="border-b border-slate-100 pb-3">
            <summary className="font-medium cursor-pointer">Como criar uma comparação personalizada?</summary>
            <p className="mt-2">
              Acesse <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{SITE_URL}/comparar/[cnpj1]-vs-[cnpj2]</code> substituindo pelos
              CNPJs das empresas que deseja comparar (somente os 14 dígitos, sem pontos/barras).
            </p>
          </details>
          <details className="border-b border-slate-100 pb-3">
            <summary className="font-medium cursor-pointer">Os dados são oficiais?</summary>
            <p className="mt-2">
              Sim. Todos os dados são extraídos do CNPJ público da Receita Federal e atualizados diariamente.
            </p>
          </details>
          <details>
            <summary className="font-medium cursor-pointer">É possível comparar mais de duas empresas?</summary>
            <p className="mt-2">
              No momento o comparador suporta dois CNPJs por vez. Para análises em lote, considere
              nossa <Link href="/api" className="text-[#0F4C81] hover:underline">API REST</Link>.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
