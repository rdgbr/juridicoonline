import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getRelatedPosts, getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post não encontrado" };

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
      description: post.author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "Jurídico Online",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    image: `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    timeRequired: `PT${post.readingMinutes}M`,
    wordCount: post.body.replace(/<[^>]+>/g, "").split(/\s+/).length,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <Link href="/blog" className="text-sm text-[#0F4C81] hover:underline inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar pro blog
      </Link>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F4C81]">
            {post.category}
          </span>
          <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readingMinutes} min de leitura
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-slate-600">{post.excerpt}</p>
        <div className="mt-4 text-sm text-slate-500">
          Por <strong className="text-slate-700">{post.author.name}</strong> ·{" "}
          <time>
            Publicado em{" "}
            {new Date(post.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <>
              {" "}· Atualizado em{" "}
              <time>{new Date(post.updatedAt).toLocaleDateString("pt-BR")}</time>
            </>
          )}
        </div>
      </header>

      <div
        className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-8 prose-h3:text-lg prose-h3:mt-6 prose-a:text-[#0F4C81] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <section className="mt-12 pt-8 border-t border-slate-200">
        <div className="rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a66] p-6 sm:p-8 text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Coloque em prática agora</h2>
          <p className="text-sm text-white/80 max-w-md mx-auto mb-5">
            Consulte qualquer CNPJ brasileiro grátis em segundos. Telefones, sócios, situação,
            endereço — tudo num só lugar.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-lg px-6 h-11 transition"
          >
            Cadastrar grátis
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Leia também</h2>
          <div className="space-y-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-[#0F4C81]">{r.category}</div>
                    <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">
                      {r.title}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0F4C81] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
