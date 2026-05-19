import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UFS, ufNome, listFilteredByUF } from "@/lib/meili";
import { UfListView, type UfListConfig } from "@/components/UfListView";

export const revalidate = 86400;

const config: UfListConfig = {
  routePrefix: "/maiores-empresas",
  h1: (uf) => uf ? `Maiores empresas de ${uf}` : "Maiores empresas",
  metaDescription: (uf) => `Ranking das maiores empresas de ${uf} por capital social. CNPJ, endereço, sócios, situação cadastral. Dados Receita Federal atualizados hoje.`,
  emptyMessage: "Nenhuma empresa encontrada.",
  showCapital: true,
};

type Props = { params: Promise<{ uf: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) return { title: "Não encontrado" };
  const ufName = ufNome(sigla);
  return {
    title: config.h1(ufName),
    description: config.metaDescription(ufName).slice(0, 160),
    alternates: { canonical: `/maiores-empresas/${uf.toLowerCase()}` },
  };
}

export default async function MaioresEmpresasPage({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();
  const empresas = await listFilteredByUF(sigla, "maiores", 100);
  return <UfListView uf={sigla} ufName={ufNome(sigla)} empresas={empresas} config={config} />;
}
