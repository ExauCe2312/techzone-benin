// Style de rédaction partagé entre le générateur simple ("Générer avec l'IA"
// dans le formulaire) et l'agent conversationnel — pour que les deux
// produisent des descriptions cohérentes avec le reste du catalogue.

export const DESCRIPTION_FEW_SHOT = [
  {
    name: "Redmi A5 128+4",
    category: "Smartphones",
    condition: "Neuf",
    notes: "128 Go de stockage, 4 Go de RAM",
    description:
      "Avec 128 Go de stockage et 4 Go de RAM, ce smartphone offre un espace confortable pour vos applications et fichiers.",
  },
  {
    name: "HP ProBook 450 G3",
    category: "Ordinateurs portables occasion 10/10",
    condition: "Occasion 10/10",
    notes: "écran 15,6 pouces, Intel Core i5, 6 Go RAM, HDD 1 To, fréquence 2,40 GHz, autonomie 3h",
    description:
      "Écran 15,6\", Intel Core i5, 6 Go RAM, HDD 1 To, fréquence 2,40 GHz. Autonomie annoncée : 3h.",
  },
  {
    name: "PowerBank Oraimo 20 000 mAh Original",
    category: "Chargeurs & powerbanks",
    condition: "Neuf",
    notes: "batterie externe originale Oraimo, 20 000 mAh",
    description:
      "PowerBank Oraimo original de 20 000 mAh, pratique pour recharger vos appareils lors de vos déplacements.",
  },
];

export const DESCRIPTION_STYLE_RULES = `- 1 à 2 phrases, jamais plus.
- Ton pratique et factuel, jamais publicitaire ou grandiloquent.
- Pas d'émoji, pas de markdown, pas de guillemets autour du texte.
- Ne répète pas le prix ni le nom du produit dans la phrase.
- Si des caractéristiques techniques sont connues (stockage, RAM, écran, processeur...), les intégrer naturellement, sans surcharger — l'essentiel, pas une fiche technique complète.`;

export function formatFewShotExamples(): string {
  return DESCRIPTION_FEW_SHOT.map(
    (ex) =>
      `Produit : ${ex.name}\nCatégorie : ${ex.category}\nÉtat : ${ex.condition}\nNotes : ${ex.notes}\nDescription attendue : ${ex.description}`,
  ).join("\n\n");
}
