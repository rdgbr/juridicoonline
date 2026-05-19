import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { auth } from "@/auth";
import { CadastroForm } from "./CadastroForm";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Cadastre-se grátis",
  description: "Crie sua conta gratuita no Jurídico Online e libere telefones, e-mails e sócios de 65 milhões de empresas.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function CadastroPage({ searchParams }: Props) {
  const sp = await searchParams;
  const session = await auth();
  if (session?.user) redirect(sp.next || "/");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <Logo />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Crie sua conta grátis
          </h1>
          <p className="mt-3 text-slate-600">
            Em 30 segundos você libera telefones, e-mails e sócios de qualquer empresa.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Acesso a 65 milhões de empresas</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Telefones, e-mails e quadro societário</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Receita Federal atualizada diariamente</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> Newsletter "Radar Empresarial" semanal</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#10B981]" /> 100% gratuito, sem cartão</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <CadastroForm nextPath={sp.next} />
          <p className="text-center text-xs text-slate-500 mt-4">
            Já tem conta?{" "}
            <Link href={`/login${sp.next ? `?next=${encodeURIComponent(sp.next)}` : ""}`} className="text-[#0F4C81] hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
