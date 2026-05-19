import type { Metadata } from "next";
import Link from "next/link";
import { UFS } from "@/lib/meili";
import { Database, Download, Code, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Open Data — Datasets gratuitos de empresas brasileiras",
  description: "Datasets abertos com top 1.000 empresas por estado. CSV grátis para devs, jornalistas e pesquisadores. Dados Receita Federal.",
  alternates: { canonical: "/dados" },
};

export default function DadosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0F4C81]/8 text-[#0F4C81] px-3 py-1 text-xs font-medium mb-4">
          <Database className="h-3.5 w-3.5" /> Open Data Brasil
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Datasets gratuitos de empresas brasileiras
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl">
          Disponibilizamos dumps CSV com as <strong>top 1.000 empresas ativas por estado</strong>{" "}
          (ordenadas por capital social). Use para projetos acadêmicos, jornalismo de dados,
          análises de mercado ou prototipagem.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0F4C81]" /> Estrutura do CSV
        </h2>
        <p className="text-sm text-slate-600 mb-3">
          Encoding UTF-8, separador <code className="bg-slate-100 px-1 rounded">,</code>, com header.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="py-2 pr-4 font-medium text-slate-700">Campo</th>
                <th className="py-2 pr-4 font-medium text-slate-700">Tipo</th>
                <th className="py-2 font-medium text-slate-700">Descrição</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">cnpj</td><td>string(14)</td><td>CNPJ completo</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">razao_social</td><td>string</td><td>Razão social</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">nome_fantasia</td><td>string</td><td>Nome fantasia</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">cnae_principal</td><td>string(7)</td><td>Código CNAE</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">cnae_descricao</td><td>string</td><td>Descrição CNAE</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">capital_social</td><td>float</td><td>Capital declarado (R$)</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">municipio</td><td>string</td><td>Município</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4 font-mono">uf</td><td>string(2)</td><td>Estado</td></tr>
              <tr><td className="py-2 pr-4 font-mono">data_inicio_atividade</td><td>date</td><td>Data de abertura</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-[#0F4C81]" /> Downloads por estado
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {UFS.map((u) => (
            <a
              key={u.sigla}
              href={`/dados/top-1000-${u.sigla.toLowerCase()}.csv`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition group"
            >
              <div className="font-medium text-slate-900 group-hover:text-[#0F4C81]">{u.nome}</div>
              <div className="text-xs text-slate-500 mt-0.5 inline-flex items-center gap-1">
                <Download className="h-3 w-3" /> top-1000-{u.sigla.toLowerCase()}.csv
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Code className="h-5 w-5 text-[#0F4C81]" /> Use em pesquisa / projetos
        </h2>
        <p className="text-sm text-slate-600 mb-3">
          Estes datasets são derivados de dados públicos da Receita Federal. Você pode:
        </p>
        <ul className="text-sm text-slate-600 list-disc pl-6 space-y-1">
          <li>Usar livremente em projetos acadêmicos, jornalismo, análises e visualizações</li>
          <li>Citar fonte: <strong>Jurídico Online — juridicoonline.com.br</strong></li>
          <li>Republicar com atribuição</li>
        </ul>
        <p className="text-sm text-slate-600 mt-3">
          Precisa de mais dados (volume maior, filtros customizados, API)?{" "}
          <Link href="/contato" className="text-[#0F4C81] hover:underline">
            Fale com a gente
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
