import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jurídico Online — Consulta de empresas e CNPJ",
    short_name: "Jurídico Online",
    description:
      "Consulta gratuita de 65 milhões de empresas brasileiras. CNPJ, sócios, contatos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F4C81",
    lang: "pt-BR",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    categories: ["business", "productivity", "finance"],
  };
}
