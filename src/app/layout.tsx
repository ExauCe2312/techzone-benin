import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://techzone.bj"),
  title: {
    default: "TechZone Bénin — Catalogue téléphones, ordinateurs & accessoires",
    template: "%s · TechZone Bénin",
  },
  description:
    "Le catalogue TechZone Bénin : téléphones, smartphones, ordinateurs et accessoires. Consultez les prix et commandez directement sur WhatsApp.",
  keywords: [
    "smartphone Bénin",
    "ordinateur Abomey-Calavi",
    "informatique Bénin",
    "TechZone",
    "catalogue WhatsApp",
  ],
  openGraph: {
    title: "TechZone Bénin",
    description: "Téléphones, ordinateurs & accessoires — commandez directement sur WhatsApp.",
    type: "website",
    locale: "fr_FR",
  },
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#f3efe8",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${plex.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <div className="ambient-mesh" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
