export function onlyDigits(s: string): string {
  return (s || "").replace(/\D/g, "");
}

export function formatCNPJ(cnpj: string): string {
  const d = onlyDigits(cnpj).padStart(14, "0");
  if (d.length !== 14) return cnpj;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const d = onlyDigits(phone);
  if (d.length === 0) return "";
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return "";
  const d = onlyDigits(cep);
  if (d.length !== 8) return cep;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null || value === 0) return "Não informado";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(yyyymmdd: string | null | undefined): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return "";
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(0, 4)}`;
}

export function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function empresaSlug(cnpj: string, razao: string): string {
  return `${onlyDigits(cnpj)}-${slugify(razao)}`;
}

export function parseEmpresaSlug(slug: string): { cnpj: string; razao: string } {
  const m = slug.match(/^(\d{14})(?:-(.+))?$/);
  if (!m) return { cnpj: onlyDigits(slug), razao: "" };
  return { cnpj: m[1], razao: m[2] || "" };
}

export function maskPhone(phone: string | null | undefined): string {
  const f = formatPhone(phone);
  if (!f) return "";
  // mask middle digits: (47) 9****-**88
  return f.replace(/\d(?=\d{2})/g, "*");
}

export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return "";
  const [u, d] = email.split("@");
  const visible = u.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(3, u.length - 2))}@${d}`;
}

export function age(dataInicio: string | null | undefined): string {
  if (!dataInicio || dataInicio.length !== 8) return "";
  const y = parseInt(dataInicio.slice(0, 4));
  const m = parseInt(dataInicio.slice(4, 6));
  const now = new Date();
  let years = now.getFullYear() - y;
  if (now.getMonth() + 1 < m) years--;
  if (years <= 0) return "Menos de 1 ano";
  if (years === 1) return "1 ano";
  return `${years} anos`;
}
