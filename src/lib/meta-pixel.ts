"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Déclenche l'événement standard Meta "Contact" — celui prévu pour "un
 * client contacte l'entreprise (chat, tel, etc.)", ce qui correspond
 * exactement à un clic sur "Commander sur WhatsApp". Utiliser un événement
 * standard plutôt qu'un événement personnalisé permet de le choisir
 * directement comme objectif de campagne dans Meta Ads, sans configuration
 * de conversion personnalisée supplémentaire.
 * Ne fait rien si le Pixel n'est pas configuré (NEXT_PUBLIC_META_PIXEL_ID absent).
 */
export function trackWhatsAppContact(details?: {
  productName?: string;
  category?: string;
  price?: number;
}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "Contact", {
    content_name: details?.productName,
    content_category: details?.category,
    value: details?.price,
    currency: "XOF",
  });
}
