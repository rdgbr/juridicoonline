import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Building2,
  Crown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Planos e preços — Consulta CNPJ ilimitada, API REST e exports CSV",
  description:
    "Comece grátis com 50 consultas/dia. Plano Pro a partir de R$ 49/mês com export CSV, alertas e API. Plano Business para times com integração CRM. Cancele quando quiser.",
  alternates: { canonical: "/planos" },
  openGraph: {
    title: "Planos Jurídico Online — a partir de R$ 0",
    description: "Free para sempre, Pro R$ 49/mês, Business R$ 199/mês.",
    type: "website",
  },
};

const plans = [
  {
    id: "free",
    name: "Grátis",
    icon: Sparkles,
    price: 0,
    priceLabel: "R$ 0",
    period: "para sempre",
    desc: "Consultas pontuais e exploração",
    features: [
      { label: "50 consultas de CNPJ por dia", included: true },
      { label: "Razão social, sócios, endereço, CNAE", included: true },
      { label: "Telefones e e-mails (com cadastro)", included: true },
      { label: "Newsletter Radar Empresarial", included: true },
      { label: "Anúncios discretos", included: true },
      { label: "Export CSV", included: false },
      { label: "API REST", included: false },
      { label: "Alertas de mudança", included: false },
      { label: "Acesso prioritário (sem ads)", included: false },
    ],
    cta: { label: "Começar grátis", href: "/cadastro" },
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    price: 49,
    priceLabel: "R$ 49",
    period: "/mês",
    desc: "Para profissionais autônomos e PMEs",
    features: [
      { label: "Consultas ilimitadas", included: true },
      { label: "Tudo do plano Grátis", included: true },
      { label: "Sem anúncios", included: true },
      { label: "Export CSV até 5.000 empresas/mês", included: true },
      { label: "Alertas de mudança (até 50 CNPJs)", included: true },
      { label: "API: 1.000 chamadas/mês", included: true },
      { label: "Suporte por e-mail em 24h", included: true },
      { label: "Acesso à base PGFN (dívidas)", included: false },
      { label: "Integração CRM (webhooks)", included: false },
    ],
    cta: { label: "Assinar Pro", href: "/api/billing/checkout?plan=pro" },
    highlight: true,
    badge: "Mais escolhido",
  },
  {
    id: "business",
    name: "Business",
    icon: Building2,
    price: 199,
    priceLabel: "R$ 199",
    period: "/mês",
    desc: "Equipes de vendas, contabilidade e crédito",
    features: [
      { label: "Tudo do plano Pro", included: true },
      { label: "Export CSV até 50.000 empresas/mês", included: true },
      { label: "Alertas ilimitados", included: true },
      { label: "API: 50.000 chamadas/mês", included: true },
      { label: "Acesso à base PGFN (dívidas tributárias)", included: true },
      { label: "Webhooks (CRM, Sheets, Zapier)", included: true },
      { label: "Multi-usuário (até 5 logins)", included: true },
      { label: "Suporte por WhatsApp em 4h úteis", included: true },
      { label: "Reuniões de onboarding", included: true },
    ],
    cta: { label: "Assinar Business", href: "/api/billing/checkout?plan=business" },
    highlight: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    price: null,
    priceLabel: "Sob consulta",
    period: "",
    desc: "Bancos, fintechs, grandes corporações",
    features: [
      { label: "Tudo do plano Business", included: true },
      { label: "Volume customizado (milhões de consultas)", included: true },
      { label: "SLA contratual", included: true },
      { label: "Dump completo de base", included: true },
      { label: "Dados enriquecidos sob demanda", included: true },
      { label: "Integração dedicada", included: true },
      { label: "Treinamento da equipe", included: true },
      { label: "Suporte 24/7", included: true },
      { label: "Account manager dedicado", included: true },
    ],
    cta: { label: "Falar com vendas", href: "/contato?dept=comercial" },
    highlight: false,
  },
];

const faq = [
  {
    q: "Os dados são oficiais?",
    a: "Sim. Importamos diariamente os dumps abertos da Receita Federal disponíveis em arquivos.receitafederal.gov.br/dados/cnpj/. São os mesmos dados que aparecem no comprovante oficial — só que pesquisáveis e com sócios cruzados.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim, cancele direto no painel /perfil sem custo. O acesso continua até o fim do período pago. Sem multa, sem fidelidade.",
  },
  {
    q: "Qual a diferença entre Pro e Business?",
    a: "Pro é ideal para 1 pessoa: API limitada (1k/mês), 5k exports/mês, alertas pra 50 CNPJs. Business é para equipes: 50k chamadas de API, 50k exports, alertas ilimitados, multi-usuário e dados de dívidas tributárias (PGFN).",
  },
  {
    q: "Como funciona o limite de 50 consultas/dia no plano grátis?",
    a: "Cada vez que você abre uma página de empresa ou de sócio, conta como 1 consulta. Buscas na home ou listagens (estados, MEI, etc) não contam. O limite reseta às 00h00 (horário de Brasília).",
  },
  {
    q: "Eu uso para prospecção B2B. É legal?",
    a: "Sim. Dados de empresas (PJ) são públicos por lei. Para uso comercial, recomendamos respeitar opt-out em campanhas e seguir LGPD para dados de PF (sócios). Consulte nossa página /lgpd.",
  },
  {
    q: "Vocês têm dados de pessoa física?",
    a: "Não vendemos dados de PF. Os nomes de sócios aparecem mascarados (CPF oculto) conforme a LGPD. Para identificação plena, a empresa precisa autorização específica.",
  },
  {
    q: "Tem desconto para pagamento anual?",
    a: "Sim. Pagando 12 meses à vista você ganha 2 meses grátis (equivalente a 17% de desconto). Disponível direto no checkout.",
  },
  {
    q: "Posso testar Pro antes de pagar?",
    a: "Sim — toda nova conta tem 7 dias de Pro grátis automaticamente, sem precisar de cartão. Após 7 dias volta pra Grátis se você não assinar.",
  },
];

