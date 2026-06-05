import type { Metadata } from "next";
import Link from "next/link";
import { SERVICOS } from "@/lib/servicos";
import { ArrowRight } from "lucide-react";
import { ParceirosForm } from "./ParceirosForm";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Rede de Parceiros — Advogados, Contadores e Especialistas | Jurídico Online",
  description:
    "Faça parte da rede de parceiros do Jurídico Online ou encontre contadores, advogados e especialistas verificados para sua empresa.",
  alternates: { canonical: "/parceiros" },
  openGraph: {
    title: "Rede de Parceiros | Jurídico Online",
    description:
      "Profissionais verificados em contabilidade, advocacia empresarial, certificado digital e financeiro. Atendimento em todo o Brasil.",
    type: "website",
  },
};

export default function ParceirosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Rede de Parceiros</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Conectamos profissionais verificados a empresários que precisam de suporte especializado.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Seção A: Sou profissional */}
        <section>
          <div className="bg-[#0F4C81] text-white rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-1">Sou profissional</h2>
            <p className="text-blue-200 text-sm">Quero receber clientes qualificados</p>
          </div>

          <p className="text-slate-600 text-sm mb-5">
            Nossa base atende milhares de empresários buscando contadores, advogados e especialistas
            todos os dias. Preencha o formulário e entraremos em contato para avaliar sua candidatura.
          </p>

          <ParceirosForm />
        </section>

        {/* Seção B: Preciso de profissional */}
        <section>
          <div className="bg-slate-800 text-white rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-1">Preciso de profissional</h2>
            <p className="text-slate-400 text-sm">Encontre o especialista certo para sua empresa</p>
          </div>

          <p className="text-slate-600 text-sm mb-5">
            Escolha o serviço que precisa e entre em contato com especialistas verificados.
          </p>

          <div className="space-y-3">
            {SERVICOS.map((s) => (
              <Link
                key={s.slug}
                href={`/servicos/${s.slug}`}
                className="group flex items-center gap-4 border border-slate-200 rounded-xl px-4 py-3 hover:border-[#0F4C81] hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl shrink-0">{s.icone}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 group-hover:text-[#0F4C81] transition-colors">
                    {s.titulo}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{s.subtitulo}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0F4C81] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
