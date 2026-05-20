import Link from "next/link";
import { Logo } from "./Logo";
import { HeaderAuthState } from "./HeaderAuthState";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderMobileNav } from "./HeaderMobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center gap-4 sm:gap-6">
        <Logo />

        {/* Compact search — md+ only */}
        <HeaderSearch />

        {/* Primary nav — lg+ only (search takes md space) */}
        <nav className="hidden lg:flex items-center gap-5 text-sm text-slate-600 shrink-0" aria-label="Primary">
          <Link href="/empresas" className="hover:text-[#0F4C81] transition">Estados</Link>
          <Link href="/blog" className="hover:text-[#0F4C81] transition">Blog</Link>
          <Link href="/planos" className="hover:text-[#0F4C81] transition">Planos</Link>
          <Link href="/api" className="hover:text-[#0F4C81] transition">API</Link>
        </nav>

        <div className="flex items-center gap-1.5 ml-auto lg:ml-0 shrink-0">
          <HeaderAuthState />
          <HeaderMobileNav />
        </div>
      </div>
    </header>
  );
}
