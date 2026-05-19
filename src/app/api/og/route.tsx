import { ImageResponse } from "next/og";
import { getEmpresaByCNPJ } from "@/lib/meili";
import { formatCNPJ } from "@/lib/cnpj";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cnpjParam = searchParams.get("cnpj")?.replace(/\D/g, "") || "";
  const customTitle = searchParams.get("title");

  let title = "Jurídico Online";
  let subtitle = "Consulta gratuita de 65 milhões de empresas brasileiras";
  let cnpjBadge: string | null = null;
  let cidadeBadge: string | null = null;

  if (cnpjParam.length === 14) {
    const empresa = await getEmpresaByCNPJ(cnpjParam);
    if (empresa) {
      title = empresa.razao_social.slice(0, 64);
      subtitle = empresa.cnae_descricao?.slice(0, 90) || subtitle;
      cnpjBadge = formatCNPJ(empresa.cnpj_completo);
      cidadeBadge = empresa.municipio_nome
        ? `${empresa.municipio_nome}/${empresa.uf}`
        : empresa.uf || null;
    }
  } else if (customTitle) {
    title = customTitle.slice(0, 64);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "60px",
          background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 600 }}>
          <span style={{ color: "#0F4C81" }}>Jurídico</span>
          <span style={{ color: "#10B981" }}>Online</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 64,
            gap: 16,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: title.length > 40 ? 54 : 64,
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.15,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          {cnpjBadge && (
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              <div
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  background: "#0F4C81",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 600,
                  borderRadius: 8,
                  fontFamily: "monospace",
                }}
              >
                CNPJ {cnpjBadge}
              </div>
              {cidadeBadge && (
                <div
                  style={{
                    display: "flex",
                    padding: "8px 16px",
                    background: "#10B98115",
                    color: "#10B981",
                    fontSize: 22,
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                >
                  📍 {cidadeBadge}
                </div>
              )}
            </div>
          )}
          <div style={{ fontSize: 28, color: "#475569", marginTop: 12, lineHeight: 1.4 }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "2px solid #e2e8f0",
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>juridicoonline.com.br</span>
          <span>Dados Receita Federal • Atualizado hoje</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
