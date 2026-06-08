import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";

export function Gate({
  title = "Acesso liberado para usuários cadastrados",
  description = "Cadastre-se grátis e tenha acesso completo a telefones, e-mails e sócios.",
  cta = "Cadastre-se grátis em 30 segundos",
  redirectTo,
}: {
  title?: string;
  description?: string;
  cta?: string;
  redirectTo?: string;
}) {
  const href = redirectTo ? `/cadastro?next=${encodeURIComponent(redirectTo)}` : "/cadastro";
  return (
    <div className="rounded-2xl border border-[#0F4C81]/20 bg-gradient-to-br from-[#0F4C81]/5 to-[#10B981]/5 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-3 shrink-0">
          <Lock className="h-5 w-5 text-[#0F4C81]" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>

          <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              Telefones e e-mails completos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              Sócios e empresas relacionadas
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              Histórico e situação cadastral
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              100% gratuito, sem cartão
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="btn-accent rounded-lg px-5 h-11 inline-flex items-center font-medium text-sm"
            >
              {cta}
            </Link>
            <Link href="/login" className="text-sm text-slate-600 hover:text-[#0F4C81]">
              Já tenho conta →
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Mais de 5.000 contadores, advogados e analistas já consultam diariamente.
          </p>
        </div>
      </div>
    </div>
  );
}
