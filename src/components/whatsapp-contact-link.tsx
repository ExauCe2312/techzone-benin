"use client";

import type { ReactNode } from "react";
import { trackWhatsAppContact } from "@/lib/meta-pixel";

/**
 * Lien WhatsApp générique (pas de produit précis) qui reste utilisable
 * depuis un composant serveur — seul ce petit composant a besoin d'être
 * "client" pour déclencher le suivi Meta Pixel au clic.
 */
export default function WhatsAppContactLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackWhatsAppContact()}
    >
      {children}
    </a>
  );
}
