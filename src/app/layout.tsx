import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techzone.bj"),
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
    <html lang="fr" className={`${syne.variable} ${grotesk.variable} ${plex.variable}`}>
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
