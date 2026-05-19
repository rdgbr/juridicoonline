import type { Metadata } from "next";
import Link from "next/link";
import { Code, Zap, Shield, Database, Webhook } from "lucide-react";

export const metadata: Metadata = {
  title: "API REST de Consulta CNPJ — Documentação",
  description:
    "API REST para consulta de empresas brasileiras. Integre 65 milhões de CNPJs ao seu sistema. Filtros avançados, webhooks, export CSV.",
  alternates: { canonical: "/api" },
};

export default function ApiPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 text-[#10B981] px-3 py-1 text-xs font-medium mb-4">
          <Code className="h-3.5 w-3.5" /> Em desenvolvimento — beta em breve
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          API REST de consulta CNPJ
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl">
          Integre 65 milhões de empresas brasileiras ao seu sistema. Resposta em menos de 200ms,
          filtros avançados, webhooks de novas empresas e SDKs para Node.js e Python.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-16">
        <Card icon={<Zap />} title="< 200ms de resposta" desc="Índice MeiliSearch otimizado, CDN global, baixa latência." />
        <Card icon={<Database />} title="Filtros poderosos" desc="UF, município, CNAE, porte, capital social, situação cadastral." />
        <Card icon={<Webhook />} title="Webhooks" desc="Receba notificação em tempo real quando novas empresas forem abertas conforme seus filtros." />
        <Card icon={<Shield />} title="Auth simples" desc="Bearer token, rate limiting transparente, logs detalhados." />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Endpoints principais</h2>
        <div className="space-y-3">
          <Endpoint
            method="GET"
            path="/api/v1/empresa/{cnpj}"
            desc="Detalhes completos de uma empresa pelo CNPJ"
          />
          <Endpoint
            method="GET"
            path="/api/v1/empresas?uf=SP&cnae=4711&porte=ME&page=1"
            desc="Lista paginada de empresas com filtros"
          />
          <Endpoint
            method="GET"
            path="/api/v1/buscar?q=Petrobras"
            desc="Busca textual por razão social, fantasia ou sócio"
          />
          <Endpoint
            method="GET"
            path="/api/v1/empresas/abertas-hoje?uf=SC"
            desc="Empresas abertas hoje (Junta Comercial)"
          />
          <Endpoint
            method="POST"
            path="/api/v1/webhooks"
            desc="Cria webhook para notificações de novas empresas"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Exemplo de resposta</h2>
        <pre className="rounded-xl bg-slate-900 text-slate-100 p-5 text-xs overflow-x-auto font-mono leading-relaxed">
{`{
  "cnpj": "00.000.000/0001-91",
  "razao_social": "BANCO DO BRASIL SA",
  "nome_fantasia": "BANCO DO BRASIL",
  "situacao": "ATIVA",
  "data_abertura": "1966-08-01",
  "capital_social": 90000000000,
  "porte": "DEMAIS",
  "natureza_juridica": "Sociedade de Economia Mista",
  "cnae_principal": {
    "codigo": "6422100",
    "descricao": "Bancos múltiplos, com carteira comercial"
  },
  "endereco": {
    "logradouro": "SAUN QUADRA 5 LOTE B TORRES I, II E III",
    "bairro": "ASA NORTE",
    "municipio": "BRASILIA",
    "uf": "DF",
    "cep": "70040-912"
  },
  "telefone": "(61) 3493-9002",
  "email": "secex@bb.com.br",
  "tem_whatsapp": false,
  "socios": [ /* ... */ ]
}`}
        </pre>
      </section>

      <div className="rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a66] p-8 text-white text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Quer testar a API?</h2>
        <p className="mt-2 text-white/80 max-w-xl mx-auto">
          Estamos selecionando empresas para o programa beta com 1.000 requisições grátis.
        </p>
        <Link
          href="/contato?assunto=api-beta"
          className="mt-5 inline-flex items-center bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg px-6 h-11 transition"
        >
          Quero participar do beta
        </Link>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex items-start gap-3">
      <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-50 text-emerald-700",
    POST: "bg-sky-50 text-sky-700",
    PUT: "bg-amber-50 text-amber-700",
    DELETE: "bg-rose-50 text-rose-700",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start gap-3">
      <span className={`text-xs font-mono font-semibold rounded px-2 py-1 ${colors[method]} shrink-0`}>
        {method}
      </span>
      <div className="flex-1 min-w-0">
        <code className="text-sm text-slate-900 font-mono break-all">{path}</code>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
