export const CATEGORIES = [
  {
    slug: "telephones",
    label: "Téléphones",
    short: "Téléphones",
    tagline: "Touches, smartphones, Samsung, Tecno, Infinix & plus",
  },
  {
    slug: "ordinateurs",
    label: "Ordinateurs",
    short: "PC",
    tagline: "Portables neufs et occasion 10/10, mini PC",
  },
  {
    slug: "tablettes",
    label: "Tablettes",
    short: "Tablettes",
    tagline: "Tablettes enfants, multimédia & grande capacité",
  },
  {
    slug: "audio-accessoires",
    label: "Audio & Accessoires",
    short: "Accès.",
    tagline: "Enceintes, écouteurs, chargeurs, batteries, clés USB, réseau",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label]),
);

export const SUBCATEGORIES: Record<CategorySlug, { slug: string; label: string }[]> = {
  telephones: [
    { slug: "touches", label: "Téléphones à touches" },
    { slug: "smartphones", label: "Smartphones" },
    { slug: "samsung-galaxy", label: "Samsung Galaxy" },
    { slug: "tecno", label: "Tecno" },
    { slug: "infinix", label: "Infinix" },
    { slug: "villaon-itel", label: "Villaon & Itel" },
  ],
  ordinateurs: [
    { slug: "portables-neufs", label: "Portables neufs" },
    { slug: "portables-occasion", label: "Portables occasion 10/10" },
    { slug: "autres-occasion", label: "Autres — occasion 10/10" },
  ],
  tablettes: [{ slug: "tablettes", label: "Tablettes" }],
  "audio-accessoires": [
    { slug: "audio", label: "Enceintes & audio" },
    { slug: "chargeurs-powerbanks", label: "Chargeurs & powerbanks" },
    { slug: "batteries", label: "Batteries" },
    { slug: "cles-usb", label: "Clés USB" },
    { slug: "reseau", label: "Réseau" },
    { slug: "divers-kits", label: "Divers & kits" },
  ],
};

export const CONDITIONS = [
  { value: "neuf", label: "Neuf" },
  { value: "occasion", label: "Occasion" },
] as const;

export const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
] as const;

export const STORE = {
  name: "TechZone Bénin",
  whatsapp: "+2290163234114", // format international sans espaces, pour les liens wa.me
  whatsappDisplay: "+229 01 63 23 41 14",
  facebookUrl: "https://www.facebook.com/share/19JpNM2g5w/",
  address: "Abomey-Calavi, Bénin",
  hours: "Lun – Sam · 8h – 22h",
};
