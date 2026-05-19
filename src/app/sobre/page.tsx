import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre o Jurídico Online",
  description:
    "Plataforma de consulta de empresas brasileiras. 65 milhões de CNPJs, dados oficiais da Receita Federal, atualizados diariamente.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-slate">
      <h1 className="text-4xl font-semibold tracking-tight">Sobre o Jurídico Online</h1>

      <p className="text-lg text-slate-600 mt-4">
        Somos uma plataforma de consulta gratuita de empresas brasileiras. Indexamos mais de
        <strong> 65 milhões de CNPJs</strong> com dados oficiais da Receita Federal, cruzados com
        bases de sócios, CNAEs, juntas comerciais e dados públicos da PGFN.
      </p>

      <h2 className="text-2xl font-semibold mt-10">Nossa missão</h2>
      <p className="text-slate-600">
        Democratizar o acesso a informações públicas sobre empresas brasileiras. Vendedores,
        contadores, recrutadores, jornalistas, advogados e times de cobrança precisam de dados
        confiáveis sobre empresas todos os dias — e não deveriam pagar fortunas ou esperar APIs
        burocráticas para isso.
      </p>

      <h2 className="text-2xl font-semibold mt-10">De onde vêm os dados</h2>
      <ul className="text-slate-600 space-y-1.5">
        <li><strong>Receita Federal</strong> — Cadastro Nacional de Pessoas Jurídicas (CNPJ), atualizado diariamente</li>
        <li><strong>QSA</strong> — Quadro de Sócios e Administradores, oficial</li>
        <li><strong>CNAE</strong> — Classificação Nacional de Atividades Econômicas, IBGE</li>
        <li><strong>Junta Comercial</strong> — Registro de empresas abertas (SP, SC, demais em expansão)</li>
        <li><strong>Bases públicas</strong> — Endereços, contatos e dados cadastrais públicos</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10">Compromisso com a LGPD</h2>
      <p className="text-slate-600">
        Todos os dados que disponibilizamos são <strong>públicos por natureza</strong>, registrados
        pelas próprias empresas no CNPJ da Receita Federal. Mesmo assim, levamos a LGPD a sério:
        oferecemos opt-out completo, deletamos dados quando solicitado e nunca vendemos
        informações pessoais.
      </p>
      <p className="text-slate-600">
        Para mais detalhes, leia nossa <Link href="/privacidade" className="text-[#0F4C81]">Política de Privacidade</Link> e os <Link href="/termos" className="text-[#0F4C81]">Termos de Uso</Link>.
      </p>

      <h2 className="text-2xl font-semibold mt-10">Modelo de negócio</h2>
      <p className="text-slate-600">
        Somos sustentáveis através de:
      </p>
      <ul className="text-slate-600 space-y-1.5">
        <li>Publicidade discreta (Google Adsense) em páginas públicas</li>
        <li>Planos pagos para usuários com alto volume (export, API, alertas)</li>
        <li>API REST para integração em SaaS, fintechs e sistemas internos</li>
      </ul>
      <p className="text-slate-600">
        O cadastro grátis é, e sempre será, gratuito.
      </p>

      <h2 className="text-2xl font-semibold mt-10">Contato</h2>
      <p className="text-slate-600">
        Dúvidas, parcerias, imprensa ou solicitações LGPD: <Link href="/contato" className="text-[#0F4C81]">página de contato</Link>.
      </p>
    </article>
  );
}
