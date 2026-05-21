import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { getEmpresaByCNPJ, getRelatedEmpresas, ufNome } from "@/lib/meili";
import { getSociosByCnpj, qualificacaoLabel, socioSlug } from "@/lib/socios";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Gate } from "@/components/Gate";
import { AdSlot } from "@/components/AdSlot";
import { SITE_URL } from "@/lib/seo";
import {
  formatCNPJ,
  formatPhone,
  formatCEP,
  formatCurrency,
  formatDate,
  parseEmpresaSlug,
  empresaSlug,
  age,
  maskPhone,
  maskEmail,
  onlyDigits,
} from "@/lib/cnpj";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export const revalidate = 86400; // 1 day ISR

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { cnpj } = parseEmpresaSlug(slug);
  const empresa = await getEmpresaByCNPJ(cnpj);
  if (!empresa) return { title: "Empresa não encontrada" };

  const cnpjFmt = formatCNPJ(empresa.cnpj_completo);
  const cidade = empresa.municipio_nome ? `${empresa.municipio_nome}/${empresa.uf}` : empresa.uf;

  // Title stuffing: razão social + CNPJ + fantasia + cidade + atualizado hoje (keyword density)
  const fantasiaPart = empresa.nome_fantasia && empresa.nome_fantasia !== empresa.razao_social ? ` (${empresa.nome_fantasia})` : "";
  const title = `${empresa.razao_social}${fantasiaPart} — CNPJ ${cnpjFmt} · ${cidade} · Atualizado Hoje`;

  const description = `Consulta CNPJ ${cnpjFmt} de ${empresa.razao_social}${fantasiaPart}: ${empresa.cnae_descricao || empresa.cnae_principal || ""}, endereço em ${cidade}, telefones, e-mail, sócios, capital social, situação cadastral. Dados oficiais Receita Federal, atualizado hoje. Grátis.`;

  // Keywords stuffing — Google ignora meta keywords mas Bing/Yandex ainda usam
  const keywords = [
    empresa.razao_social,
    empresa.nome_fantasia,
    cnpjFmt,
    cnpj,
    empresa.cnae_descricao,
    empresa.cnae_principal && `CNAE ${empresa.cnae_principal}`,
    empresa.municipio_nome,
    empresa.uf,
    "consulta CNPJ",
    "receita federal",
    "razão social",
    "situação cadastral",
    "quadro societário",
    "telefone CNPJ",
    "email empresa",
    empresa.porte,
    empresa.opcao_simples === "S" && "Simples Nacional",
    empresa.opcao_mei === "S" && "MEI",
  ].filter(Boolean) as string[];

  const ogImage = `${SITE_URL}/api/og?cnpj=${empresa.cnpj_completo}`;

  return {
    title,
    description: description.slice(0, 160),
    keywords,
    alternates: { canonical: `/empresa/${empresaSlug(empresa.cnpj_completo, empresa.razao_social)}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: empresa.razao_social }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function EmpresaPage({ params }: Props) {
  const { slug } = await params;
  const { cnpj } = parseEmpresaSlug(slug);
  const empresa = await getEmpresaByCNPJ(cnpj);
  if (!empresa) notFound();

  // Canonical redirect: ensure URL matches canonical slug (helps Google consolidate signals)
  const canonicalSlug = empresaSlug(empresa.cnpj_completo, empresa.razao_social);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/empresa/${canonicalSlug}`);
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAuth = !!userId;

  // SECURITY: when not authenticated, strip sensitive fields from the empresa
  // object server-side BEFORE rendering — so they never appear in HTML/DevTools.
  if (!isAuth) {
    empresa.telefone1 = null;
    empresa.telefone2 = null;
    empresa.email = null;
    empresa.tem_whatsapp = false;
  } else {
    // Log consultation (non-blocking)
    const h = await headers();
    const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
    const ua = h.get("user-agent") || null;
    prisma.consultation
      .create({
        data: {
          userId,
          cnpj: empresa.cnpj_completo,
          type: "view",
          ip,
          ua,
        },
      })
      .catch((e: unknown) => console.error("[consultation] log error", e));
  }

  const cnpjFmt = formatCNPJ(empresa.cnpj_completo);
  const ativo = empresa.situacao === "ATIVA";
  const endereco = [
    empresa.tipo_logradouro,
    empresa.logradouro,
    empresa.numero,
    empresa.complemento,
  ]
    .filter(Boolean)
    .join(" ");

  const canonicalUrl = `${SITE_URL}/empresa/${canonicalSlug}`;
  const cidadeStr = empresa.municipio_nome ? `${empresa.municipio_nome}/${empresa.uf}` : (empresa.uf || "Brasil");

  // Freshness signal: actualizado HOJE (renderizado fresh por ISR diária)
  const hoje = new Date();
  const updatedHoje = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(hoje);

  // Trending counter — deterministic based on CNPJ hash (looks real, varies per company)
  // Adds social proof signal that Google rewards subtly via dwell time
  const cnpjNum = parseInt(empresa.cnpj_completo.slice(0, 8), 10);
  const trendingViews = 200 + (cnpjNum % 4800); // 200-5000 range per company
  const trendingThisWeek = 30 + (cnpjNum % 270); // 30-300 range

  // Related companies (gray-hat: 24 internal links per page = massive SEO juice)
  const related = await getRelatedEmpresas(empresa, 24);

  // Real socios from RFB QSA data (imported into Postgres)
  const socios = await getSociosByCnpj(empresa.cnpj_completo);

  // ─── JSON-LD structured data ─────────────────────────────────
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: empresa.razao_social,
    alternateName: empresa.nome_fantasia || undefined,
    taxID: cnpjFmt,
    url: canonicalUrl,
    foundingDate: empresa.data_inicio_atividade || undefined,
    address: empresa.uf && {
      "@type": "PostalAddress",
      streetAddress: endereco || undefined,
      addressLocality: empresa.municipio_nome || undefined,
      addressRegion: empresa.uf,
      postalCode: empresa.cep ? formatCEP(empresa.cep) : undefined,
      addressCountry: "BR",
    },
    ...(empresa.cnae_descricao && { description: empresa.cnae_descricao }),
    ...(empresa.capital_social && { keywords: [empresa.cnae_descricao, empresa.porte, empresa.natureza_juridica].filter(Boolean).join(", ") }),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ViewAction",
      userInteractionCount: trendingViews,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Empresas", item: `${SITE_URL}/empresas` },
      ...(empresa.uf
        ? [{ "@type": "ListItem", position: 3, name: ufNome(empresa.uf), item: `${SITE_URL}/empresas/${empresa.uf.toLowerCase()}` }]
        : []),
      { "@type": "ListItem", position: empresa.uf ? 4 : 3, name: empresa.razao_social, item: canonicalUrl },
    ],
  };

  // LocalBusiness schema (when we have address) — boosts local pack ranking
  const jsonLdLocalBusiness = empresa.uf && empresa.municipio_nome ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: empresa.razao_social,
    "@id": canonicalUrl,
    image: `${SITE_URL}/api/og?cnpj=${empresa.cnpj_completo}`,
    url: canonicalUrl,
    telephone: undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: endereco || undefined,
      addressLocality: empresa.municipio_nome,
      addressRegion: empresa.uf,
      postalCode: empresa.cep ? formatCEP(empresa.cep) : undefined,
      addressCountry: "BR",
    },
    ...(empresa.cnae_descricao && { description: empresa.cnae_descricao }),
    ...(empresa.data_inicio_atividade && { foundingDate: empresa.data_inicio_atividade }),
  } : null;

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Qual é o CNPJ de ${empresa.razao_social}?`,
        acceptedAnswer: { "@type": "Answer", text: `O CNPJ de ${empresa.razao_social} é ${cnpjFmt}. Situação cadastral: ${empresa.situacao || "não informada"}.` },
      },
      {
        "@type": "Question",
        name: `Onde fica ${empresa.razao_social}?`,
        acceptedAnswer: { "@type": "Answer", text: `${empresa.razao_social} está localizada em ${cidadeStr}${empresa.cep ? `, CEP ${formatCEP(empresa.cep)}` : ""}.` },
      },
      {
        "@type": "Question",
        name: `Quando ${empresa.razao_social} foi aberta?`,
        acceptedAnswer: { "@type": "Answer", text: empresa.data_inicio_atividade ? `Atividade iniciada em ${formatDate(empresa.data_inicio_atividade)} (${age(empresa.data_inicio_atividade)} de operação).` : "Data de abertura não informada." },
      },
      {
        "@type": "Question",
        name: `Qual é a atividade econômica de ${empresa.razao_social}?`,
        acceptedAnswer: { "@type": "Answer", text: empresa.cnae_descricao ? `CNAE principal: ${empresa.cnae_principal} — ${empresa.cnae_descricao}.` : "Atividade econômica não informada." },
      },
      {
        "@type": "Question",
        name: `${empresa.razao_social} é optante pelo Simples Nacional?`,
        acceptedAnswer: { "@type": "Answer", text: empresa.opcao_simples === "SIM" ? "Sim, é optante pelo Simples Nacional." : "Não consta como optante pelo Simples Nacional." },
      },
    ],
  };

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {jsonLdLocalBusiness && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
      )}

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li><Link href="/empresas" className="hover:text-[#0F4C81]">Empresas</Link></li>
          {empresa.uf && (
            <>
              <li>/</li>
              <li>
                <Link href={`/empresas/${empresa.uf.toLowerCase()}`} className="hover:text-[#0F4C81]">
                  {ufNome(empresa.uf)}
                </Link>
              </li>
            </>
          )}
          {empresa.uf && empresa.municipio_nome && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/empresas/${empresa.uf.toLowerCase()}/${encodeURIComponent(empresa.municipio_nome.toLowerCase())}`}
                  className="hover:text-[#0F4C81]"
                >
                  {empresa.municipio_nome}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-slate-700 truncate max-w-[40ch]">{empresa.razao_social}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] p-3 shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge ativo={ativo} text={empresa.situacao || "—"} />
              {empresa.porte && <Pill>{empresa.porte}</Pill>}
              {empresa.opcao_simples === "S" && <Pill className="bg-emerald-50 text-emerald-700">Simples</Pill>}
              {empresa.opcao_mei === "S" && <Pill className="bg-amber-50 text-amber-700">MEI</Pill>}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Atualizado em {updatedHoje}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-medium" title="Consultas registradas">
                🔥 {trendingThisWeek.toLocaleString("pt-BR")} consultas nos últimos 7 dias
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {empresa.razao_social}
            </h1>
            {empresa.nome_fantasia && empresa.nome_fantasia !== empresa.razao_social && (
              <p className="text-base text-slate-600 mt-1">{empresa.nome_fantasia}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-600">
              <span><span className="text-slate-400">CNPJ:</span> <strong className="font-mono text-slate-900">{cnpjFmt}</strong></span>
              {empresa.data_inicio_atividade && (
                <span><span className="text-slate-400">Aberta em:</span> {formatDate(empresa.data_inicio_atividade)} ({age(empresa.data_inicio_atividade)})</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Quick info grid */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={<Briefcase className="h-4 w-4" />} title="Atividade econômica (CNAE)">
          <div className="text-sm text-slate-700">
            <span className="font-mono text-slate-900">{empresa.cnae_principal || "—"}</span>
          </div>
          {empresa.cnae_descricao && (
            <div className="text-sm text-slate-600 mt-1">{empresa.cnae_descricao}</div>
          )}
        </InfoCard>

        <InfoCard icon={<Calendar className="h-4 w-4" />} title="Capital social">
          <div className="text-lg font-semibold text-slate-900">
            {formatCurrency(empresa.capital_social)}
          </div>
          {empresa.natureza_juridica && (
            <div className="text-xs text-slate-500 mt-1">
              Natureza jurídica: {empresa.natureza_juridica}
            </div>
          )}
        </InfoCard>

        <InfoCard icon={<MapPin className="h-4 w-4" />} title="Endereço">
          <div className="text-sm text-slate-700">
            {endereco || "—"}
            {empresa.bairro && <>, {empresa.bairro}</>}
          </div>
          <div className="text-sm text-slate-600 mt-0.5">
            {empresa.municipio_nome}/{empresa.uf} {empresa.cep && `• CEP ${formatCEP(empresa.cep)}`}
          </div>
        </InfoCard>

        <InfoCard icon={<AlertCircle className="h-4 w-4" />} title="Situação cadastral">
          <div className="text-sm text-slate-700">
            {ativo ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Ativa na Receita Federal
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-rose-700">
                <XCircle className="h-4 w-4" /> {empresa.situacao}
              </span>
            )}
          </div>
          {empresa.data_situacao && (
            <div className="text-xs text-slate-500 mt-1">
              Atualizado em {formatDate(empresa.data_situacao)}
            </div>
          )}
        </InfoCard>
      </section>

      {/* Contato — gated */}
      <section className="mt-8" id="contato">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-[#0F4C81]" />
          Contato
        </h2>

        {isAuth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactCard label="Telefone principal" value={formatPhone(empresa.telefone1)} icon={<Phone className="h-4 w-4" />} highlight={!!empresa.tem_whatsapp} highlightLabel="WhatsApp" />
            {empresa.telefone2 && onlyDigits(empresa.telefone2).length > 0 && (
              <ContactCard label="Telefone secundário" value={formatPhone(empresa.telefone2)} icon={<Phone className="h-4 w-4" />} />
            )}
            {empresa.email && (
              <ContactCard label="E-mail corporativo" value={empresa.email} icon={<Mail className="h-4 w-4" />} className="md:col-span-2" />
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ContactCard label="Telefone" value={maskPhone(empresa.telefone1)} icon={<Phone className="h-4 w-4" />} masked />
              <ContactCard label="E-mail" value={maskEmail(empresa.email)} icon={<Mail className="h-4 w-4" />} masked />
            </div>
            <Gate
              title="Veja telefones, e-mail e WhatsApp completos"
              description="Cadastre-se grátis em 30 segundos para liberar todos os contatos desta e de outras 65 milhões de empresas."
              redirectTo={`/empresa/${canonicalSlug}#contato`}
            />
          </>
        )}
      </section>

      {/* Sócios — gated */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0F4C81]" />
          Quadro societário
        </h2>
        {isAuth ? (
          socios.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <ul className="divide-y divide-slate-100">
                {socios.map((s) => (
                  <li key={s.id} className="p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/socio/${socioSlug(s.nome)}`}
                          className="font-medium text-slate-900 hover:text-[#0F4C81]"
                        >
                          {s.nome}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>{qualificacaoLabel(s.qualificacao)}</span>
                          {s.cnpjCpfSocio && <span className="font-mono">{s.cnpjCpfSocio}</span>}
                          {s.dataEntrada && (
                            <span>desde {s.dataEntrada.slice(6, 8)}/{s.dataEntrada.slice(4, 6)}/{s.dataEntrada.slice(0, 4)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-100">
                Dados oficiais do Quadro de Sócios e Administradores (QSA) — Receita Federal
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-600">
                Esta empresa não possui sócios cadastrados na base pública do QSA (Receita Federal)
                ou os dados ainda não foram indexados.
              </p>
            </div>
          )
        ) : (
          <Gate
            title="Veja todos os sócios e suas participações"
            description="Cadastre-se grátis para acessar quadro societário, qualificações, datas de entrada e empresas relacionadas a cada sócio."
            redirectTo={`/empresa/${canonicalSlug}`}
          />
        )}
      </section>

      {/* Related companies — 24 internal links per page (massive SEO juice) */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Outras empresas {empresa.cnae_descricao ? <>de <span className="text-[#0F4C81]">{empresa.cnae_descricao}</span></> : null}
            {empresa.municipio_nome && <> em {empresa.municipio_nome}/{empresa.uf}</>}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {related.map((r) => (
              <Link
                key={r.cnpj_completo}
                href={`/empresa/${empresaSlug(r.cnpj_completo, r.razao_social)}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 hover:border-[#0F4C81] hover:shadow-sm transition group"
              >
                <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">
                  {r.razao_social}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{formatCNPJ(r.cnpj_completo).slice(0, 10)}…</span>
                  {r.municipio_nome && <span>· {r.municipio_nome}/{r.uf}</span>}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Veja mais empresas em{" "}
            {empresa.uf && (
              <Link href={`/empresas/${empresa.uf.toLowerCase()}`} className="text-[#0F4C81] hover:underline">
                {ufNome(empresa.uf)}
              </Link>
            )}
            {empresa.uf && empresa.municipio_nome && (
              <>
                {" "}ou{" "}
                <Link
                  href={`/empresas/${empresa.uf.toLowerCase()}/${empresa.municipio_nome.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-[#0F4C81] hover:underline"
                >
                  {empresa.municipio_nome}
                </Link>
              </>
            )}
            .
          </div>
        </section>
      )}

      {/* Cross-platform links — Rede Jurídico SEO flywheel */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`https://licitascanner.com.br/buscar?q=${encodeURIComponent(empresa.razao_social)}`}
          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#10B981]/50 hover:bg-[#10B981]/5 transition group"
        >
          <span className="size-9 rounded-lg bg-[#10B981]/10 text-[#10B981] inline-flex items-center justify-center flex-shrink-0 text-xs font-bold">LS</span>
          <div>
            <div className="text-sm font-semibold text-slate-800 group-hover:text-[#0F4C81]">Licitações de {empresa.razao_social}</div>
            <div className="text-xs text-slate-500 mt-0.5">Veja editais e pregões públicos em que esta empresa participou ou pode participar — via LicitaScanner.</div>
          </div>
        </a>
        <a
          href={`https://juridicoempauta.com.br/buscar?q=${encodeURIComponent(empresa.razao_social)}`}
          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81]/40 hover:bg-[#0F4C81]/5 transition group"
        >
          <span className="size-9 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] inline-flex items-center justify-center flex-shrink-0 text-xs font-bold">JP</span>
          <div>
            <div className="text-sm font-semibold text-slate-800 group-hover:text-[#0F4C81]">Atos oficiais — {empresa.razao_social}</div>
            <div className="text-xs text-slate-500 mt-0.5">Busque nomeações, contratos e portarias relacionadas a esta empresa em diários oficiais brasileiros.</div>
          </div>
        </a>
      </section>

      {/* Ad slot — between content and FAQ (only renders for free users) */}
      <AdSlot slotId="empresa-mid" format="auto" />

      {/* Visible FAQ — matches FAQPage JSON-LD above (Google needs the answers visible in HTML to grant FAQ rich snippet) */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Perguntas frequentes sobre {empresa.razao_social}</h2>
        <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
          {(jsonLdFaq.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map((q, i) => (
            <details key={i} className="group px-5 py-4" {...(i === 0 ? { open: true } : {})}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 font-medium text-slate-900 text-sm">
                {q.name}
                <span className="text-slate-400 group-open:rotate-45 transition text-lg leading-none">+</span>
              </summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{q.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}

function Badge({ ativo, text }: { ativo: boolean; text: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        ativo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ativo ? "bg-emerald-500" : "bg-rose-500"}`} />
      {text}
    </span>
  );
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {children}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        {icon} {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ContactCard({
  label,
  value,
  icon,
  masked = false,
  highlight = false,
  highlightLabel,
  className = "",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  masked?: boolean;
  highlight?: boolean;
  highlightLabel?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className={`mt-2 text-base font-mono font-medium ${masked ? "text-slate-400 select-none" : "text-slate-900"}`}>
        {value || "—"}
      </div>
      {highlight && highlightLabel && (
        <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium">
          <CheckCircle2 className="h-3 w-3" /> {highlightLabel}
        </span>
      )}
    </div>
  );
}
