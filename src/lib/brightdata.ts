/**
 * Bright Data client — Web Unlocker + Datasets.
 *
 * Uses HTTP API for one-off scrapes and structured dataset queries.
 * Pricing: ~$1 per 1k unlocker reqs, ~$0.5 per 1k dataset records.
 *
 * Usage:
 *   await brightData.unlock("https://cnpj.biz/00000000000191")
 *   await brightData.dataset("linkedin_company", { name: "Petrobras" })
 */

const API_KEY = process.env.BRIGHTDATA_API_KEY || "";
const UNLOCKER_ZONE = process.env.BRIGHTDATA_ZONE || "web_unlocker1";
const TIMEOUT = 30_000;

type UnlockOpts = {
  format?: "raw" | "json" | "screenshot";
  country?: string; // BR, US, etc
  render?: boolean; // headless render JS
};

async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/**
 * Fetch a URL through Bright Data's Web Unlocker (bypasses Cloudflare/captcha/anti-bot).
 * Returns raw HTML by default.
 */
export async function unlock(url: string, opts: UnlockOpts = {}): Promise<string | null> {
  if (!API_KEY) {
    console.warn("[brightdata] BRIGHTDATA_API_KEY not set");
    return null;
  }
  try {
    const r = await fetchWithTimeout(
      "https://api.brightdata.com/request",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone: UNLOCKER_ZONE,
          url,
          format: opts.format || "raw",
          country: opts.country,
          render: opts.render,
        }),
      },
      TIMEOUT
    );
    if (!r.ok) {
      const t = await r.text();
      console.error("[brightdata] unlock failed", r.status, t.slice(0, 200));
      return null;
    }
    return await r.text();
  } catch (e) {
    console.error("[brightdata] unlock error", e);
    return null;
  }
}

/**
 * Trigger a dataset scrape (LinkedIn, Crunchbase, etc).
 * Returns the snapshot_id to poll later.
 */
export async function dataset(
  datasetId: string,
  query: Record<string, unknown>
): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const r = await fetchWithTimeout(
      `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${datasetId}&format=json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      },
      TIMEOUT
    );
    if (!r.ok) {
      console.error("[brightdata] dataset trigger failed", r.status);
      return null;
    }
    const json = (await r.json()) as { snapshot_id?: string };
    return json.snapshot_id || null;
  } catch (e) {
    console.error("[brightdata] dataset error", e);
    return null;
  }
}

/**
 * Quick enrichment helper — try to extract phone/email/website from a competitor page.
 * Used to enrich CNPJs that don't have full contact data in RFB.
 */
export async function enrichCompanyFromWeb(razaoSocial: string, cidade?: string): Promise<{
  phone?: string;
  email?: string;
  website?: string;
} | null> {
  // Use Google CSE search via Bright Data unlocker
  const q = encodeURIComponent(`"${razaoSocial}" ${cidade || ""} contato`);
  const html = await unlock(`https://www.google.com/search?q=${q}`, { render: false, country: "BR" });
  if (!html) return null;

  const phoneMatch = html.match(/\(\d{2}\)\s?\d{4,5}-?\d{4}/);
  const emailMatch = html.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/);
  const websiteMatch = html.match(/https?:\/\/(?!google\.com|youtube\.com)[a-z0-9.-]+\.(com\.br|br|com)/i);

  return {
    phone: phoneMatch?.[0],
    email: emailMatch?.[0],
    website: websiteMatch?.[0],
  };
}

export const brightData = { unlock, dataset, enrichCompanyFromWeb };
