import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UFS, ufNome, listFilteredByUF } from "@/lib/meili";
import { UfListView, type UfListConfig } from "@/components/UfListView";

export const revalidate = 86400;

const config: UfListConfig = {
  routePrefix: "/empresas-simples",
  h1: (uf) => uf ? `Empresas Simples Nacional em ${uf}` : "Empresas Simples Nacional",
  metaDescription: (uf) => `Lista de empresas optantes pelo Simples Nacional em ${uf}. CNPJ, atividade, sócios. Dados Receita Federal, atualizados hoje.`,
  emptyMessage: "Nenhuma empresa optante encontrada.",
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
    alternates: { canonical: `/empresas-simples/${uf.toLowerCase()}` },
  };
}

export default async function SimplesPage({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();
  const empresas = await listFilteredByUF(sigla, "simples", 100);
  return <UfListView uf={sigla} ufName={ufNome(sigla)} empresas={empresas} config={config} />;
}
