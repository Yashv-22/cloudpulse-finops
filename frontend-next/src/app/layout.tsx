import type { Metadata } from "next";
import { PreferencesProvider } from "@/context/PreferencesContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudPulse — Autonomous FinOps for AWS",
  description: "Detect AWS waste instantly. AI-powered cost optimization and autonomous remediation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
