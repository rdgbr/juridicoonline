/**
 * /empresas-abertas/[uf] — redirects to current month: /empresas-abertas/[uf]/YYYY-MM
 */
import { redirect } from "next/navigation";
import { UFS } from "@/lib/meili";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ uf: string }> };

export default async function EmpresasAbertasUfRedirect({ params }: Props) {
  const { uf } = await params;
  const sigla = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === sigla)) notFound();

  // Current month (1 month back since RFB data lags ~30 days)
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const periodo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  redirect(`/empresas-abertas/${uf.toLowerCase()}/${periodo}`);
}
