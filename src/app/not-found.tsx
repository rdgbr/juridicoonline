import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
      <div className="text-6xl font-semibold text-[#0F4C81] mb-4">404</div>
      <h1 className="text-2xl font-semibold tracking-tight">Página não encontrada</h1>
      <p className="mt-3 text-slate-600">
        Não achamos o que você procurava. Tente buscar uma empresa por CNPJ ou razão social:
      </p>
      <div className="mt-6">
        <SearchBox />
      </div>
      <div className="mt-6">
        <Link href="/" className="text-sm text-[#0F4C81] hover:underline">← Voltar à página inicial</Link>
      </div>
    </div>
  );
}
