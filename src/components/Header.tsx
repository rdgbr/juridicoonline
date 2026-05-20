import Link from "next/link";
import { Logo } from "./Logo";
import { HeaderAuthState } from "./HeaderAuthState";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/empresas" className="hover:text-[#0F4C81] transition">Estados</Link>
          <Link href="/blog" className="hover:text-[#0F4C81] transition">Blog</Link>
          <Link href="/planos" className="hover:text-[#0F4C81] transition">Planos</Link>
          <Link href="/api" className="hover:text-[#0F4C81] transition">API</Link>
          <Link href="/sobre" className="hover:text-[#0F4C81] transition">Sobre</Link>
        </nav>

        <div className="flex items-center gap-2">
          <HeaderAuthState />
        </div>
      </div>
    </header>
  );
}
