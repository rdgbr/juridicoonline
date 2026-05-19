import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LGPD — Direitos do titular",
  description: "Como exercer seus direitos LGPD no Jurídico Online: acesso, correção, exclusão, portabilidade e remoção de dados.",
  alternates: { canonical: "/lgpd" },
};

export default function LgpdPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">LGPD — Direitos do titular</h1>
      <p className="mt-3 text-slate-600">
        Esta página explica como exercer seus direitos previstos na Lei Geral de Proteção de Dados
        (Lei 13.709/2018) no Jurídico Online.
      </p>

      <div className="mt-10 space-y-6">
        <Section title="Solicitar remoção dos dados do meu CNPJ">
          <p>
            Se você é titular ou representante legal de uma empresa e deseja que os dados dela
            não sejam mais exibidos no Jurídico Online, envie:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>CNPJ da empresa</li>
            <li>Nome e CPF do solicitante</li>
            <li>Comprovação de vínculo (procuração, contrato social ou e-mail oficial)</li>
            <li>Motivo da solicitação</li>
          </ul>
          <p className="mt-2">
            Para:{" "}
            <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] underline">
              dpo@juridicoonline.com.br
            </a>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Importante: dados públicos da Receita Federal podem permanecer indexados em outros
            sites. Não temos controle sobre cache de buscadores.
          </p>
        </Section>

        <Section title="Acessar, corrigir ou excluir minha conta">
          <p>
            Como usuário cadastrado no Jurídico Online, você pode:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Acessar seus dados pessoais armazenados</li>
            <li>Corrigir informações desatualizadas</li>
            <li>Solicitar exclusão completa da conta</li>
            <li>Cancelar inscrição em newsletters</li>
          </ul>
          <p className="mt-2">
            Envie pedido para{" "}
            <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] underline">
              dpo@juridicoonline.com.br
            </a>{" "}
            do mesmo e-mail cadastrado. Resposta em até 15 dias.
          </p>
        </Section>

        <Section title="Encarregado pelo Tratamento de Dados (DPO)">
          <p>
            Nosso DPO é responsável por receber, registrar e responder a solicitações de
            titulares e pela comunicação com a ANPD (Autoridade Nacional de Proteção de Dados).
          </p>
          <p className="mt-2">
            Contato:{" "}
            <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] underline">
              dpo@juridicoonline.com.br
            </a>
          </p>
        </Section>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Veja também a{" "}
        <Link href="/privacidade" className="text-[#0F4C81] hover:underline">Política de Privacidade</Link>{" "}
        e os{" "}
        <Link href="/termos" className="text-[#0F4C81] hover:underline">Termos de Uso</Link>.
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 text-slate-700 leading-relaxed text-[15px]">{children}</div>
    </div>
  );
}
