import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { auth } from "@/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await auth();
  if (session?.user) redirect(sp.next || "/");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <Logo />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Entrar
        </h1>
        <p className="text-center text-sm text-slate-500 mt-1">
          Receba um link de acesso no seu e-mail
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={sp.next || ""} />

          {sp.error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
              E-mail inválido. Tente novamente.
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary rounded-lg h-11 font-medium text-sm"
          >
            Enviar link de acesso
          </button>
          <p className="text-center text-xs text-slate-400">
            Vamos enviar um link mágico no seu e-mail. Clique nele e estará dentro.
          </p>

          <p className="text-center text-xs text-slate-500">
            Não tem conta?{" "}
            <Link href={`/cadastro${sp.next ? `?next=${encodeURIComponent(sp.next)}` : ""}`} className="text-[#0F4C81] hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
