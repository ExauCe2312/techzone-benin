// Génération de description produit via l'API Gemini (Google AI Studio).
// Appelé uniquement depuis une route serveur protégée — la clé API ne
// transite jamais côté navigateur.

const FEW_SHOT = [
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

export type GenerateDescriptionInput = {
  name: string;
  categoryLabel: string;
  conditionDetail: string;
  notes?: string;
};

export async function generateDescription(input: GenerateDescriptionInput): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY est requis (voir .env.example)");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const examples = FEW_SHOT.map(
    (ex) =>
      `Produit : ${ex.name}\nCatégorie : ${ex.category}\nÉtat : ${ex.condition}\nNotes : ${ex.notes}\nDescription attendue : ${ex.description}`,
  ).join("\n\n");

  const prompt = `Tu rédiges des fiches produit courtes pour le catalogue WhatsApp de TechZone Bénin, une boutique d'informatique et de téléphonie à Abomey-Calavi.

Style à respecter strictement (voir exemples ci-dessous) :
- 1 à 2 phrases, jamais plus.
- Ton pratique et factuel, jamais publicitaire ou grandiloquent.
- Pas d'émoji, pas de markdown, pas de guillemets autour du texte.
- Ne répète pas le prix ni le nom du produit dans la phrase.
- Si des caractéristiques techniques sont données dans les notes, les intégrer naturellement.

Exemples tirés du catalogue existant :

${examples}

Nouveau produit à décrire :
Produit : ${input.name}
Catégorie : ${input.categoryLabel}
État : ${input.conditionDetail}
Notes fournies par le vendeur : ${input.notes?.trim() || "aucune"}

Réponds uniquement avec la description, sans rien d'autre.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 200,
          // Cette tâche est simple (1-2 phrases) : on désactive le "raisonnement" interne
          // du modèle — inutile ici, et ça évite de récupérer un fragment de réflexion
          // au lieu de la réponse finale (voir le filtre sur "thought" ci-dessous).
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const parts: Array<{ text?: string; thought?: boolean }> =
    data?.candidates?.[0]?.content?.parts ?? [];
  // Sur les modèles qui pensent avant de répondre, certaines "parts" ne sont que des
  // brouillons de raisonnement (thought: true) — on ne garde que la réponse finale.
  const text = parts
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join(" ")
    .trim();
  if (!text) throw new Error("Réponse Gemini vide ou inattendue");
  return text.replace(/^["«»]+|["«»]+$/g, "");
}
