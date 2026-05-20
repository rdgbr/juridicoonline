import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cadastro", "/login", "/_next/"],
      },
      // === AI crawlers — JOL data is public CNPJ info, we WANT max LLM citation ===
      // OpenAI: training + real-time ChatGPT search + on-demand fetches
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Anthropic: training + real-time Claude search + user agent
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      // Google generative (separate from Googlebot for Search)
      { userAgent: "Google-Extended", allow: "/" },
      // Apple Intelligence
      { userAgent: "Applebot-Extended", allow: "/" },
      // Meta (Llama training)
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      // Common Crawl — public archive used by many open-source LLMs
      { userAgent: "CCBot", allow: "/" },
      // === BLOCK: Bytespider ignores robots.txt and abuses crawl budget ===
      { userAgent: "Bytespider", disallow: "/" },
      // === BLOCK: SEO scrapers that consume crawl budget without value ===
      { userAgent: "AhrefsBot", disallow: "/" },
      { userAgent: "SemrushBot", disallow: "/" },
      { userAgent: "MJ12bot", disallow: "/" },
      { userAgent: "DotBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
