import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com a equipe do Jurídico Online.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-semibold tracking-tight">Contato</h1>
      <p className="mt-3 text-slate-600">
        Estamos disponíveis para dúvidas, parcerias, imprensa e solicitações LGPD.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Card icon={<MessageSquare />} title="Suporte">
          <a href="mailto:contato@juridicoonline.com.br" className="text-[#0F4C81] hover:underline">
            contato@juridicoonline.com.br
          </a>
          <p className="text-xs text-slate-500 mt-1">Resposta em até 24h úteis</p>
        </Card>

        <Card icon={<Mail />} title="Comercial / API">
          <a href="mailto:vendas@juridicoonline.com.br" className="text-[#0F4C81] hover:underline">
            vendas@juridicoonline.com.br
          </a>
          <p className="text-xs text-slate-500 mt-1">Planos enterprise e integrações</p>
        </Card>

        <Card icon={<Shield />} title="Privacidade / LGPD">
          <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] hover:underline">
            dpo@juridicoonline.com.br
          </a>
          <p className="text-xs text-slate-500 mt-1">Solicitações de remoção, opt-out e direitos</p>
        </Card>

        <Card icon={<MessageSquare />} title="Imprensa">
          <a href="mailto:imprensa@juridicoonline.com.br" className="text-[#0F4C81] hover:underline">
            imprensa@juridicoonline.com.br
          </a>
          <p className="text-xs text-slate-500 mt-1">Pautas e dados para reportagens</p>
        </Card>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Veja também:{" "}
        <Link href="/privacidade" className="text-[#0F4C81] hover:underline">Privacidade</Link>,{" "}
        <Link href="/termos" className="text-[#0F4C81] hover:underline">Termos de Uso</Link>,{" "}
        <Link href="/lgpd" className="text-[#0F4C81] hover:underline">LGPD</Link>.
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="rounded-lg bg-[#0F4C81]/8 text-[#0F4C81] p-2 w-fit mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 text-sm">{children}</div>
    </div>
  );
}
