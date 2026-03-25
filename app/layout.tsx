import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudPulse FinOps",
  description: "Zero-Trust AWS Cost Optimization Dashboard",
};

import { GlobalProvider } from "@/components/global-state";
import { Shield } from "lucide-react";
import Link from "next/link";
import { getExchangeRate } from "@/actions/finance";
import { Marquee } from "@/components/Marquee";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentRate = await getExchangeRate();

  return (
    <html lang="en" suppressHydrationWarning className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <ThemeProvider>
          <GlobalProvider initialExchangeRate={currentRate}>
            <Marquee />
            {children}
            <footer className="mt-auto border-t border-border bg-card/30 backdrop-blur-md py-4 px-6 text-sm text-center text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-2 z-50">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Zero-Trust Architecture: Credentials are processed in-memory and never stored. Requires ReadOnlyAccess only.</span>
              <Link href="#" className="font-medium text-primary hover:underline ml-2">Read our Security Whitepaper</Link>
            </footer>
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
