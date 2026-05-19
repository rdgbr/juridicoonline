import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UFS, ufNome, listFilteredByUF } from "@/lib/meili";
import { UfListView, type UfListConfig } from "@/components/UfListView";

export const revalidate = 86400;

const config: UfListConfig = {
  routePrefix: "/empresas-mei",
  h1: (uf) => uf ? `MEI em ${uf}` : "Microempreendedor Individual (MEI)",
  metaDescription: (uf) => `Lista de Microempreendedores Individuais (MEI) ativos em ${uf}. Consulte CNPJ, atividade econômica, sócios e endereço. Dados Receita Federal.`,
  emptyMessage: "Nenhum MEI encontrado.",
  showDataAbertura: true,
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
    alternates: { canonical: `/empresas-mei/${uf.toLowerCase()}` },
  };
}

export default async function MeiPage({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();
  const empresas = await listFilteredByUF(sigla, "mei", 100);
  return <UfListView uf={sigla} ufName={ufNome(sigla)} empresas={empresas} config={config} />;
}