const features = [
  { name: "Consultas/dia", values: ["50", "Ilimitado", "Ilimitado", "Customizado"] },
  { name: "Telefones, e-mails, sócios", values: ["✓", "✓", "✓", "✓"] },
  { name: "Sem anúncios", values: ["—", "✓", "✓", "✓"] },
  { name: "Export CSV (empresas/mês)", values: ["—", "5.000", "50.000", "Ilimitado"] },
  { name: "API REST (chamadas/mês)", values: ["—", "1.000", "50.000", "Customizado"] },
  { name: "Alertas de mudança", values: ["—", "50 CNPJs", "Ilimitado", "Ilimitado"] },
  { name: "Dados PGFN (dívidas)", values: ["—", "—", "✓", "✓"] },
  { name: "Multi-usuário", values: ["—", "—", "5 logins", "Ilimitado"] },
  { name: "Webhooks (CRM/Sheets)", values: ["—", "—", "✓", "✓"] },
  { name: "Suporte", values: ["Comunidade", "E-mail 24h", "WhatsApp 4h", "24/7 dedicado"] },
];

export default function PlanosPage() {
  // Product/Offer schema for each paid plan
  const productSchema = plans
    .filter((p) => p.price !== null && p.price > 0)
    .map((p) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Jurídico Online — Plano ${p.name}`,
      description: p.desc,
      brand: { "@type": "Brand", name: "Jurídico Online" },
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: p.price,
        url: `${SITE_URL}/planos#${p.id}`,
        availability: "https://schema.org/InStock",
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      },
    }));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([...productSchema, faqSchema]) }}
      />

      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" /> 7 dias de Pro grátis em qualquer plano
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          Planos para todo tipo de uso
        </h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
          Comece grátis com 50 consultas/dia. Assine quando precisar de API, exports
          ou volume maior. Cancele a qualquer momento sem multa.
        </p>
      </header>

      {/* Plans grid */}
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-[#0F4C81] bg-gradient-to-br from-[#0F4C81]/[0.03] to-[#10B981]/[0.03] shadow-lg ring-2 ring-[#0F4C81]/10"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0F4C81] text-white text-[11px] font-semibold uppercase tracking-wide">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-5 w-5 ${plan.highlight ? "text-[#0F4C81]" : "text-slate-400"}`} />
                <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
              </div>

              <p className="text-xs text-slate-500 mb-4 min-h-[2.5rem]">{plan.desc}</p>

              <div className="mb-5">
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {plan.priceLabel}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{plan.period}</div>
              </div>

              <Link
                href={plan.cta.href}
                className={`block text-center text-sm rounded-lg h-10 leading-10 font-medium transition mb-5 ${
                  plan.highlight
                    ? "bg-[#0F4C81] text-white hover:bg-[#0a3a66]"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#0F4C81] hover:text-[#0F4C81]"
                }`}
              >
                {plan.cta.label}
              </Link>

              <ul className="space-y-2 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {f.included ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span className={f.included ? "text-slate-700" : "text-slate-400 line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Comparison table */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 text-center">
          Comparativo completo
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Recurso</th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    className={`px-6 py-4 text-center font-semibold ${
                      p.highlight ? "text-[#0F4C81] bg-[#0F4C81]/[0.04]" : "text-slate-700"
                    }`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {features.map((row) => (
                <tr key={row.name}>
                  <td className="px-6 py-3 text-slate-700 font-medium">{row.name}</td>
                  {row.values.map((v, i) => (
                    <td
                      key={i}
                      className={`px-6 py-3 text-center ${
                        plans[i]?.highlight ? "bg-[#0F4C81]/[0.04] font-medium" : ""
                      } ${v === "—" ? "text-slate-300" : v === "✓" ? "text-emerald-600 font-semibold" : "text-slate-700"}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Social proof / why */}
      <section className="mb-16 grid md:grid-cols-3 gap-4">
        <Card title="Dados Receita Federal" desc="Atualizamos diariamente os dumps oficiais. Mesma fonte que comprova CNPJ." />
        <Card title="Sem fidelidade" desc="Cancele com 1 clique no painel /perfil. Sem multa, sem ligação de retenção." />
        <Card title="LGPD compliance" desc="PJ é dado público, PF é protegido (CPF mascarado). DPO disponível." />
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-6 text-center flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-[#0F4C81]" />
          Perguntas frequentes
        </h2>
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
          {faq.map((f, i) => (
            <details key={i} className="group px-6 py-4" open={i < 2}>
              <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-medium text-slate-900 text-sm">
                <span>{f.q}</span>
                <span className="text-slate-400 group-open:rotate-45 transition text-xl leading-none shrink-0">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a66] text-white p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Pronto pra começar?
        </h2>
        <p className="mt-3 text-white/80 max-w-md mx-auto">
          Crie sua conta grátis em 30 segundos e ganhe 7 dias de Pro automático.
          Sem cartão, sem compromisso.
        </p>
        <Link
          href="/cadastro"
          className="mt-6 inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg px-6 h-11 transition"
        >
          Criar conta grátis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}
