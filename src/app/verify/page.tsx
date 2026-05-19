import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Confirmar acesso — Jurídico Online",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string }> };

/**
 * Intermediate confirmation page to avoid Gmail/antivirus pre-fetch consuming
 * the one-shot magic link token. The user clicks "Confirmar" which triggers
 * a real user-gesture navigation to the actual Auth.js callback URL.
 */
export default async function VerifyPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = sp.next || "";

  // Defensive: only allow same-origin auth callback URLs
  let target: string | null = null;
  try {
    const url = new URL(next);
    const allowedHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br").host;
    if (url.host === allowedHost && url.pathname.startsWith("/api/auth/")) {
      target = url.toString();
    }
  } catch {
    /* invalid url */
  }

  if (!target) {
    redirect("/login?error=invalid_link");
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <Logo />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="rounded-full bg-[#0F4C81]/10 text-[#0F4C81] p-4 w-fit mx-auto mb-4">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Confirme seu acesso</h1>
        <p className="mt-3 text-slate-600 text-sm leading-relaxed">
          Você foi convidado(a) a entrar no Jurídico Online. Clique no botão abaixo para
          continuar.
        </p>

        <a
          href={target}
          className="mt-6 inline-flex items-center justify-center gap-2 w-full btn-primary rounded-lg h-11 font-medium text-sm"
        >
          <ShieldCheck className="h-4 w-4" />
          Entrar agora
        </a>

        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          Este passo extra protege contra scanners de email que podem pré-clicar links
          mágicos. Não compartilhe esta página.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Se você não solicitou este e-mail, pode fechar esta página com segurança.
      </p>
    </div>
  );
}
