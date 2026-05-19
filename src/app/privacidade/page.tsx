import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Política de Privacidade do Jurídico Online — tratamento de dados conforme LGPD.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Política de Privacidade</h1>
      <p className="text-sm text-slate-500 mt-2">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed text-[15px]">
        <h2 className="text-xl font-semibold mt-8">1. Quem somos</h2>
        <p>
          Jurídico Online é uma plataforma de consulta de empresas que disponibiliza dados públicos
          do CNPJ (Cadastro Nacional de Pessoas Jurídicas) registrados na Receita Federal do Brasil.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Quais dados coletamos</h2>
        <p>Quando você usa o site, podemos coletar:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dados de cadastro: nome, e-mail e finalidade de uso (informados por você).</li>
          <li>Dados técnicos: IP, navegador, sistema operacional, páginas visitadas.</li>
          <li>Cookies de sessão para autenticação e cookies de medição (Google Analytics).</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">3. Dados de empresas (CNPJ)</h2>
        <p>
          Os dados de empresas que mostramos (razão social, CNPJ, endereço, telefones, e-mail
          corporativo, sócios) são <strong>dados públicos</strong> registrados pelas próprias
          empresas no CNPJ da Receita Federal, conforme a Lei nº 6.404/76 e regulamentações da
          Receita Federal.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Como usamos seus dados</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Permitir o acesso à plataforma e funcionalidades cadastradas;</li>
          <li>Enviar a newsletter Radar Empresarial (se você optou);</li>
          <li>Melhorar o produto através de métricas agregadas e anonimizadas;</li>
          <li>Cumprir obrigações legais.</li>
        </ul>
        <p>
          <strong>Nunca vendemos seus dados pessoais a terceiros.</strong> Podemos compartilhar
          dados anônimos e agregados com parceiros de marketing.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Seus direitos (LGPD)</h2>
        <p>Como titular dos dados, você tem direito a:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Confirmar a existência de tratamento dos seus dados;</li>
          <li>Acessar, corrigir ou solicitar a exclusão dos seus dados;</li>
          <li>Revogar consentimentos a qualquer momento;</li>
          <li>Solicitar a portabilidade dos seus dados;</li>
          <li>Solicitar a remoção da exibição de dados públicos do seu CNPJ na plataforma.</li>
        </ul>
        <p>
          Para exercer qualquer direito, envie e-mail para <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] underline">dpo@juridicoonline.com.br</a>.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Cookies</h2>
        <p>
          Usamos cookies essenciais (sessão de login) e cookies de análise (Google Analytics) para
          melhorar a experiência. Você pode bloquear cookies nas configurações do seu navegador.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados contra
          acesso não autorizado, alteração ou destruição.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Alterações</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Avisaremos sobre mudanças relevantes
          por e-mail ou banner no site.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Contato</h2>
        <p>
          Encarregado pelo Tratamento de Dados (DPO):{" "}
          <a href="mailto:dpo@juridicoonline.com.br" className="text-[#0F4C81] underline">
            dpo@juridicoonline.com.br
          </a>
        </p>
      </div>
    </article>
  );
}
