// Página de serviço profissional — gera leads para parceiros
// Dados em /lib/servicos.ts, rota dinâmica para todos os slugs
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICOS, getServico } from "@/lib/servicos";
import { SITE_URL } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { CheckCircle2, ArrowRight, Phone } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) return { title: "Serviço não encontrado" };
  return {
    title: `${servico.titulo} — Profissionais Verificados`,
    description: servico.descricao,
    keywords: servico.keywords,
    alternates: { canonical: `/servicos/${slug}` },
    openGraph: { title: servico.titulo, description: servico.descricao, type: "website" },
  };
}

const BULLETS_BY_CATEGORIA: Record<string, string[]> = {
  contabilidade: [
    "Escrituração contábil e fiscal completa",
    "Apuração e pagamento de impostos (DAS, DARF, GPS, ISS)",
    "Declarações acessórias (DCTF, ECF, SPED, DEFIS)",
    "Folha de pagamento, eSocial e FGTS",
    "Emissão de certidões negativas e planejamento tributário",
  ],
  advocacia: [
    "Elaboração e revisão de contratos empresariais",
    "Constituição, alteração e dissolução societária",
    "Assessoria em due diligence e M&A",
    "Compliance, LGPD e governança corporativa",
    "Representação em disputas societárias e arbitragem",
  ],
  financeiro: [
    "Abertura de conta PJ 100% digital",
    "Pix, TED e boleto sem anuidade",
    "Capital de giro e crédito empresarial",
    "Integração com sistemas de gestão e contabilidade",
    "Gestão de folha de pagamento e benefícios",
  ],
  digital: [
    "Emissão de e-CNPJ A1 (arquivo) e A3 (token)",
    "Validação presencial ou por videoconferência",
    "Suporte para instalação e configuração",
    "Renovação automática com antecedência",
    "Compatível com NF-e, eSocial, SPED e gov.br",
  ],
};

export default async function ServicosSlugPage({ params }: Props) {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) notFound();

  const allPosts = getAllPosts();
  const postsRelacionados = servico.blogRelacionado
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean);

  const bullets = BULLETS_BY_CATEGORIA[servico.categoria] ?? [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: servico.faqs.map((f) => ({
      "@type": "Question",
      name: f.pergunta,
      acceptedAnswer: { "@type": "Answer", text: f.resposta },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Serviços", item: `${SITE_URL}/servicos` },
      { "@type": "ListItem", position: 3, name: servico.titulo, item: `${SITE_URL}/servicos/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-6 flex items-center gap-1">
          <Link href="/" className="hover:text-[#0F4C81]">Início</Link>
          <span>/</span>
          <Link href="/servicos" className="hover:text-[#0F4C81]">Serviços</Link>
          <span>/</span>
          <span className="text-slate-700">{servico.titulo}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="text-4xl mb-3">{servico.icone}</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{servico.titulo}</h1>
          <p className="text-lg text-slate-600">{servico.subtitulo}</p>
        </header>

        {/* CTA Principal */}
        <div className="bg-[#0F4C81] text-white rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-1">{servico.ctaTexto}</h2>
          <p className="text-blue-200 text-sm mb-4">{servico.ctaSubtexto}</p>
          <Link
            href={`/parceiros?servico=${slug}`}
            className="inline-flex items-center gap-2 bg-white text-[#0F4C81] font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Phone className="h-4 w-4" />
            Solicitar contato
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Descrição */}
        <p className="text-slate-700 text-base leading-relaxed mb-8">{servico.descricao}</p>

        {/* O que inclui */}
        {bullets.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">O que inclui</h2>
            <ul className="space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {servico.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Perguntas frequentes</h2>
            <div className="space-y-3">
              {servico.faqs.map((faq) => (
                <details
                  key={faq.pergunta}
                  className="border border-slate-200 rounded-xl overflow-hidden group"
                >
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-slate-800 hover:bg-slate-50 list-none">
                    {faq.pergunta}
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-slate-600 text-sm leading-relaxed">
                    {faq.resposta}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Artigos relacionados */}
        {postsRelacionados.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Artigos relacionados</h2>
            <div className="space-y-3">
              {postsRelacionados.map((post) => {
                if (!post) return null;
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block border border-slate-200 rounded-xl px-4 py-3 hover:border-[#0F4C81] hover:bg-blue-50 transition-colors group"
                  >
                    <div className="font-medium text-slate-800 group-hover:text-[#0F4C81]">{post.title}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{post.excerpt}</div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <div className="text-2xl mb-2">{servico.icone}</div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{servico.ctaTexto}</h3>
          <p className="text-sm text-slate-500 mb-4">{servico.ctaSubtexto}</p>
          <Link
            href={`/parceiros?servico=${slug}`}
            className="inline-flex items-center gap-2 bg-[#0F4C81] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Solicitar contato
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
