import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como tratamos seus dados pessoais conforme a LGPD (Lei 13.709/2018). Tipos de dados coletados, finalidades, retenção, direitos do titular e contato com DPO.",
  alternates: { canonical: "/privacidade" },
};

const UPDATED = "20 de maio de 2026";

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      subtitle="Como tratamos seus dados pessoais em conformidade com a LGPD (Lei nº 13.709/2018)."
      updatedAt={UPDATED}
    >
      <p>
        Esta Política de Privacidade descreve <strong>como o Jurídico Online coleta,
        usa, compartilha e protege seus dados pessoais</strong> quando você usa o
        site juridicoonline.com.br e serviços associados.
      </p>
      <p>
        <em>
          Importante: dados de pessoa jurídica (CNPJ) exibidos na plataforma são
          dados públicos da Receita Federal e não estão sob a LGPD. Esta política
          trata dos dados pessoais (pessoa física) dos próprios usuários do site.
        </em>
      </p>

      <h2>1. Quem é o controlador</h2>
      <p>
        O controlador dos dados pessoais coletados via Jurídico Online é a operação
        que mantém este serviço, doravante referida como &quot;Jurídico Online&quot;.
        Contato do DPO (Encarregado de Dados):{" "}
        <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a>.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <h3>Você nos fornece diretamente:</h3>
      <ul>
        <li><strong>E-mail</strong> (obrigatório para cadastro)</li>
        <li><strong>Nome</strong> (opcional)</li>
        <li><strong>Finalidade de uso</strong> (opcional — vendas, contábil, etc)</li>
        <li><strong>Preferência de newsletter</strong> (opt-in/opt-out)</li>
        <li><strong>Conteúdo de mensagens</strong> enviadas via /contato</li>
      </ul>

      <h3>Coletamos automaticamente:</h3>
      <ul>
        <li><strong>Endereço IP</strong> (para segurança e rate-limit)</li>
        <li><strong>User-agent</strong> (navegador/dispositivo)</li>
        <li><strong>Páginas visitadas e CNPJs consultados</strong> (para o histórico no painel)</li>
        <li><strong>Data e hora</strong> dos acessos</li>
        <li><strong>Cookies de sessão</strong> (essenciais para login)</li>
      </ul>

      <h3>Pagamentos (planos pagos):</h3>
      <p>
        Dados de cartão de crédito ou meio de pagamento <strong>nunca passam pelos
        nossos servidores</strong> — são processados diretamente pelo provedor de
        pagamento (Stripe ou Mercado Pago), que possui certificação PCI-DSS. Apenas
        recebemos confirmação de pagamento e identificador da transação.
      </p>

      <h2>3. Por que coletamos (finalidade e base legal)</h2>
      <table>
        <thead>
          <tr>
            <th>Finalidade</th>
            <th>Base legal LGPD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Criar e manter sua conta</td>
            <td>Execução de contrato (art. 7º, V)</td>
          </tr>
          <tr>
            <td>Enviar link mágico de login</td>
            <td>Execução de contrato (art. 7º, V)</td>
          </tr>
          <tr>
            <td>Mostrar histórico de consultas no painel</td>
            <td>Execução de contrato (art. 7º, V)</td>
          </tr>
          <tr>
            <td>Newsletter Radar Empresarial</td>
            <td>Consentimento (art. 7º, I) — opt-in expresso</td>
          </tr>
          <tr>
            <td>Prevenção de fraude e segurança</td>
            <td>Legítimo interesse (art. 7º, IX)</td>
          </tr>
          <tr>
            <td>Métricas agregadas e melhoria do serviço</td>
            <td>Legítimo interesse (art. 7º, IX)</td>
          </tr>
          <tr>
            <td>Cumprimento de obrigação legal/regulatória</td>
            <td>Obrigação legal (art. 7º, II)</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Com quem compartilhamos</h2>
      <p>
        <strong>Nunca vendemos seus dados pessoais.</strong> Compartilhamos apenas com
        operadores estritamente necessários para entregar o serviço, sob contrato e
        com cláusulas de proteção de dados:
      </p>
      <ul>
        <li>
          <strong>Mailgun</strong> (envio de e-mails transacionais e newsletter) —
          dados: e-mail, nome, conteúdo da mensagem. Política:{" "}
          <a href="https://www.mailgun.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
            mailgun.com/legal/privacy
          </a>
        </li>
        <li>
          <strong>Cloudflare</strong> (CDN, proteção DDoS, DNS) — dados: IP, user-agent,
          requisições.{" "}
          <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
            cloudflare.com/privacypolicy
          </a>
        </li>
        <li>
          <strong>Google Analytics 4</strong> (métricas anônimas agregadas, IP
          mascarado). Você pode optar por sair via{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            extensão de opt-out
          </a>
          .
        </li>
        <li>
          <strong>Stripe / Mercado Pago</strong> (apenas em planos pagos, processamento de pagamento).
        </li>
      </ul>
      <p>
        Em caso de obrigação legal (intimação judicial, requisição de autoridade
        competente), podemos compartilhar dados conforme a Lei.
      </p>

      <h2>5. Por quanto tempo armazenamos (retenção)</h2>
      <ul>
        <li><strong>Conta ativa</strong>: durante toda a vigência da conta;</li>
        <li>
          <strong>Histórico de consultas</strong>: 12 meses (depois é agregado
          anonimamente para métricas e o registro individual é apagado);
        </li>
        <li><strong>Logs de IP/segurança</strong>: 6 meses, conforme o Marco Civil da Internet;</li>
        <li>
          <strong>Após exclusão de conta</strong>: dados são anonimizados em até 7 dias;
          backups podem reter por até 90 dias adicionais antes da purga completa;
        </li>
        <li>
          <strong>Dados de pagamento / faturamento</strong>: 5 anos (obrigação fiscal
          tributária do Brasil).
        </li>
      </ul>

      <h2>6. Seus direitos LGPD</h2>
      <p>
        Você tem direito a (LGPD art. 18):
      </p>
      <ol>
        <li>Confirmação da existência de tratamento;</li>
        <li>Acesso aos dados;</li>
        <li>Correção de dados incompletos ou desatualizados;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Portabilidade dos dados (exportação em JSON);</li>
        <li>Eliminação dos dados tratados com consentimento;</li>
        <li>Informação sobre compartilhamentos;</li>
        <li>Revogação do consentimento;</li>
        <li>Oposição a tratamento baseado em legítimo interesse.</li>
      </ol>
      <p>
        Como exercer: acesse <Link href="/perfil">/perfil</Link> (export JSON, deleção
        de conta self-service) ou escreva para{" "}
        <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a>.
        Respondemos em até 15 dias úteis. Veja também a página{" "}
        <Link href="/lgpd">/lgpd</Link>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Usamos os cookies estritamente necessários para o funcionamento:
      </p>
      <ul>
        <li>
          <code>authjs.session-token</code>: cookie de sessão (HTTP-only, Secure,
          SameSite=Lax) — sem ele, login impossível;
        </li>
        <li>
          Cookies de preferência de UI (tema, dismissals de banners) —
          armazenados localmente.
        </li>
      </ul>
      <p>
        Cookies analíticos (GA4) podem ser desativados via configuração do
        navegador ou extensão de opt-out do Google.
      </p>

      <h2>8. Segurança</h2>
      <p>
        Aplicamos medidas técnicas e organizacionais razoáveis:
      </p>
      <ul>
        <li>Conexões TLS 1.3 obrigatórias (HTTPS-only);</li>
        <li>Senhas/tokens com hash criptográfico (bcrypt / SHA-256);</li>
        <li>Cookies HTTP-only com flag Secure;</li>
        <li>Backups diários criptografados;</li>
        <li>Logs de acesso monitorados.</li>
      </ul>
      <p>
        Apesar das medidas, nenhum sistema é 100% imune. Em caso de incidente de
        segurança que possa gerar risco relevante aos titulares, notificaremos a
        ANPD e os titulares afetados conforme o art. 48 da LGPD.
      </p>

      <h2>9. Transferência internacional de dados</h2>
      <p>
        Alguns operadores (ex: Cloudflare, Mailgun) estão localizados nos Estados
        Unidos. As transferências ocorrem com bases legais adequadas (cláusulas
        contratuais padrão) e cumprem o art. 33 da LGPD.
      </p>

      <h2>10. Crianças e adolescentes</h2>
      <p>
        O Serviço não é destinado a menores de 18 anos. Não coletamos
        intencionalmente dados de crianças e adolescentes. Caso identifiquemos
        coleta inadvertida, removeremos os dados imediatamente.
      </p>

      <h2>11. Alterações nesta política</h2>
      <p>
        Esta política pode ser atualizada. A data da última versão fica registrada
        no topo. Alterações relevantes são comunicadas por e-mail.
      </p>

      <h2>12. Contato</h2>
      <p>
        DPO (Encarregado): <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a>
        <br />
        Suporte geral: <a href="mailto:contato@juridicoonline.com.br">contato@juridicoonline.com.br</a>
        <br />
        Autoridade Nacional de Proteção de Dados (ANPD):{" "}
        <a href="https://www.gov.br/anpd/" target="_blank" rel="noopener noreferrer">
          gov.br/anpd
        </a>
      </p>
    </LegalPage>
  );
}
