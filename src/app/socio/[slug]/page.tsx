import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import { getEmpresasBySocio, qualificacaoLabel } from "@/lib/socios";
import { empresaSlug, formatCNPJ, razaoSocialDisplay } from "@/lib/cnpj";
import { Building2, User, ArrowRight } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

function unslug(slug: string): string {
  // Reaproveita razaoSocialDisplay para tratar preposições (da/de/dos/etc) corretamente
  return razaoSocialDisplay(slug.replace(/-/g, " "));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nome = unslug(slug);
  // Template do layout adiciona " | Jurídico Online" — não duplicar
  return {
    title: `${nome} - Sócio e empresas no CNPJ`,
    description: `Veja as empresas em que ${nome} é sócio, administrador ou representante legal. Consulte CNPJ, situação cadastral, endereço e quadro societário completo.`,
    alternates: { canonical: `/socio/${slug}` },
    openGraph: { title: `${nome} — Sócio`, type: "profile" },
  };
}

export default async function SocioPage({ params }: Props) {
  const { slug } = await params;
  const nome = unslug(slug);
  if (nome.length < 4) notFound();

  const pairs = await getEmpresasBySocio(slug);
  const empresas = pairs.map((p) => p.empresa);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: nome,
    url: `${SITE_URL}/socio/${slug}`,
    description: `${nome} é sócio ou representante legal de empresas registradas no CNPJ brasileiro.`,
    affiliation: empresas.slice(0, 10).map((e) => ({
      "@type": "Organization",
      name: e.razao_social,
      taxID: formatCNPJ(e.cnpj_completo),
      url: `${SITE_URL}/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Sócios", item: `${SITE_URL}/socios` },
      { "@type": "ListItem", position: 3, name: nome, item: `${SITE_URL}/socio/${slug}` },
    ],
  };

  const hoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date());

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <nav className="text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li>Sócio</li>
          <li>/</li>
          <li className="text-slate-700">{nome}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium mb-2">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {hoje}
        </span>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] p-3">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{nome}</h1>
        </div>
        <p className="mt-3 text-slate-600">
          Sócio, administrador ou representante legal de empresas brasileiras.
        </p>
      </header>

      {pairs.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold tracking-tight mb-3">Empresas em que {nome} aparece ({pairs.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pairs.map(({ empresa: e, socio: s }) => (
              <Link
                key={e.cnpj_completo}
                href={`/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] hover:shadow-sm transition group"
              >
                <div className="flex items-start gap-3">
                  <Building2 className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate group-hover:text-[#0F4C81]">{e.razao_social}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">{formatCNPJ(e.cnpj_completo)}</div>
                    <div className="text-[11px] text-[#0F4C81] mt-1 font-medium">
                      {qualificacaoLabel(s.qualificacao)}
                    </div>
                    {e.municipio_nome && (
                      <div className="text-xs text-slate-500 mt-0.5">{e.municipio_nome}/{e.uf}</div>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0F4C81] mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600 max-w-md mx-auto">
            Não encontramos empresas vinculadas a <strong>{nome}</strong> no momento. Os dados de
            sócios estão sendo integrados gradualmente.
          </p>
          <div className="mt-5">
            <Link href="/buscar" className="text-sm text-[#0F4C81] hover:underline">
              Buscar outra pessoa ou empresa →
            </Link>
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-2">Sobre esta página</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          As informações sobre <strong>{nome}</strong> são extraídas do Quadro de Sócios e
          Administradores (QSA) registrado na Receita Federal. Esta página é gerada a partir de
          dados públicos do CNPJ brasileiro. Para correções ou solicitações LGPD, acesse a{" "}
          <Link href="/lgpd" className="text-[#0F4C81] hover:underline">página LGPD</Link>.
        </p>
      </section>
    </article>
  );
}
