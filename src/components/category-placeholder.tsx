import { Headphones, Laptop, Smartphone, Tablet } from "lucide-react";
import type { CategorySlug } from "@/lib/constants";

const ICONS: Record<CategorySlug, typeof Smartphone> = {
  telephones: Smartphone,
  ordinateurs: Laptop,
  tablettes: Tablet,
  "audio-accessoires": Headphones,
};

const TINTS: Record<CategorySlug, string> = {
  telephones: "from-accent/25 via-accent/10 to-transparent",
  ordinateurs: "from-sky-400/25 via-sky-400/10 to-transparent",
  tablettes: "from-violet-400/25 via-violet-400/10 to-transparent",
  "audio-accessoires": "from-emerald-400/25 via-emerald-400/10 to-transparent",
};

/**
 * Visuel générique affiché tant qu'aucune photo réelle n'a été envoyée
 * pour un produit (voir l'outil admin). Volontairement stylisé plutôt que
 * photographique : pas de vraie photo produit sans l'accord du vendeur.
 */
export default function CategoryPlaceholder({
  category,
  className = "",
}: {
  category: string;
  className?: string;
}) {
  const Icon = ICONS[category as CategorySlug] ?? Smartphone;
  const tint = TINTS[category as CategorySlug] ?? TINTS.telephones;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${tint} bg-ink/[0.04] ${className}`}
    >
      <div className="glass grid h-16 w-16 place-items-center rounded-2xl sm:h-20 sm:w-20">
        <Icon size={30} strokeWidth={1.6} className="text-ink/70" />
      </div>
    </div>
  );
}
