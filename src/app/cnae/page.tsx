import Link from "next/link";
import type { Metadata } from "next";
import { TOP_CNAES } from "@/lib/seo-hubs";
import { Briefcase } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "CNAE — Atividades econômicas e empresas por setor",
  description:
    "Explore empresas brasileiras por atividade econômica (CNAE). 1.400+ códigos catalogados, com listagem de empresas ativas, sócios e dados oficiais da Receita Federal.",
  alternates: { canonical: "/cnae" },
};

export default function CnaeIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Empresas por atividade econômica (CNAE)
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          A Classificação Nacional de Atividades Econômicas (CNAE) identifica o ramo de
          atuação de cada empresa registrada na Receita Federal. Explore os setores mais
          relevantes da economia brasileira.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-[#0F4C81]" />
          CNAEs mais consultados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOP_CNAES.map((c) => (
            <Link
              key={c.codigo}
              href={`/cnae/${c.codigo}`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 group-hover:text-[#0F4C81]">
                    {c.descricao}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Empresas ativas com este CNAE
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded shrink-0">
                  {c.codigo}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-600">
        <p>
          <strong className="text-slate-900">O que é CNAE?</strong> A Classificação Nacional de
          Atividades Econômicas é um código de 7 dígitos atribuído a cada CNPJ pela Receita
          Federal, identificando a atividade econômica principal e secundárias da empresa.
          Esse código é utilizado para fins tributários, estatísticos e de fiscalização.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Atividades econômicas — CNAE",
            url: "/cnae",
            isPartOf: { "@type": "WebSite", name: "Jurídico Online" },
          }),
        }}
      />
    </div>
  );
}
