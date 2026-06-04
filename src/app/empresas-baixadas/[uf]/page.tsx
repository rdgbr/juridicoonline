import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UFS, ufNome, listFilteredByUF } from "@/lib/meili";
import { UfListView, type UfListConfig } from "@/components/UfListView";

export const revalidate = 86400;

const config: UfListConfig = {
  routePrefix: "/empresas-baixadas",
  // CTR-friendly: foca em intent informacional ("o que aconteceu") sem caça-clique
  h1: (uf) => uf ? `Empresas baixadas em ${uf}` : "Empresas baixadas no Brasil",
  metaDescription: (uf) =>
    `Lista de empresas baixadas (situação cadastral BAIXADA) em ${uf}. Consulte CNPJ, razão social, sócios, data de baixa e CNAE. Dados oficiais Receita Federal.`,
  emptyMessage: "Nenhuma empresa baixada encontrada.",
  showCapital: true,
};

export async function generateStaticParams() {
  return UFS.map((u) => ({ uf: u.sigla.toLowerCase() }));
}

type Props = { params: Promise<{ uf: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) return { title: "Não encontrado" };
  const ufName = ufNome(sigla);
  return {
    title: config.h1(ufName),
    description: config.metaDescription(ufName).slice(0, 160),
    alternates: { canonical: `/empresas-baixadas/${uf.toLowerCase()}` },
    keywords: [
      `empresas baixadas ${ufName}`,
      `CNPJ baixado ${ufName}`,
      "situação cadastral",
      "empresa fechada",
      "CNPJ inativo",
      "Receita Federal",
    ],
  };
}

export default async function BaixadasPage({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();
  const empresas = await listFilteredByUF(sigla, "baixada", 100);
  return <UfListView uf={sigla} ufName={ufNome(sigla)} empresas={empresas} config={config} />;
}
