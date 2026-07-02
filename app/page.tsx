export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>HubSpot Secrets API</h1>
      <p>
        This service exposes two endpoints for Sitecore Agentic Studio
        workflows:
      </p>
      <ul>
        <li>
          <code>POST /api/get-secret</code> — returns a token-protected{" "}
          <code>Authorization</code> header value.
        </li>
        <li>
          <code>ALL /api/hubspot/:path*</code> — proxies requests to the
          HubSpot API without ever exposing the key.
        </li>
      </ul>
    </main>
  );
}
