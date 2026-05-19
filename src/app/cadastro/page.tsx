import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { auth } from "@/auth";
import { cadastroAction } from "./actions";
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
          <form action={cadastroAction} className="space-y-4">
            <input type="hidden" name="next" value={sp.next || ""} />

            {sp.error && (
              <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
                {sp.error === "invalid"
                  ? "Verifique os dados informados."
                  : "Erro no cadastro. Tente novamente."}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Seu nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="Como podemos te chamar?"
                className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
              />
            </div>

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

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1.5">
                Para que vai usar? <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <select
                id="purpose"
                name="purpose"
                className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
              >
                <option value="">Selecione…</option>
                <option value="vendas">Prospecção de clientes B2B</option>
                <option value="contabil">Trabalho contábil</option>
                <option value="rh">Recrutamento e seleção</option>
                <option value="cobranca">Cobrança e localização</option>
                <option value="credito">Análise de crédito</option>
                <option value="juridico">Jurídico / due diligence</option>
                <option value="jornalismo">Jornalismo / pesquisa</option>
                <option value="dev">Desenvolvedor / API</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" name="newsletter" defaultChecked className="mt-1 accent-[#0F4C81]" />
              <span>Quero receber a newsletter <strong>Radar Empresarial</strong> com novas empresas e tendências.</span>
            </label>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" name="terms" required className="mt-1 accent-[#0F4C81]" />
              <span>
                Concordo com os{" "}
                <Link href="/termos" className="text-[#0F4C81] underline">Termos de Uso</Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-[#0F4C81] underline">Política de Privacidade</Link>.
              </span>
            </label>

            <button
              type="submit"
              className="w-full btn-primary rounded-lg h-11 font-medium text-sm"
            >
              Criar conta grátis
            </button>

            <p className="text-center text-xs text-slate-500">
              Já tem conta?{" "}
              <Link href={`/login${sp.next ? `?next=${encodeURIComponent(sp.next)}` : ""}`} className="text-[#0F4C81] hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
