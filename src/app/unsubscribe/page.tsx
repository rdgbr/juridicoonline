import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancelar assinatura — Jurídico Online",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ email?: string; token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const sp = await searchParams;
  const email = sp.email?.toLowerCase().trim() || "";

  let status: "form" | "done" | "error" = "form";
  let message = "";

  if (email) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { email },
          data: { newsletterOptIn: false },
        });
        status = "done";
        message = `Pronto! ${email} não receberá mais newsletters e e-mails de marketing do Jurídico Online.`;
      } else {
        status = "error";
        message = `Não encontramos o email ${email} em nossa base. Talvez já tenha sido removido.`;
      }
    } catch {
      status = "error";
      message = "Erro ao processar. Tente novamente ou entre em contato.";
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        {status === "done" && (
          <>
            <div className="rounded-full bg-emerald-50 p-3 w-fit mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-center">Cancelamento confirmado</h1>
            <p className="mt-3 text-slate-600 text-sm text-center">{message}</p>
            <p className="mt-4 text-xs text-slate-400 text-center">
              Você continua podendo usar o site normalmente, apenas não receberá mais e-mails
              promocionais. Para deletar sua conta completamente, envie email para
              dpo@juridicoonline.com.br.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="rounded-full bg-amber-50 p-3 w-fit mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-amber-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-center">Atenção</h1>
            <p className="mt-3 text-slate-600 text-sm text-center">{message}</p>
          </>
        )}

        {status === "form" && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-center">Cancelar assinatura</h1>
            <p className="mt-3 text-slate-600 text-sm text-center">
              Informe o e-mail para não receber mais comunicações do Jurídico Online.
            </p>
            <form method="GET" className="mt-6 space-y-3">
              <input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                defaultValue={email}
                className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
              />
              <button
                type="submit"
                className="w-full btn-primary rounded-lg h-11 font-medium text-sm"
              >
                Cancelar assinatura
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
