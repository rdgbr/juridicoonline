import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { Download, UserX, Edit, Shield, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "LGPD — Direitos do titular e remoção de dados",
  description:
    "Como exercer seus direitos LGPD no Jurídico Online: acesso, correção, exclusão, portabilidade e opt-out de listagem de sócio.",
  alternates: { canonical: "/lgpd" },
};

const UPDATED = "20 de maio de 2026";

export default function LgpdPage() {
  return (
    <LegalPage
      title="LGPD — Direitos do titular"
      subtitle="Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e como exercer seus direitos no Jurídico Online."
      updatedAt={UPDATED}
    >
      <h2>O que é a LGPD?</h2>
      <p>
        A Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) é a legislação
        brasileira que regula o tratamento de <strong>dados pessoais</strong> —
        qualquer informação relacionada a pessoa natural identificada ou
        identificável (nome, CPF, e-mail, endereço, etc).
      </p>

      <h2>Dados de empresa (PJ) × dados pessoais (PF)</h2>
      <p>
        <strong>Dados de pessoa jurídica</strong> (CNPJ, razão social, endereço da
        empresa, telefone corporativo, capital social, CNAE) <strong>não</strong>{" "}
        estão sob a LGPD. São públicos por força da legislação tributária e podem
        ser livremente consultados e citados.
      </p>
      <p>
        <strong>Dados pessoais de sócios</strong> são protegidos pela LGPD:
      </p>
      <ul>
        <li>
          <strong>Nome do sócio</strong> aparece publicamente (informação pública via
          Receita Federal);
        </li>
        <li>
          <strong>CPF é mascarado</strong> (exibimos apenas <code>***.123.456-**</code>);
        </li>
        <li>
          <strong>Endereço residencial não aparece</strong> (mostramos apenas o
          endereço da empresa);
        </li>
        <li>
          Cruzamento de empresas onde um sócio aparece é informação útil para
          transparência (Compliance, anti-fraude), mas opt-out está disponível para
          quem se sentir exposto.
        </li>
      </ul>

      <h2>Seus direitos (LGPD Art. 18)</h2>
      <div className="grid sm:grid-cols-2 gap-3 not-prose my-6">
        <DireitoCard icon={<Edit />} title="Confirmação e acesso">
          Saber se tratamos seus dados e ter cópia deles.
        </DireitoCard>
        <DireitoCard icon={<Edit />} title="Correção">
          Atualizar dados incompletos, inexatos ou desatualizados.
        </DireitoCard>
        <DireitoCard icon={<Shield />} title="Anonimização/bloqueio">
          Remover identificação ou bloquear uso de dados desnecessários ou
          excessivos.
        </DireitoCard>
        <DireitoCard icon={<UserX />} title="Eliminação">
          Excluir dados tratados com base em consentimento.
        </DireitoCard>
        <DireitoCard icon={<Download />} title="Portabilidade">
          Receber seus dados em formato estruturado (JSON) para levar a outro
          serviço.
        </DireitoCard>
        <DireitoCard icon={<Mail />} title="Compartilhamentos">
          Saber com quem compartilhamos seus dados.
        </DireitoCard>
      </div>

      <h2>Como exercer cada direito</h2>

      <h3>Acessar e exportar seus dados</h3>
      <p>
        Logado no painel <Link href="/perfil">/perfil</Link>, clique em{" "}
        <strong>&quot;Exportar meus dados&quot;</strong> para baixar um JSON com
        tudo o que mantemos sobre você (perfil, histórico de consultas, leads,
        chaves de API, sessões).
      </p>

      <h3>Corrigir dados</h3>
      <p>
        Edite nome, finalidade de uso e preferência de newsletter direto em{" "}
        <Link href="/perfil">/perfil</Link>. Para alterar o e-mail, exclua a conta e
        crie uma nova (não permitimos troca de e-mail por questões de segurança).
      </p>

      <h3>Excluir conta</h3>
      <p>
        Logado, vá em <Link href="/perfil">/perfil</Link> e role até{" "}
        <strong>&quot;Zona de perigo&quot;</strong>. Digite seu e-mail para confirmar.
        Todos os dados são apagados em até 7 dias (backups em até 90 dias).
      </p>

      <h3>Opt-out de newsletter</h3>
      <p>
        Todo e-mail da newsletter tem link de unsubscribe. Você também pode desativar
        em <Link href="/perfil">/perfil</Link>.
      </p>

      <h3>Remoção de listagem como sócio</h3>
      <p>
        Se você é sócio(a) de uma empresa e deseja:
      </p>
      <ul>
        <li>Reduzir a visibilidade do seu nome em buscas;</li>
        <li>Remover ou anonimizar o cruzamento de empresas onde aparece;</li>
        <li>Solicitar deindexação de páginas específicas;</li>
      </ul>
      <p>
        Envie um e-mail para{" "}
        <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a>{" "}
        anexando:
      </p>
      <ol>
        <li>Documento de identidade com foto (para confirmar identidade);</li>
        <li>URL(s) da(s) página(s) que deseja remover;</li>
        <li>Motivação (opcional, mas ajuda na análise — situação de risco, dado desatualizado, etc).</li>
      </ol>
      <p>
        <strong>Importante</strong>: nem toda solicitação é aceita. Avaliamos caso
        a caso considerando interesse público, transparência e legítimo interesse
        (LGPD art. 18, §1º). Decisões fundamentadas são enviadas em até 15 dias úteis.
      </p>

      <h2>Quando podemos negar uma solicitação</h2>
      <p>
        A LGPD permite negar solicitações em casos específicos:
      </p>
      <ul>
        <li>Cumprimento de obrigação legal (ex: conservar dados fiscais por 5 anos);</li>
        <li>Tutela da saúde, segurança pública ou interesse público;</li>
        <li>Exercício regular de direitos em processo judicial ou administrativo;</li>
        <li>Quando os dados são imprescindíveis para política pública.</li>
      </ul>
      <p>
        Em qualquer negativa, justificamos a decisão e indicamos o canal de
        contestação (ANPD).
      </p>

      <h2>Prazos e gratuidade</h2>
      <div className="not-prose rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 my-6">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-slate-700">
              <strong>Resposta em até 15 dias úteis</strong> a partir da solicitação.{" "}
              <strong>Totalmente gratuito</strong>. Sem necessidade de advogado.
            </p>
          </div>
        </div>
      </div>

      <h2>Contato com o DPO (Encarregado)</h2>
      <p>
        Nosso DPO responde a qualquer dúvida sobre privacidade e LGPD:
      </p>
      <ul>
        <li><strong>E-mail</strong>: <a href="mailto:dpo@juridicoonline.com.br">dpo@juridicoonline.com.br</a></li>
        <li><strong>Formulário</strong>: <Link href="/contato?dept=dpo">/contato</Link> (selecione &quot;Privacidade / LGPD&quot;)</li>
        <li><strong>Tempo de resposta</strong>: 15 dias úteis (LGPD art. 19, §2º)</li>
      </ul>

      <h2>Se não estiver satisfeito</h2>
      <p>
        Se considerar que não tratamos sua solicitação adequadamente, você pode
        recorrer à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>:
      </p>
      <ul>
        <li>Site: <a href="https://www.gov.br/anpd/" target="_blank" rel="noopener noreferrer">gov.br/anpd</a></li>
        <li>Petição: <a href="https://www.gov.br/anpd/pt-br/canais_atendimento/cidadao" target="_blank" rel="noopener noreferrer">canal do cidadão</a></li>
      </ul>

      <h2>Veja também</h2>
      <ul>
        <li><Link href="/privacidade">Política de Privacidade</Link> — detalhes completos do tratamento de dados</li>
        <li><Link href="/termos">Termos de Uso</Link> — regras gerais do serviço</li>
        <li><Link href="/sobre">Sobre o Jurídico Online</Link> — quem somos e o que fazemos</li>
      </ul>
    </LegalPage>
  );
}

function DireitoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[#0F4C81] mb-2">{icon}</div>
      <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}
