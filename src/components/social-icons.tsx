import { MessageCircle } from "lucide-react";

/**
 * Icônes "réseaux sociaux" génériques plutôt que les logos officiels exacts
 * (évite toute question de droit sur une reproduction de marque) — le
 * cercle coloré + la position dans un bloc "suivez-nous" suffisent à les
 * identifier sans ambiguïté.
 */
export function WhatsAppBadge() {
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#25D366] text-white transition-transform group-hover:scale-105">
      <MessageCircle size={17} strokeWidth={2.3} />
    </span>
  );
}

export function FacebookBadge() {
  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#1877F2] font-display text-base font-extrabold text-white transition-transform group-hover:scale-105">
      f
    </span>
  );
}
