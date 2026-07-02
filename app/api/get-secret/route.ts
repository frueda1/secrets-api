import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/get-secret
 *
 * Returns a scoped, ready-to-use header object for a requested secret.
 * Protected by an internal token (x-internal-token) so only trusted
 * callers (like a Sitecore Agentic Studio HTTP Request step) can use it.
 *
 * The response shape is intentionally minimal so it can be dropped
 * directly into a workflow's "Headers (JSON)" field:
 *   { "Authorization": "Bearer <key>" }
 *
 * Supported secret names (extend as needed):
 *   - HUBSPOT_KEY
 */

const SECRET_MAP: Record<string, string | undefined> = {
  HUBSPOT_KEY: process.env.HUBSPOT_KEY,
};

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const internalToken = request.headers.get("x-internal-token");

  if (!internalToken || internalToken !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json(
      { error: "Unauthorized: missing or invalid internal token" },
      { status: 401 }
    );
  }

  // Accept the secret name either as a query param (?name=HUBSPOT_KEY)
  // or in a JSON body ({ "name": "HUBSPOT_KEY" }). Defaults to HUBSPOT_KEY,
  // which matches the single-step HTTP Request pattern used in Agentic Studio.
  const url = new URL(request.url);
  let secretName = url.searchParams.get("name");

  if (!secretName && request.method === "POST") {
    try {
      const body = await request.json();
      secretName = body?.name ?? null;
    } catch {
      // no body provided, fall through to default
    }
  }

  secretName = secretName ?? "HUBSPOT_KEY";

  const secretValue = SECRET_MAP[secretName];

  if (!secretValue) {
    return NextResponse.json(
      { error: `Unknown or unconfigured secret: ${secretName}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    Authorization: `Bearer ${secretValue}`,
  });
}
