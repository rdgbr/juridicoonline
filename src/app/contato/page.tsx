import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { ContatoForm } from "./ContatoForm";
import { Mail, MessageSquare, Shield, Newspaper, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a equipe do Jurídico Online — suporte, comercial, LGPD e imprensa.",
  alternates: { canonical: "/contato" },
};

export const dynamic = "force-dynamic";

export default async function ContatoPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Contato</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Estamos disponíveis para dúvidas, parcerias, solicitações LGPD e imprensa.
          Use o formulário abaixo ou escreva direto para um dos e-mails.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-1">Envie uma mensagem</h2>
            <p className="text-sm text-slate-500 mb-6">
              Resposta em até 24h úteis. Direcionamos automaticamente pra área certa.
            </p>
            <ContatoForm userEmail={user?.email || undefined} userName={user?.name || undefined} />
          </div>
        </div>

        {/* Sidebar — direct emails */}
        <aside className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Ou escreva direto
          </h2>

          <ContactCard
            icon={<MessageSquare className="h-4 w-4" />}
            title="Suporte"
            email="contato@juridicoonline.com.br"
            note="Dúvidas gerais · 24h úteis"
          />
          <ContactCard
            icon={<Mail className="h-4 w-4" />}
            title="Comercial / API"
            email="vendas@juridicoonline.com.br"
            note="Planos enterprise"
          />
          <ContactCard
            icon={<Shield className="h-4 w-4" />}
            title="Privacidade / LGPD"
            email="dpo@juridicoonline.com.br"
            note="Remoção, opt-out, direitos"
          />
          <ContactCard
            icon={<Newspaper className="h-4 w-4" />}
            title="Imprensa"
            email="imprensa@juridicoonline.com.br"
            note="Pautas e reportagens"
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-4">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Jurídico Online</strong>
                Operação 100% remota · Brasil
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Veja também:{" "}
            <Link href="/privacidade" className="text-[#0F4C81] hover:underline">Privacidade</Link>,{" "}
            <Link href="/termos" className="text-[#0F4C81] hover:underline">Termos</Link>,{" "}
            <Link href="/lgpd" className="text-[#0F4C81] hover:underline">LGPD</Link>.
          </p>
        </aside>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  email,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  email: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#0F4C81] transition group">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 shrink-0">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <a
            href={`mailto:${email}`}
            className="text-xs text-[#0F4C81] hover:underline break-all"
          >
            {email}
          </a>
          <div className="text-[11px] text-slate-500 mt-0.5">{note}</div>
        </div>
      </div>
    </div>
  );
}
