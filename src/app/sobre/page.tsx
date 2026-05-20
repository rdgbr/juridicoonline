import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { Building2, Users, Database, Zap, Shield, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre o Jurídico Online",
  description:
    "Plataforma brasileira de consulta gratuita de empresas, sócios e CNPJs. 65 milhões de registros oficiais da Receita Federal, atualizados diariamente.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <LegalPage
      title="Sobre o Jurídico Online"
      subtitle="A maior base aberta brasileira de consulta de CNPJs, sócios e atividade econômica."
    >
      <p>
        O <strong>Jurídico Online</strong> nasceu em 2026 com uma missão simples:
        democratizar o acesso a dados públicos de empresas brasileiras. Combinamos a
        base oficial do CNPJ da Receita Federal (atualizada diariamente) com um motor
        de busca rápido e gratuito, para que qualquer pessoa — do estudante ao
        gerente de crédito de um banco — possa consultar uma empresa em segundos.
      </p>

      <h2>Por que existimos</h2>
      <p>
        Dados de pessoa jurídica no Brasil são públicos por força da legislação
        tributária (Lei nº 5.172/1966 e Decreto nº 9.580/2018). A Receita Federal
        disponibiliza dumps abertos em{" "}
        <a href="https://arquivos.receitafederal.gov.br/dados/cnpj/" target="_blank" rel="nofollow noopener">
          arquivos.receitafederal.gov.br/dados/cnpj/
        </a>
        . Mas baixar 50+ GB de CSVs, processar em banco relacional, indexar para busca
        e manter atualizado todo dia é trabalho que poucos têm condição de fazer.
        Fazemos esse trabalho pesado e expomos via interface web simples.
      </p>

      <h2>Nossa base de dados em números</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 not-prose my-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Building2 className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">65,7M</div>
          <div className="text-xs text-slate-500">CNPJs indexados</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Users className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">25M+</div>
          <div className="text-xs text-slate-500">Sócios e administradores</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <MapPin className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">5.570</div>
          <div className="text-xs text-slate-500">Municípios cobertos</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Database className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">27</div>
          <div className="text-xs text-slate-500">Estados (UFs)</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Zap className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">Diário</div>
          <div className="text-xs text-slate-500">Frequência de atualização</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <Shield className="h-5 w-5 text-[#0F4C81] mb-2" />
          <div className="text-2xl font-bold text-slate-900">100%</div>
          <div className="text-xs text-slate-500">Conformidade LGPD</div>
        </div>
      </div>

      <h2>O que você pode fazer aqui</h2>
      <ul>
        <li>
          <strong>Consultar qualquer CNPJ</strong> — razão social, nome fantasia,
          situação cadastral, endereço, capital social, CNAE.
        </li>
        <li>
          <strong>Ver o quadro societário</strong> (QSA) completo, com nome de sócios,
          qualificação e data de entrada.
        </li>
        <li>
          <strong>Cruzar sócios</strong> — clique no nome de uma pessoa e veja todas
          as outras empresas onde ela aparece.
        </li>
        <li>
          <strong>Buscar empresas por região</strong> — listas por estado, município
          ou CNAE.
        </li>
        <li>
          <strong>Comparar 2 empresas</strong> lado a lado.
        </li>
        <li>
          <strong>Listar maiores empresas</strong> por capital social, MEIs, optantes
          do Simples Nacional.
        </li>
        <li>
          <strong>Baixar datasets</strong> abertos em CSV para análise própria.
        </li>
        <li>
          <strong>API REST</strong> (planos pagos) para integrar nosso banco em
          sistemas próprios.
        </li>
      </ul>

      <h2>Quem usa o Jurídico Online</h2>
      <ul>
        <li>
          <strong>Times de vendas B2B</strong> qualificando leads pelo CNPJ
        </li>
        <li>
          <strong>Escritórios contábeis</strong> verificando situação cadastral de
          clientes
        </li>
        <li>
          <strong>Áreas de cobrança e crédito</strong> fazendo due diligence
        </li>
        <li>
          <strong>RH e recrutamento</strong> validando empresas em vagas
        </li>
        <li>
          <strong>Advogados</strong> em pesquisa preliminar de empresas
        </li>
        <li>
          <strong>Jornalistas e pesquisadores</strong> investigando redes corporativas
        </li>
        <li>
          <strong>Desenvolvedores</strong> consumindo nossa API
        </li>
      </ul>

      <h2>Privacidade e LGPD</h2>
      <p>
        Dados de pessoa jurídica (PJ) são públicos. Dados de pessoa física (PF) — como
        o CPF completo do sócio — <strong>não</strong> são exibidos: aparecem mascarados
        (ex: <code>***.123.456-**</code>) por força da LGPD (Lei nº 13.709/2018).
      </p>
      <p>
        Se você é sócio(a) de uma empresa e quer reduzir sua visibilidade nos resultados
        de busca, veja a página{" "}
        <Link href="/lgpd">LGPD</Link> para os direitos disponíveis e canal de
        contato com nosso DPO.
      </p>

      <h2>Como nos contatar</h2>
      <ul>
        <li>
          <strong>Suporte</strong>: contato@juridicoonline.com.br
        </li>
        <li>
          <strong>Comercial / API</strong>: vendas@juridicoonline.com.br
        </li>
        <li>
          <strong>Imprensa</strong>: imprensa@juridicoonline.com.br
        </li>
        <li>
          <strong>DPO (LGPD)</strong>: dpo@juridicoonline.com.br
        </li>
      </ul>
      <p>
        Você também pode usar o{" "}
        <Link href="/contato">formulário de contato</Link> para qualquer assunto.
      </p>
    </LegalPage>
  );
}
