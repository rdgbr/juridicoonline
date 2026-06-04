import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Users, Building2, ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Sócios e Administradores de Empresas Brasileiras | Jurídico Online",
  description:
    "Consulte o quadro societário de empresas brasileiras. Pesquise sócios, diretores e administradores por nome e veja todas as empresas em que aparecem no CNPJ.",
  alternates: { canonical: `${SITE_URL}/socios` },
  openGraph: {
    title: "Sócios e Administradores — Jurídico Online",
    description: "Pesquise o QSA de qualquer empresa. 27 milhões de vínculos societários extraídos da Receita Federal.",
    type: "website",
  },
};

type SocioRow = { nomeSlug: string; nome: string; cnt: number };

async function getTopSocios(limit = 120): Promise<SocioRow[]> {
  // Query pesada em 27M rows. Promise.race com timeout 45s garante que o build
  // não fica preso — se a query demorar, fallback vazio e página renderiza sem a seção.
  const TIMEOUT_MS = 45_000;
  try {
    const query = prisma.$queryRaw<SocioRow[]>`
      SELECT "nomeSlug", nome, COUNT(*)::int AS cnt
      FROM "Socio"
      WHERE LENGTH("nomeSlug") > 10
        AND "nomeSlug" NOT LIKE '%ltda%'
        AND "nomeSlug" NOT LIKE '%eireli%'
        AND "nomeSlug" NOT LIKE '%servicos%'
        AND "nomeSlug" NOT LIKE '%comercial%'
        AND "nomeSlug" NOT LIKE '%industria%'
      GROUP BY "nomeSlug", nome
      HAVING COUNT(*) BETWEEN 5 AND 200
      ORDER BY cnt DESC
      LIMIT ${limit}
    `;
    const timeout = new Promise<SocioRow[]>((resolve) => setTimeout(() => resolve([]), TIMEOUT_MS));
    return await Promise.race([query, timeout]);
  } catch {
    return [];
  }
}

export default async function SociosPage() {
  const topSocios = await getTopSocios(120);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sócios e Administradores de Empresas Brasileiras",
    description: "Consulte o QSA — Quadro de Sócios e Administradores de empresas registradas no CNPJ brasileiro.",
    url: `${SITE_URL}/socios`,
    publisher: { "@type": "Organization", name: "Jurídico Online", url: SITE_URL },
  };

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-slate-500 mb-4">
        <ol className="flex items-center gap-1.5">
          <li><Link href="/" className="hover:text-[#0F4C81]">Início</Link></li>
          <li>/</li>
          <li className="text-slate-700">Sócios</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] p-3">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Sócios e Administradores
          </h1>
        </div>
        <p className="text-slate-600 max-w-2xl">
          O Quadro de Sócios e Administradores (QSA) registra todos os vínculos societários de
          empresas brasileiras. São mais de <strong>27 milhões de registros</strong> extraídos
          diretamente da Receita Federal. Pesquise qualquer nome abaixo.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-[#0F4C81]/20 bg-[#0F4C81]/5 p-4 flex items-center gap-3">
        <Building2 className="h-5 w-5 text-[#0F4C81] shrink-0" />
        <p className="text-sm text-slate-700">
          Para buscar um sócio específico, acesse a página de uma{" "}
          <Link href="/buscar" className="text-[#0F4C81] hover:underline font-medium">empresa</Link>
          {" "}e clique no nome do sócio desejado, ou use a busca acima.
        </p>
      </div>

      {topSocios.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Empresários com maior presença societária
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Pessoas físicas vinculadas a múltiplas empresas no CNPJ — administradores, sócios-gerentes e diretores.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {topSocios.map((s) => (
              <Link
                key={s.nomeSlug}
                href={`/socio/${s.nomeSlug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#0F4C81] hover:shadow-sm transition group flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">
                    {s.nome}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {s.cnt} empresa{s.cnt !== 1 ? "s" : ""}
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0F4C81] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-2">O que é o QSA?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          O <strong>Quadro de Sócios e Administradores (QSA)</strong> é a relação oficial de
          todas as pessoas físicas e jurídicas que compõem o quadro societário de uma empresa
          registrada no CNPJ. Ele inclui sócios, diretores, administradores, representantes
          legais e procuradores. Os dados são registrados pela{" "}
          <strong>Receita Federal do Brasil</strong> e atualizados a cada alteração contratual.
          O Jurídico Online disponibiliza esses dados de forma gratuita, conforme previsto na
          <strong> Lei de Acesso à Informação (LAI)</strong> e tratados em conformidade com a LGPD.
        </p>
      </section>
    </article>
  );
}
