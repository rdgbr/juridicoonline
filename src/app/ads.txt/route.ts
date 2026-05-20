/**
 * /ads.txt — IAB standard for ad inventory authorization.
 * When Adsense is approved, this file MUST list the publisher ID.
 * Format: <SSP_DOMAIN>, <PUBLISHER_ID>, <RELATIONSHIP>, <CERT_AUTH_ID>
 */
import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  const pubId = process.env.ADSENSE_PUBLISHER_ID || "pub-XXXXXXXXXXXXXXXX";
  const body = `# ads.txt — Jurídico Online
# Authorized digital sellers (IAB Tech Lab spec)
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
