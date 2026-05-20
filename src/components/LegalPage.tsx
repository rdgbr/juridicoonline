import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Wrapper for static legal/info pages with consistent typography and breadcrumb.
 */
export function LegalPage({
  title,
  subtitle,
  updatedAt,
  children,
}: {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <nav className="text-xs text-slate-500 mb-3 flex items-center gap-1" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#0F4C81]">Início</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-700">{title}</span>
      </nav>

      <header className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="mt-3 text-lg text-slate-600">{subtitle}</p>}
        {updatedAt && (
          <p className="mt-3 text-xs text-slate-500">
            Última atualização: <time>{updatedAt}</time>
          </p>
        )}
      </header>

      <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-6 prose-a:text-[#0F4C81] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-li:my-1 prose-p:leading-relaxed">
        {children}
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500">
        <p>
          Dúvidas? Escreva para{" "}
          <a href="mailto:contato@juridicoonline.com.br" className="text-[#0F4C81] hover:underline">
            contato@juridicoonline.com.br
          </a>{" "}
          ou veja a página de{" "}
          <Link href="/contato" className="text-[#0F4C81] hover:underline">
            Contato
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
