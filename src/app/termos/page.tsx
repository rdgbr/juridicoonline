import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso do Jurídico Online — regras de acesso, conta, dados e cancelamento.",
  alternates: { canonical: "/termos" },
};

const UPDATED = "20 de maio de 2026";

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      subtitle="Regras para uso do Jurídico Online. Ao se cadastrar ou usar a plataforma você concorda integralmente com este documento."
      updatedAt={UPDATED}
    >
      <h2>1. Aceitação</h2>
      <p>
        Estes Termos de Uso (&quot;Termos&quot;) regulam o relacionamento entre você
        (&quot;Usuário&quot;) e <strong>Jurídico Online</strong>, operado por seus
        responsáveis técnicos, ao acessar e usar o site juridicoonline.com.br e
        serviços associados (&quot;Serviço&quot;). Ao se cadastrar, navegar ou
        contratar qualquer plano, você declara ter lido, compreendido e aceito
        integralmente estes Termos.
      </p>

      <h2>2. Objeto do serviço</h2>
      <p>
        O Jurídico Online é uma plataforma de consulta e análise de dados públicos
        de pessoas jurídicas brasileiras, derivados primariamente do Cadastro Nacional
        da Pessoa Jurídica (CNPJ) mantido pela Receita Federal do Brasil. Oferecemos:
      </p>
      <ul>
        <li>Busca por CNPJ, razão social, nome de sócio ou endereço;</li>
        <li>Páginas individuais de empresa, sócio, CNAE e localidade;</li>
        <li>Listagens agregadas (por estado, município, regime tributário);</li>
        <li>Exportação de dados (CSV) em planos pagos;</li>
        <li>API REST autenticada em planos pagos;</li>
        <li>Alertas e relatórios em planos pagos.</li>
      </ul>

      <h2>3. Cadastro e conta</h2>
      <p>
        O cadastro é gratuito e exige apenas um e-mail válido. Você é responsável por:
      </p>
      <ul>
        <li>Manter seus dados de cadastro atualizados;</li>
        <li>Manter a confidencialidade do seu acesso (link mágico ou senha de provedor OAuth);</li>
        <li>Notificar imediatamente em caso de uso não autorizado da sua conta.</li>
      </ul>
      <p>
        Reservamos o direito de recusar, suspender ou encerrar contas que violem
        estes Termos, em especial por uso abusivo automatizado (scraping em massa
        fora dos limites do plano), tentativas de fraude ou descumprimento de
        legislação aplicável.
      </p>

      <h2>4. Uso permitido</h2>
      <p>Você pode usar o Serviço para:</p>
      <ul>
        <li>Consultar empresas para fins pessoais, profissionais, acadêmicos ou jornalísticos;</li>
        <li>Prospectar clientes B2B, observando a LGPD e regras de marketing;</li>
        <li>Realizar due diligence, análise de crédito, recrutamento e seleção;</li>
        <li>Integrar a API em sistemas próprios dentro dos limites do plano contratado.</li>
      </ul>

      <h2>5. Uso proibido</h2>
      <p>É <strong>expressamente proibido</strong>:</p>
      <ul>
        <li>Coletar dados em massa via scraping automatizado fora dos limites do plano contratado;</li>
        <li>Burlar limites de consultas, créditos ou rate limits da API;</li>
        <li>Revender, redistribuir ou licenciar nossos dados sem autorização expressa;</li>
        <li>Usar dados obtidos para spam, phishing, fraude ou qualquer prática ilegal;</li>
        <li>Tentar acessar, modificar ou interferir em sistemas, contas ou dados de outros usuários;</li>
        <li>Usar engenharia reversa, descompilar ou tentar derivar nosso código-fonte.</li>
      </ul>

      <h2>6. Natureza dos dados</h2>
      <p>
        Os dados exibidos derivam de fontes públicas oficiais (Receita Federal,
        Junta Comercial). Apesar do nosso esforço em manter a base atualizada e
        precisa, <strong>não garantimos</strong> a inexistência de erros, omissões
        ou desatualizações pontuais. Decisões críticas (jurídicas, financeiras,
        contratuais) devem ser baseadas em consulta direta à fonte oficial. O
        Jurídico Online não se responsabiliza por danos decorrentes do uso de
        informações desatualizadas ou imprecisas obtidas pela plataforma.
      </p>

      <h2>7. Planos e pagamentos</h2>
      <p>
        Os planos pagos são descritos em{" "}
        <Link href="/planos">/planos</Link>. As condições gerais:
      </p>
      <ul>
        <li>Cobrança recorrente mensal ou anual conforme escolhido no checkout;</li>
        <li>Cancele a qualquer momento direto no painel <Link href="/perfil">/perfil</Link>, sem multa;</li>
        <li>O acesso continua até o fim do período pago após o cancelamento;</li>
        <li>Não há reembolso proporcional após uso do período;</li>
        <li>Em caso de inadimplência, a conta é rebaixada ao plano Grátis após 7 dias;</li>
        <li>Mudanças de preço serão comunicadas com 30 dias de antecedência.</li>
      </ul>

      <h2>8. Propriedade intelectual</h2>
      <p>
        Os dados públicos pertencem ao domínio público (CNPJ, RFB). Os elementos
        agregados, exibidos e processados pela plataforma (interface, código,
        organização, marca, design, cruzamentos derivados) são de titularidade do
        Jurídico Online ou licenciados sob termos próprios.
      </p>
      <p>
        Marca, logotipo e identidade visual são protegidos. Reprodução não
        autorizada é proibida.
      </p>

      <h2>9. Limitação de responsabilidade</h2>
      <p>
        Na máxima extensão permitida pela legislação aplicável, o Jurídico Online
        não responde por danos indiretos, lucros cessantes, perda de dados ou
        prejuízos decorrentes da indisponibilidade, atraso, erro ou uso indevido
        do Serviço. Nossa responsabilidade total fica limitada ao valor pago pelo
        Usuário nos últimos 12 meses.
      </p>

      <h2>10. Suspensão e encerramento</h2>
      <p>
        Podemos suspender ou encerrar contas (com ou sem aviso prévio) em casos
        de violação destes Termos, atividade fraudulenta ou determinação legal.
        Você pode encerrar sua conta a qualquer momento na página{" "}
        <Link href="/perfil">/perfil</Link>.
      </p>

      <h2>11. Alterações nos Termos</h2>
      <p>
        Podemos atualizar estes Termos periodicamente. A versão vigente é sempre a
        publicada nesta página, com data de última atualização indicada acima.
        Alterações relevantes serão comunicadas por e-mail ou aviso no painel.
        O uso continuado do Serviço após atualização implica aceitação.
      </p>

      <h2>12. Legislação e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil,
        em especial Código Civil, Marco Civil da Internet (Lei nº 12.965/2014),
        LGPD (Lei nº 13.709/2018) e Código de Defesa do Consumidor (quando
        aplicável). Fica eleito o foro da comarca de domicílio do consumidor para
        dirimir eventuais controvérsias.
      </p>

      <h2>13. Contato</h2>
      <p>
        Dúvidas sobre estes Termos:{" "}
        <a href="mailto:contato@juridicoonline.com.br">contato@juridicoonline.com.br</a>
        . Para questões de privacidade ou LGPD:{" "}
        <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a>.
      </p>
    </LegalPage>
  );
}
