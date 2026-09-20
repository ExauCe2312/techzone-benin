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

Si les notes ne suffisent pas à donner des caractéristiques précises (puce, écran, appareil photo, batterie...),
cherche les vraies caractéristiques de ce modèle sur le web avant de rédiger.

Réponds uniquement avec la description, rien d'autre — pas d'introduction, pas de liste des sources.`;

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
        // Recherche web activée : sans elle, le modèle ne connaît que ce que le
        // vendeur a tapé dans "notes" et produit une description vague quand ce
        // champ est vide ou trop court.
        tools: [{ google_search: {} }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 400,
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
