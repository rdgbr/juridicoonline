import Link from "next/link";
import { Logo } from "./Logo";
import { UFS } from "@/lib/meili";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mt-3 text-sm text-slate-600 max-w-sm">
              Consulta gratuita de empresas, sócios e contatos. Mais de 65 milhões de empresas
              brasileiras com dados oficiais da Receita Federal, atualizados diariamente.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Os dados disponibilizados são públicos. Tratamento conforme LGPD.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Produto</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/planos" className="hover:text-[#0F4C81]">Planos</Link></li>
              <li><Link href="/api" className="hover:text-[#0F4C81]">API</Link></li>
              <li><Link href="/empresas" className="hover:text-[#0F4C81]">Estados</Link></li>
              <li><Link href="/socios" className="hover:text-[#0F4C81]">Sócios</Link></li>
              <li><Link href="/cnae" className="hover:text-[#0F4C81]">CNAEs</Link></li>
              <li><Link href="/abertas-hoje" className="hover:text-[#0F4C81]">Abertas hoje</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Empresa</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/sobre" className="hover:text-[#0F4C81]">Sobre</Link></li>
              <li><Link href="/contato" className="hover:text-[#0F4C81]">Contato</Link></li>
              <li><Link href="/blog" className="hover:text-[#0F4C81]">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/privacidade" className="hover:text-[#0F4C81]">Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-[#0F4C81]">Termos de Uso</Link></li>
              <li><Link href="/lgpd" className="hover:text-[#0F4C81]">LGPD</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
            Rede Jurídico
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://licitascanner.com.br"
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-[#0F4C81]/40 hover:bg-[#0F4C81]/5 transition group"
            >
              <span className="size-8 rounded-md bg-[#10B981]/10 text-[#10B981] inline-flex items-center justify-center flex-shrink-0 text-sm font-bold">LS</span>
              <div>
                <div className="text-sm font-medium text-slate-800 group-hover:text-[#0F4C81]">LicitaScanner</div>
                <div className="text-xs text-slate-500 mt-0.5">Monitore licitações públicas do Brasil (PNCP) — alertas por palavra-chave, CNAE ou cidade.</div>
              </div>
            </a>
            <a
              href="https://juridicoempauta.com.br"
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-[#0F4C81]/40 hover:bg-[#0F4C81]/5 transition group"
            >
              <span className="size-8 rounded-md bg-[#0F4C81]/10 text-[#0F4C81] inline-flex items-center justify-center flex-shrink-0 text-sm font-bold">JP</span>
              <div>
                <div className="text-sm font-medium text-slate-800 group-hover:text-[#0F4C81]">Jurídico em Pauta</div>
                <div className="text-xs text-slate-500 mt-0.5">Diários oficiais municipais e estaduais — atos de nomeação, exoneração, concursos e portarias.</div>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Empresas por estado
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {UFS.map((u) => (
              <Link
                key={u.sigla}
                href={`/empresas/${u.sigla.toLowerCase()}`}
                className="hover:text-[#0F4C81] transition"
              >
                {u.nome}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Jurídico Online — Todos os direitos reservados</span>
          <span>Dados oficiais da Receita Federal • Atualização diária</span>
        </div>
      </div>
    </footer>
  );
}
