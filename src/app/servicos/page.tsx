import type { Metadata } from "next";
import Link from "next/link";
import { SERVICOS, type Servico } from "@/lib/servicos";
import { ArrowRight } from "lucide-react";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Serviços Profissionais — Advocacia, Contabilidade e mais | Jurídico Online",
  description:
    "Encontre contadores, advogados, bancos e especialistas verificados para abrir empresa, regularizar CNPJ, estruturar holding e muito mais.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: "Serviços Profissionais | Jurídico Online",
    description:
      "Profissionais verificados em contabilidade, advocacia empresarial, certificado digital e financeiro. Atendimento em todo o Brasil.",
    type: "website",
  },
};

const CATEGORIAS: { key: Servico["categoria"]; label: string; descricao: string }[] = [
  {
    key: "contabilidade",
    label: "Contabilidade",
    descricao: "Contadores especializados para MEI, ME, EPP e LTDA",
  },
  {
    key: "advocacia",
    label: "Advocacia Empresarial",
    descricao: "Advogados para societário, contratos, holding e M&A",
  },
  {
    key: "financeiro",
    label: "Financeiro",
    descricao: "Conta PJ, crédito empresarial e gestão financeira",
  },
  {
    key: "digital",
    label: "Digital",
    descricao: "Certificado digital, NF-e e infraestrutura fiscal",
  },
];

export default function ServicosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Serviços Profissionais</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Conectamos você a contadores, advogados e especialistas verificados para cada etapa
          da vida da sua empresa.
        </p>
      </header>

      {/* Categorias */}
      {CATEGORIAS.map((cat) => {
        const servicos = SERVICOS.filter((s) => s.categoria === cat.key);
        if (servicos.length === 0) return null;
        return (
          <section key={cat.key} className="mb-12">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-slate-900">{cat.label}</h2>
              <p className="text-slate-500 text-sm mt-1">{cat.descricao}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servicos.map((s) => (
                <Link
                  key={s.slug}
                  href={`/servicos/${s.slug}`}
                  className="group flex flex-col border border-slate-200 rounded-2xl p-5 hover:border-[#0F4C81] hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{s.icone}</span>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-[#0F4C81] transition-colors">
                        {s.titulo}
                      </div>
                      <div className="text-xs text-slate-500">{s.subtitulo}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{s.descricao}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0F4C81] group-hover:gap-2 transition-all">
                    Ver detalhes
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA para parceiros */}
      <div className="bg-[#0F4C81] text-white rounded-2xl p-8 text-center mt-4">
        <h2 className="text-2xl font-semibold mb-2">É profissional da área?</h2>
        <p className="text-blue-200 mb-5">
          Faça parte da nossa rede e receba indicações de clientes qualificados em todo o Brasil.
        </p>
        <Link
          href="/parceiros"
          className="inline-flex items-center gap-2 bg-white text-[#0F4C81] font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Quero ser parceiro
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
