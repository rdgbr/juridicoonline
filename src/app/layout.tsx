import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br";

const CF_ANALYTICS_TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN || "";
const BING_VERIFY        = process.env.NEXT_PUBLIC_BING_VERIFY || "";
const YANDEX_VERIFY      = process.env.NEXT_PUBLIC_YANDEX_VERIFY || "";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jurídico Online — Consulta de empresas, sócios e CNPJ",
    template: "%s | Jurídico Online",
  },
  description:
    "Consulta gratuita de mais de 65 milhões de empresas brasileiras. Pesquise por CNPJ, razão social, sócio, telefone ou endereço. Dados oficiais da Receita Federal, atualizados diariamente.",
  keywords: [
    "consulta CNPJ",
    "consulta empresa",
    "razão social",
    "sócios CNPJ",
    "telefone empresa",
    "Receita Federal",
    "empresas Brasil",
    "CNPJ grátis",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Jurídico Online",
    title: "Jurídico Online — Consulta de empresas, sócios e CNPJ",
    description:
      "Mais de 65 milhões de empresas. Pesquise por CNPJ, razão social, sócio, telefone. Cadastre-se grátis.",
    images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jurídico Online — Consulta de empresas e CNPJ",
    description: "65 milhões de empresas brasileiras. Cadastre-se grátis.",
    images: [`${SITE_URL}/api/og`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  // Verificações de webmaster: Bing e Yandex (Google já é via DNS TXT).
  // Os valores vêm de env vars; se vazias, a tag fica vazia mas inofensiva.
  verification: {
    other: {
      ...(BING_VERIFY ? { "msvalidate.01": BING_VERIFY } : {}),
      ...(YANDEX_VERIFY ? { "yandex-verification": YANDEX_VERIFY } : {}),
    },
  },
};

export const viewport = {
  themeColor: "#0F4C81",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {/* Organization + WebSite schema (sitelinks searchbox + entity recognition) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Jurídico Online",
                alternateName: ["JOL", "Juridico Online"],
                url: SITE_URL,
                logo: {
                  "@type": "ImageObject",
                  url: `${SITE_URL}/icon.svg`,
                  width: 64,
                  height: 64,
                },
                description:
                  "Consulta gratuita de 65 milhões de empresas brasileiras. CNPJ, sócios, situação cadastral, contatos. Dados Receita Federal atualizados diariamente.",
                foundingDate: "2026",
                areaServed: { "@type": "Country", name: "Brasil" },
                knowsAbout: [
                  "Consulta CNPJ",
                  "Cadastro Nacional da Pessoa Jurídica",
                  "Receita Federal do Brasil",
                  "Quadro Societário",
                  "CNAE",
                  "Simples Nacional",
                  "MEI",
                  "Junta Comercial",
                ],
                sameAs: [
                  "https://juridicoempauta.com.br",
                  "https://licitascanner.com.br",
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    contactType: "customer support",
                    email: "contato@juridicoonline.com.br",
                    availableLanguage: ["Portuguese"],
                    areaServed: "BR",
                  },
                  {
                    "@type": "ContactPoint",
                    contactType: "sales",
                    email: "vendas@juridicoonline.com.br",
                    availableLanguage: ["Portuguese"],
                    areaServed: "BR",
                  },
                  {
                    "@type": "ContactPoint",
                    contactType: "data protection",
                    email: "dpo@juridicoonline.com.br",
                    availableLanguage: ["Portuguese"],
                    areaServed: "BR",
                  },
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "Jurídico Online",
                description:
                  "Consulta gratuita de empresas, sócios e CNPJs no Brasil — Receita Federal atualizada diariamente.",
                inLanguage: "pt-BR",
                publisher: { "@id": `${SITE_URL}/#organization` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Analytics — GA4 + Hotjar (NEXT_PUBLIC_ baked no build) */}
        <Analytics />

        {/* ── Cloudflare Web Analytics — sem cookies, LGPD-safe ────────── */}
        {CF_ANALYTICS_TOKEN && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${CF_ANALYTICS_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
