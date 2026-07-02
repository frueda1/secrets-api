import { NextRequest, NextResponse } from "next/server";

/**
 * ALL /api/hubspot/:path*
 *
 * The recommended pattern: this route calls the HubSpot API on your
 * behalf and never returns the API key to the caller. The key never
 * leaves the server, which is stronger than handing out the key itself
 * (even scoped/token-protected, as /api/get-secret does).
 *
 * Example:
 *   POST /api/hubspot/marketing/v3/emails
 *   -> forwarded to https://api.hubapi.com/marketing/v3/emails
 */

const HUBSPOT_BASE_URL = "https://api.hubapi.com";

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const internalToken = request.headers.get("x-internal-token");

  if (!internalToken || internalToken !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json(
      { error: "Unauthorized: missing or invalid internal token" },
      { status: 401 }
    );
  }

  const hubspotKey = process.env.HUBSPOT_KEY;
  if (!hubspotKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: HUBSPOT_KEY is not set" },
      { status: 500 }
    );
  }

  const targetPath = params.path.join("/");
  const search = request.nextUrl.search; // preserves query string, e.g. ?limit=10
  const targetUrl = `${HUBSPOT_BASE_URL}/${targetPath}${search}`;

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const hubspotResponse = await fetch(targetUrl, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${hubspotKey}`,
      "Content-Type": "application/json",
    },
    body,
  });

  const responseText = await hubspotResponse.text();

  return new NextResponse(responseText, {
    status: hubspotResponse.status,
    headers: {
      "Content-Type":
        hubspotResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
