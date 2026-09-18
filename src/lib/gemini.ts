// Génération de description produit via l'API Gemini (Google AI Studio).
// Appelé uniquement depuis une route serveur protégée — la clé API ne
// transite jamais côté navigateur.

import { DESCRIPTION_STYLE_RULES, formatFewShotExamples } from "@/lib/catalog-style";

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

  const prompt = `Tu rédiges des fiches produit courtes pour le catalogue WhatsApp de TechZone Bénin, une boutique d'informatique et de téléphonie à Abomey-Calavi.

Style à respecter strictement (voir exemples ci-dessous) :
${DESCRIPTION_STYLE_RULES}

Exemples tirés du catalogue existant :

${formatFewShotExamples()}

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
  const text = parts
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join(" ")
    .trim();
  if (!text) throw new Error("Réponse Gemini vide ou inattendue");
  return text.replace(/^["«»]+|["«»]+$/g, "");
}
