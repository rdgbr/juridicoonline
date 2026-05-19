import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { UFS } from "@/lib/meili";
import {
  Building2,
  Users,
  Phone,
  Mail,
  Database,
  Zap,
  Shield,
  CheckCircle2,
  ArrowRight,
  Search,
  Code,
} from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            65.731.428 empresas indexadas • atualização diária
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.05]">
            Consulta de empresas, sócios e<br />
            <span className="text-[#0F4C81]">CNPJ do Brasil inteiro</span>
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pesquise por CNPJ, razão social, nome fantasia, sócio, telefone ou endereço.
            Dados oficiais da Receita Federal. <strong className="text-slate-900">Cadastre-se grátis</strong>{" "}
            e libere telefones, e-mails e quadro societário completo.
          </p>

          <div className="mt-10 max-w-2xl mx-auto">
            <SearchBox />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>Exemplos:</span>
            <Link href="/empresa/00000000000191" className="hover:text-[#0F4C81]">
              00.000.000/0001-91
            </Link>
            <Link href="/buscar?q=Petrobras" className="hover:text-[#0F4C81]">
              Petrobras
            </Link>
            <Link href="/buscar?q=Magazine+Luiza" className="hover:text-[#0F4C81]">
              Magazine Luiza
            </Link>
            <Link href="/buscar?q=Nubank" className="hover:text-[#0F4C81]">
              Nubank
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Stat value="65,7M" label="Empresas" />
            <Stat value="26,8M" label="Sócios" />
            <Stat value="5.570" label="Municípios" />
            <Stat value="1.400+" label="CNAEs" />
          </div>
        </div>
      </section>

      {/* What you find */}
      <section className="py-20 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Tudo que você precisa saber sobre uma empresa
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Consulta completa em uma única tela. Dados públicos da Receita Federal cruzados com
              índices de sócios, CNAEs e quadros societários.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Feature
              icon={<Building2 className="h-5 w-5" />}
              title="Dados cadastrais completos"
              desc="Razão social, nome fantasia, CNPJ, situação cadastral, data de abertura, capital social, porte, natureza jurídica."
            />
            <Feature
              icon={<Phone className="h-5 w-5" />}
              title="Telefones e WhatsApp"
              desc="Telefone principal e secundário com flag de validação WhatsApp. Liberado para usuários cadastrados."
              gated
            />
            <Feature
              icon={<Mail className="h-5 w-5" />}
              title="E-mail corporativo"
              desc="E-mail oficial cadastrado na Receita Federal, validado e atualizado."
              gated
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Quadro societário"
              desc="Sócios, administradores, percentual de participação, qualificação e data de entrada."
              gated
            />
            <Feature
              icon={<Database className="h-5 w-5" />}
              title="CNAE e setor"
              desc="Atividade principal, atividades secundárias, descrição completa e empresas similares."
            />
            <Feature
              icon={<Shield className="h-5 w-5" />}
              title="Endereço e localização"
              desc="Endereço completo, CEP, bairro, município, UF. Mapa e empresas vizinhas."
            />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Para quem é o Jurídico Online?
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Profissionais que precisam de dados confiáveis sobre empresas, todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UseCase title="Vendedores B2B" desc="Encontre decisores, telefones e e-mails de empresas pelo CNAE, porte e região." />
            <UseCase title="Contadores" desc="Consulta rápida de situação cadastral, capital social e quadro societário de clientes." />
            <UseCase title="Recrutadores" desc="Background check de candidatos como sócios e empresas vinculadas." />
            <UseCase title="Jornalistas" desc="Investigação de empresas, sócios, redes societárias e relacionamentos." />
            <UseCase title="Cobrança" desc="Localização de devedores, telefones atualizados, sócios responsáveis." />
            <UseCase title="Análise de crédito" desc="Capital social, tempo de mercado, situação cadastral, risco." />
            <UseCase title="Times jurídicos" desc="Due diligence de fornecedores, parceiros e contrapartes." />
            <UseCase title="Devs e fintechs" desc="API REST para integrar consulta CNPJ ao seu sistema." />
          </div>
        </div>
      </section>

      {/* CTA cadastro */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a66] p-10 sm:p-14 text-white text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#10B981]/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Cadastre-se grátis e libere tudo
              </h2>
              <p className="mt-3 text-white/80 max-w-xl mx-auto">
                Em 30 segundos você tem acesso a telefones, e-mails, sócios e histórico de
                qualquer uma das 65 milhões de empresas. Sem cartão de crédito.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/cadastro"
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-xl px-6 h-12 inline-flex items-center gap-2 transition"
                >
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/planos"
                  className="bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl px-6 h-12 inline-flex items-center backdrop-blur transition"
                >
                  Ver planos pagos
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Sem cartão</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Acesso imediato</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> 100% LGPD</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* API teaser */}
      <section className="py-20 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 text-[#10B981] px-3 py-1 text-xs font-medium">
              <Code className="h-3.5 w-3.5" /> API REST disponível
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              Integre consulta CNPJ ao seu sistema
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              API REST documentada, autenticação por chave, planos por créditos ou volume.
              Ideal para CRMs, fintechs, sistemas de cadastro e prospecção automatizada.
              Compatível com qualquer linguagem.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#10B981]" /> Resposta &lt; 200ms</li>
              <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#10B981]" /> Filtros por UF, CNAE, porte, capital</li>
              <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#10B981]" /> Webhooks de novas empresas</li>
              <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#10B981]" /> Export CSV de listas</li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/api" className="btn-primary rounded-lg px-5 h-11 inline-flex items-center font-medium text-sm">
                Documentação da API
              </Link>
              <Link href="/planos" className="border border-slate-300 hover:border-[#0F4C81] text-slate-700 rounded-lg px-5 h-11 inline-flex items-center font-medium text-sm transition">
                Ver preços
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 text-slate-100 p-6 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-slate-500 mb-2"># Exemplo de uso</div>
            <div><span className="text-pink-400">curl</span> https://juridicoonline.com.br/api/v1/empresa/00000000000191 \</div>
            <div className="pl-4">-H <span className="text-amber-300">"Authorization: Bearer SEU_TOKEN"</span></div>
            <div className="mt-4 text-slate-500"># Resposta</div>
            <div className="text-slate-300">{`{`}</div>
            <div className="pl-3 text-slate-300">
              <span className="text-sky-300">"cnpj"</span>: <span className="text-emerald-300">"00.000.000/0001-91"</span>,
            </div>
            <div className="pl-3 text-slate-300">
              <span className="text-sky-300">"razao_social"</span>: <span className="text-emerald-300">"BANCO DO BRASIL SA"</span>,
            </div>
            <div className="pl-3 text-slate-300">
              <span className="text-sky-300">"situacao"</span>: <span className="text-emerald-300">"ATIVA"</span>,
            </div>
            <div className="pl-3 text-slate-300">
              <span className="text-sky-300">"telefone"</span>: <span className="text-emerald-300">"(61) 3493-9002"</span>,
            </div>
            <div className="pl-3 text-slate-300">
              <span className="text-sky-300">"socios"</span>: <span className="text-slate-400">[ ... ]</span>
            </div>
            <div className="text-slate-300">{`}`}</div>
          </div>
        </div>
      </section>

      {/* States hub */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Empresas por estado
              </h2>
              <p className="mt-2 text-slate-600">
                Explore empresas ativas em qualquer um dos 27 estados brasileiros.
              </p>
            </div>
            <Link href="/empresas" className="text-sm text-[#0F4C81] hover:underline font-medium">
              Ver todos os estados →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {UFS.map((u) => (
              <Link
                key={u.sigla}
                href={`/empresas/${u.sigla.toLowerCase()}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition flex items-center justify-between group"
              >
                <span className="text-slate-700 group-hover:text-[#0F4C81]">{u.nome}</span>
                <span className="text-xs text-slate-400 font-mono">{u.sigla}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Jurídico Online",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br",
            description:
              "Consulta gratuita de empresas, sócios e CNPJ. 65 milhões de empresas brasileiras.",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br"}/buscar?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
      <div className="text-xl sm:text-2xl font-semibold text-[#0F4C81]">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
  gated = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gated?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 card-hover">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {gated && (
              <span className="inline-flex items-center text-[10px] font-medium uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                cadastrados
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function UseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 card-hover">
      <Search className="h-4 w-4 text-[#10B981] mb-3" />
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
