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
      "Écran 6,7\" HD+, puce MediaTek Helio G36, double capteur 8 Mpx et batterie 5 200 mAh avec charge 18W — un bon compromis autonomie/fluidité pour un usage quotidien.",
  },
  {
    name: "HP ProBook 450 G3",
    category: "Ordinateurs portables occasion 10/10",
    condition: "Occasion 10/10",
    notes: "écran 15,6 pouces, Intel Core i5, 6 Go RAM, HDD 1 To, fréquence 2,40 GHz, autonomie 3h",
    description:
      "Écran 15,6\", Intel Core i5 (2,40 GHz), 6 Go RAM, disque dur 1 To. Autonomie annoncée : 3h — correct pour un usage bureautique branché la plupart du temps.",
  },
  {
    name: "PowerBank Oraimo 20 000 mAh Original",
    category: "Chargeurs & powerbanks",
    condition: "Neuf",
    notes: "batterie externe originale Oraimo, 20 000 mAh",
    description:
      "20 000 mAh, deux sorties USB pour charger deux appareils en même temps — largement de quoi recharger un smartphone 3 à 4 fois.",
  },
];

export const DESCRIPTION_STYLE_RULES = `- 1 à 2 phrases, jamais plus.
- Ton pratique et factuel, jamais publicitaire ou grandiloquent.
- Pas d'émoji, pas de markdown, pas de guillemets autour du texte.
- Ne répète pas le prix ni le nom du produit dans la phrase.
- INTERDIT : les formules creuses du type "offre un espace confortable", "pour tous vos besoins", "idéal pour un usage quotidien" sans rien de concret derrière. Chaque phrase doit contenir au moins une caractéristique précise et vérifiable (puce/processeur, écran, appareil photo, batterie/autonomie, connectivité...), pas seulement redire le stockage/RAM déjà affichés ailleurs sur la fiche.
- Si les notes fournies ne donnent pas assez de détails techniques réels, cherche les vraies caractéristiques du modèle (puce, écran, appareil photo, batterie) plutôt que de rester vague.`;

export function formatFewShotExamples(): string {
  return DESCRIPTION_FEW_SHOT.map(
    (ex) =>
      `Produit : ${ex.name}\nCatégorie : ${ex.category}\nÉtat : ${ex.condition}\nNotes : ${ex.notes}\nDescription attendue : ${ex.description}`,
  ).join("\n\n");
}
