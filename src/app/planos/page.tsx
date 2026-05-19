import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Planos — Jurídico Online",
  description:
    "Cadastro grátis com acesso a 65 milhões de empresas. Planos pagos com export CSV, API, alertas e créditos para integração.",
  alternates: { canonical: "/planos" },
};

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    desc: "Para usuários ocasionais que precisam consultar empresas",
    features: [
      "Acesso a 65 milhões de empresas",
      "Telefones e e-mails desbloqueados",
      "Quadro societário completo",
      "Newsletter Radar Empresarial",
      "50 consultas avançadas / mês",
    ],
    cta: "Cadastre-se grátis",
    href: "/cadastro",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 29",
    period: "por mês",
    desc: "Para vendedores, contadores e profissionais autônomos",
    features: [
      "Tudo do Grátis",
      "500 consultas avançadas / dia",
      "Export CSV (até 1.000 empresas)",
      "Filtros avançados (CNAE, capital, porte)",
      "Alertas de novas empresas por filtro",
      "Suporte prioritário",
    ],
    cta: "Em breve",
    href: "#",
    highlight: true,
    badge: "Mais popular",
    soon: true,
  },
  {
    name: "Business",
    price: "R$ 99",
    period: "por mês",
    desc: "Para times de prospecção, cobrança e crédito",
    features: [
      "Tudo do Pro",
      "5.000 consultas / dia",
      "Export CSV ilimitado",
      "Sócios cruzados (rede societária)",
      "Histórico de mudanças",
      "Acesso a dívidas PGFN",
      "API básica (10k req / mês)",
    ],
    cta: "Em breve",
    href: "#",
    highlight: false,
    soon: true,
  },
  {
    name: "API",
    price: "R$ 199+",
    period: "por mês",
    desc: "Para devs, fintechs e SaaS que integram consulta CNPJ",
    features: [
      "API REST documentada",
      "50k a 500k requisições / mês",
      "Webhooks de novas empresas",
      "SDK Node.js / Python",
      "SLA 99,9% e suporte dedicado",
      "Dados batch (até 1M / mês)",
    ],
    cta: "Falar com vendas",
    href: "/contato?assunto=api",
    highlight: false,
    soon: true,
  },
];

export default function PlanosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <header className="text-center max-w-2xl mx-auto mb-14">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Comece grátis. Cresça quando precisar.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Cadastre-se em 30 segundos e tenha acesso a tudo. Quando precisar de mais volume,
          export ou API, escolha o plano que se encaixa.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-6 flex flex-col ${
              p.highlight
                ? "border-[#0F4C81] bg-gradient-to-b from-[#0F4C81]/5 to-white shadow-lg shadow-[#0F4C81]/10 relative"
                : "border-slate-200 bg-white"
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C81] text-white text-xs font-medium rounded-full px-3 py-1 inline-flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> {p.badge}
              </span>
            )}
            <div className="mb-1 text-sm font-semibold text-slate-700">{p.name}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-semibold text-slate-900">{p.price}</span>
              <span className="text-sm text-slate-500">/{p.period.replace("por ", "")}</span>
            </div>
            <p className="text-sm text-slate-500 mb-5 min-h-[40px]">{p.desc}</p>

            <ul className="space-y-2 text-sm text-slate-700 mb-6 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {p.soon ? (
              <button
                disabled
                className="w-full rounded-lg h-11 font-medium text-sm border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              >
                {p.cta}
              </button>
            ) : (
              <Link
                href={p.href}
                className={`w-full rounded-lg h-11 font-medium text-sm inline-flex items-center justify-center transition ${
                  p.highlight
                    ? "btn-primary"
                    : "border border-slate-300 hover:border-[#0F4C81] text-slate-700"
                }`}
              >
                {p.cta}
              </Link>
            )}
          </div>
        ))}
      </div>

      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
          Perguntas frequentes
        </h2>
        <div className="space-y-3">
          <Faq q="O cadastro grátis é mesmo grátis?">
            Sim. 100% grátis, sem cartão, sem trial expirando. Pedimos apenas e-mail para evitar
            abuso e enviar a newsletter Radar Empresarial (que você pode cancelar a qualquer momento).
          </Faq>
          <Faq q="De onde vêm os dados?">
            Da Receita Federal (Cadastro Nacional de Pessoas Jurídicas), atualizado diariamente,
            cruzado com bases públicas de sócios, CNAEs e Junta Comercial.
          </Faq>
          <Faq q="É legal disponibilizar telefones e e-mails?">
            Sim. Todos os dados que mostramos são públicos, registrados na Receita Federal pelas
            próprias empresas. Tratamos os dados conforme a LGPD e oferecemos opt-out.
          </Faq>
          <Faq q="Posso cancelar a qualquer momento?">
            Sim. Planos pagos são pré-pagos, sem fidelidade. Cancele a qualquer momento e mantenha
            acesso até o fim do período pago.
          </Faq>
          <Faq q="A API tem teste grátis?">
            Sim. Quando lançarmos, você poderá testar 1.000 requisições grátis. Entre em contato
            para participar do beta.
          </Faq>
        </div>
      </section>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white px-5 py-4 group">
      <summary className="cursor-pointer font-medium text-slate-900 list-none flex items-center justify-between">
        {q}
        <span className="text-slate-400 group-open:rotate-45 transition text-xl leading-none">+</span>
      </summary>
      <div className="mt-3 text-sm text-slate-600 leading-relaxed">{children}</div>
    </details>
  );
}
