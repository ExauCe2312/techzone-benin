import { STORE } from "@/lib/constants";

/**
 * Construit un lien wa.me qui ouvre WhatsApp avec un message prérempli.
 * Le nom du produit est repris tel quel, comme demandé : le client n'a
 * qu'à appuyer sur "Envoyer" pour transmettre sa demande.
 */
export function whatsappOrderLink(productName: string): string {
  const message = `Bonjour Techzone Bénin je suis intéressé par "${productName}"`;
  const digits = STORE.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function whatsappCustomLink(message: string): string {
  const digits = STORE.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
