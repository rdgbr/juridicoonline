import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  // Image optimization disabled — we don't host images currently
  images: { unoptimized: true },
  // /socios faz GROUP BY em 27M rows da tabela Socio; default 60s estoura.
  // O fallback de [] na query ainda evita crash, mas aumentamos pra 3min p/ segurança.
  staticPageGenerationTimeout: 180,
  experimental: {
    // Cache external fetches to MeiliSearch via Next data cache
  },
};

export default nextConfig;
