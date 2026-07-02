import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HubSpot Secrets API",
  description: "Protects HubSpot API credentials for Sitecore Agentic Studio workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
