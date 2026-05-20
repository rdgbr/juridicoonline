import Link from "next/link";
import { Logo } from "./Logo";
import { auth } from "@/auth";

export async function Header() {
  const session = await auth();
  const user = session?.user;

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
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-600">
                Olá, <span className="font-medium text-slate-900">{(user.name || user.email || "").split(" ")[0].split("@")[0]}</span>
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5"
              >
                Sair
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-700 hover:text-slate-900 px-3 py-1.5"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="text-sm btn-primary rounded-lg px-3.5 py-2 font-medium"
              >
                Cadastre-se grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
