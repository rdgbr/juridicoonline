import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do Jurídico Online.",
  alternates: { canonical: "/termos" },
};

export default function TermosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Termos de Uso</h1>
      <p className="text-sm text-slate-500 mt-2">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed text-[15px]">
        <h2 className="text-xl font-semibold mt-8">1. Aceitação</h2>
        <p>
          Ao usar o Jurídico Online, você concorda com estes Termos de Uso e com a Política de
          Privacidade. Se não concordar, não use a plataforma.
        </p>

        <h2 className="text-xl font-semibold mt-8">2. Descrição do serviço</h2>
        <p>
          O Jurídico Online é uma plataforma de consulta de informações públicas sobre empresas
          brasileiras, baseada em dados oficiais da Receita Federal e bases públicas.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Cadastro</h2>
        <p>
          Para acessar funcionalidades estendidas, é necessário cadastro com e-mail válido. Você é
          responsável pela veracidade das informações fornecidas e pela segurança da sua conta.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Uso permitido</h2>
        <p>Você pode usar a plataforma para:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Consultar dados de empresas para fins comerciais legítimos;</li>
          <li>Realizar prospecção, análise de crédito, due diligence;</li>
          <li>Pesquisas jornalísticas, acadêmicas ou jurídicas.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">5. Uso proibido</h2>
        <p>É proibido:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Realizar scraping massivo do site sem autorização (use a API);</li>
          <li>Usar os dados para spam, fraude, assédio ou prática ilegal;</li>
          <li>Vender ou redistribuir os dados como base própria;</li>
          <li>Tentar burlar limites de consulta dos planos gratuitos;</li>
          <li>Utilizar para discriminar pessoas ou empresas em violação à legislação.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">6. Limitação de responsabilidade</h2>
        <p>
          Os dados são fornecidos "como estão", baseados em fontes públicas. Não garantimos
          exatidão, completude ou disponibilidade ininterrupta. Você é responsável pelo uso que
          faz dos dados consultados.
        </p>

        <h2 className="text-xl font-semibold mt-8">7. Propriedade intelectual</h2>
        <p>
          A interface, código, design e marcas do Jurídico Online são protegidos por direitos
          autorais. Os dados de empresas são públicos e não nos pertencem.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Cancelamento</h2>
        <p>
          Você pode cancelar sua conta a qualquer momento via página de perfil ou enviando
          e-mail. Planos pagos serão reembolsados proporcionalmente, conforme regras do plano.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Foro</h2>
        <p>
          Estes termos são regidos pela legislação brasileira. Foro de eleição: comarca da sede
          do Jurídico Online.
        </p>

        <h2 className="text-xl font-semibold mt-8">10. Contato</h2>
        <p>
          Dúvidas sobre estes termos:{" "}
          <a href="mailto:contato@juridicoonline.com.br" className="text-[#0F4C81] underline">
            contato@juridicoonline.com.br
          </a>
        </p>
      </div>
    </article>
  );
}
