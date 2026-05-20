import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Guias e tutoriais sobre CNPJ, empresas e tributário",
  description: "Artigos sobre consulta CNPJ, regimes tributários, due diligence, LGPD e empreendedorismo no Brasil.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Jurídico Online — Blog",
    description: "Guias e tutoriais sobre CNPJ, empresas e tributário no Brasil.",
    url: `${SITE_URL}/blog`,
    blogPost: posts.slice(0, 10).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: { "@type": "Organization", name: p.author.name },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0F4C81]/8 text-[#0F4C81] px-3 py-1 text-xs font-medium mb-3">
          <BookOpen className="h-3.5 w-3.5" /> Blog Jurídico Online
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Guias e tutoriais sobre CNPJ, empresas e tributário
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Conteúdo prático sobre consulta CNPJ, regimes tributários (MEI, Simples, Lucro Real),
          due diligence, LGPD e tudo o que você precisa para trabalhar com dados de empresas
          brasileiras.
        </p>
      </header>

      <section className="space-y-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-[#0F4C81] hover:shadow-sm transition group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-[#0F4C81]">
                    {p.category}
                  </span>
                  <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.readingMinutes} min
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-[#0F4C81]">
                  {p.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.excerpt}</p>
                <time className="mt-2 text-xs text-slate-400 block">
                  Publicado em {new Date(p.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </time>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0F4C81] shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
