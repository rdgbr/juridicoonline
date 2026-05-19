import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br";

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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
