// Agent conversationnel de gestion du catalogue : recherche web (specs
// produit) + appel de fonctions pour proposer un ajout/une modification.
// Appelé uniquement depuis une route serveur protégée.

import { CATEGORIES, SUBCATEGORIES, type CategorySlug } from "@/lib/constants";
import { DESCRIPTION_STYLE_RULES, formatFewShotExamples } from "@/lib/catalog-style";
import { searchCatalogForAgent, getProductsNeedingAttention } from "@/lib/data";

export type AgentMessage = { role: "user" | "model"; text: string };

export type ProposedCreate = {
  type: "create";
  fields: {
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    subcategoryLabel: string;
    condition: "neuf" | "occasion";
    conditionDetail: string;
    warranty: string | null;
    description: string;
    price: number;
    priceNote: string | null;
  };
  summary: string;
};

export type ProposedUpdate = {
  type: "update";
  productId: number;
  productName: string;
  fields: Partial<ProposedCreate["fields"]>;
  summary: string;
};

export type ProposedAction = ProposedCreate | ProposedUpdate;

export type AgentResult = {
  reply: string;
  proposedActions?: ProposedAction[];
};

function requireApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY est requis (voir .env.example)");
  return apiKey;
}

function getModel(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
};

function extractText(data: GeminiResponse): string {
  const parts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => !p.thought && p.text)
    .map((p) => p.text)
    .join(" ")
    .trim();
}

function categoryContext(): string {
  return CATEGORIES.map((c) => {
    const subs = SUBCATEGORIES[c.slug as CategorySlug].map((s) => `${s.slug} (${s.label})`).join(", ");
    return `- ${c.slug} (${c.label}) → sous-catégories possibles : ${subs}`;
  }).join("\n");
}

/* ————— Phase 1 : recherche web des caractéristiques, seulement si utile ————— */
async function researchSpecs(instruction: string, historyText: string): Promise<string> {
  try {
    const apiKey = requireApiKey();
    const model = getModel();

    const prompt = `Tu aides à gérer le catalogue d'une boutique tech au Bénin (téléphones, ordinateurs, tablettes, accessoires).

${historyText ? `Conversation précédente :\n${historyText}\n\n` : ""}Nouvelle instruction de l'utilisateur : "${instruction}"

Si cette instruction porte sur un produit dont les caractéristiques techniques réelles seraient utiles (écran, processeur/puce, RAM, appareil photo, batterie, année de sortie...) et que tu peux les trouver sur le web, cherche-les et résume-les en quelques éléments clés (pas une fiche technique complète — l'essentiel qui aiderait à rédiger une description courte).

Si aucune recherche n'est utile ici (ex. l'utilisateur donne déjà toutes les infos, ou demande juste de changer un prix/un statut, ou pose une question qui ne porte pas sur les caractéristiques d'un produit), réponds uniquement par le mot : AUCUNE_RECHERCHE_NECESSAIRE`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
        }),
      },
    );

    if (!res.ok) return "";
    const data = await res.json();
    const text = extractText(data);
    if (!text || text.includes("AUCUNE_RECHERCHE_NECESSAIRE")) return "";
    return text;
  } catch {
    // La recherche est un bonus : si elle échoue, l'agent continue sans specs web
    // plutôt que de bloquer toute la conversation.
    return "";
  }
}

/* ————— Déclaration des outils (function calling) ————— */
const TOOLS = [
  {
    name: "search_catalog",
    description:
      "Cherche des produits existants dans le catalogue par nom ou marque. À utiliser AVANT toute modification d'un produit existant, pour retrouver son id exact — ne jamais deviner un id.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Terme de recherche (nom du produit, marque...)" },
      },
      required: ["query"],
    },
  },
  {
    name: "find_products_to_improve",
    description:
      "Retourne un échantillon de produits qui pourraient bénéficier d'une amélioration (description trop courte, garantie manquante pour un article d'occasion, aucune photo...). À utiliser quand l'utilisateur demande une suggestion ou une idée d'amélioration, sans préciser de produit.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "propose_create_product",
    description: "Propose l'ajout d'un nouveau produit au catalogue (ne l'enregistre pas directement — l'utilisateur doit confirmer).",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        brand: { type: "string" },
        category: { type: "string", description: "Un des slugs de catégorie fournis dans le contexte" },
        subcategory: { type: "string", description: "Un des slugs de sous-catégorie fournis dans le contexte" },
        condition: { type: "string", enum: ["neuf", "occasion"] },
        conditionDetail: { type: "string", description: "Ex. Neuf, Occasion 10/10" },
        warranty: { type: "string", description: "Garantie si connue, sinon omettre" },
        description: { type: "string", description: "1-2 phrases, style factuel (voir consignes)" },
        price: { type: "integer", description: "Prix en FCFA" },
        priceNote: { type: "string", description: "Ex. / pack, si pertinent sinon omettre" },
      },
      required: ["name", "category", "subcategory", "condition", "conditionDetail", "description", "price"],
    },
  },
  {
    name: "propose_update_product",
    description: "Propose une modification d'un produit existant (trouvé via search_catalog). N'enregistre pas directement.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "integer", description: "Id exact obtenu via search_catalog" },
        name: { type: "string" },
        brand: { type: "string" },
        category: { type: "string" },
        subcategory: { type: "string" },
        condition: { type: "string", enum: ["neuf", "occasion"] },
        conditionDetail: { type: "string" },
        warranty: { type: "string" },
        description: { type: "string" },
        price: { type: "integer" },
        priceNote: { type: "string" },
      },
      required: ["productId"],
    },
  },
];

type GeminiPart = {
  text?: string;
  thought?: boolean;
  functionCall?: { id?: string; name: string; args: Record<string, unknown> };
  functionResponse?: { id?: string; name: string; response: Record<string, unknown> };
};

const MAX_TURNS = 6;

function subLabel(category: string, subcategory: string): string {
  const match = SUBCATEGORIES[category as CategorySlug]?.find((s) => s.slug === subcategory);
  return match?.label ?? subcategory;
}

function buildCreateSummary(args: Record<string, unknown>): string {
  const name = String(args.name ?? "");
  const price = Number(args.price ?? 0);
  const cat = subLabel(String(args.category ?? ""), String(args.subcategory ?? ""));
  return `Nouveau produit : ${name} — ${price.toLocaleString("fr-FR")} FCFA — ${cat}`;
}

function buildUpdateSummary(args: Record<string, unknown>, productName: string): string {
  const changed = Object.entries(args)
    .filter(([k]) => k !== "productId")
    .map(([k, v]) => `${k} → ${v}`)
    .join(", ");
  return `Modifier "${productName}" : ${changed || "aucun changement précisé"}`;
}

async function buildProposedAction(
  call: { name: string; args: Record<string, unknown> },
): Promise<ProposedAction | null> {
  const args = call.args;

  if (call.name === "propose_create_product") {
    const category = String(args.category ?? "");
    const subcategory = String(args.subcategory ?? "");
    return {
      type: "create",
      fields: {
        name: String(args.name ?? ""),
        brand: String(args.brand ?? ""),
        category,
        subcategory,
        subcategoryLabel: subLabel(category, subcategory),
        condition: args.condition === "occasion" ? "occasion" : "neuf",
        conditionDetail: String(args.conditionDetail ?? "Neuf"),
        warranty: args.warranty ? String(args.warranty) : null,
        description: String(args.description ?? ""),
        price: Number(args.price ?? 0),
        priceNote: args.priceNote ? String(args.priceNote) : null,
      },
      summary: buildCreateSummary(args),
    };
  }

  if (call.name === "propose_update_product") {
    const productId = Number(args.productId);
    const fields: Partial<ProposedCreate["fields"]> = {};
    if (args.name) fields.name = String(args.name);
    if (args.brand) fields.brand = String(args.brand);
    if (args.category) fields.category = String(args.category);
    if (args.subcategory) {
      fields.subcategory = String(args.subcategory);
      fields.subcategoryLabel = subLabel(String(args.category ?? ""), String(args.subcategory));
    }
    if (args.condition) fields.condition = args.condition === "occasion" ? "occasion" : "neuf";
    if (args.conditionDetail) fields.conditionDetail = String(args.conditionDetail);
    if (args.warranty) fields.warranty = String(args.warranty);
    if (args.description) fields.description = String(args.description);
    if (args.price != null) fields.price = Number(args.price);
    if (args.priceNote) fields.priceNote = String(args.priceNote);

    // Retrouve le nom actuel du produit pour un résumé lisible.
    let productName = `#${productId}`;
    try {
      const hits = await searchCatalogForAgent(String(args.name ?? ""), 20);
      const found = hits.find((h) => h.id === productId);
      if (found) productName = found.name;
    } catch {
      // pas bloquant pour le résumé
    }

    return {
      type: "update",
      productId,
      productName,
      fields,
      summary: buildUpdateSummary(args, productName),
    };
  }

  return null;
}

export async function runCatalogAgent(message: string, history: AgentMessage[]): Promise<AgentResult> {
  const apiKey = requireApiKey();
  const model = getModel();

  const historyText = history
    .map((h) => `${h.role === "user" ? "Utilisateur" : "Assistant"} : ${h.text}`)
    .join("\n");

  const research = await researchSpecs(message, historyText);

  const systemInstruction = {
    role: "user",
    parts: [
      {
        text: `Tu es l'assistant catalogue de TechZone Bénin, une boutique tech à Abomey-Calavi. Tu aides le vendeur à ajouter ou modifier des produits via des instructions en langage naturel.

Catégories et sous-catégories valides :
${categoryContext()}

Style de description à respecter (1-2 phrases, factuel) :
${DESCRIPTION_STYLE_RULES}

Exemples de descriptions dans le bon style :
${formatFewShotExamples()}

Règles importantes :
- Pour AJOUTER un produit : utilise propose_create_product. Si des caractéristiques réelles ont été trouvées par recherche web (fournies ci-dessous si disponibles), intègre-les dans la description sans surcharger.
- Pour MODIFIER un produit existant : utilise D'ABORD search_catalog pour le retrouver et obtenir son id exact, puis propose_update_product avec cet id. Ne devine jamais un id.
- Si l'utilisateur demande une suggestion ou une idée d'amélioration sans préciser de produit, utilise find_products_to_improve, puis choisis UN produit pertinent parmi les résultats (ou PLUSIEURS s'il demande explicitement plusieurs suggestions — dans ce cas, appelle propose_update_product une fois PAR produit choisi, dans le même tour).
- Idem pour une demande explicite de "plusieurs" ajouts/modifications à la fois : appelle propose_create_product / propose_update_product autant de fois que nécessaire dans le même tour, un appel par produit — n'attends pas une validation avant de proposer le suivant.
- Avant ces appels, écris un texte qui explique clairement, pour CHAQUE produit proposé, ce que tu changes et pourquoi (une à deux phrases par produit si plusieurs). L'utilisateur doit comprendre le "pourquoi" avant de valider.
- Si plusieurs produits correspondent et que ce n'est pas clair, NE PROPOSE RIEN : réponds en texte simple pour demander une précision.
- Si l'instruction est juste une question (pas une action), réponds normalement en texte, sans appeler propose_create_product ni propose_update_product.
- N'appelle jamais deux fois propose_create_product ou propose_update_product dans la même conversation pour la même chose.

${research ? `Caractéristiques trouvées par recherche web pour cette instruction :\n${research}` : ""}`,
      },
    ],
  };

  const contents: Array<{ role: string; parts: GeminiPart[] }> = [
    ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: "user", parts: [{ text: message }] },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction,
          contents,
          tools: [{ functionDeclarations: TOOLS }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 } },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 300)}`);
    }

    const data = (await res.json()) as GeminiResponse;
    const modelParts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
    const functionCalls = modelParts.filter((p) => p.functionCall);

    if (functionCalls.length === 0) {
      // Pas d'appel d'outil : réponse texte finale.
      const text = extractText(data);
      return { reply: text || "Je n'ai pas compris, peux-tu reformuler ?" };
    }

    // Les outils terminaux (propose_*) arrêtent la boucle immédiatement —
    // mais TOUS ceux présents dans ce tour sont collectés (pas seulement le premier),
    // pour permettre plusieurs propositions d'un coup.
    const terminalCalls = functionCalls.filter(
      (p) => p.functionCall!.name === "propose_create_product" || p.functionCall!.name === "propose_update_product",
    );

    if (terminalCalls.length > 0) {
      // Le modèle explique généralement son geste dans une part texte à côté
      // des appels d'outils — on la garde comme explication affichée à l'utilisateur.
      const explanation = extractText(data);
      const actions: ProposedAction[] = [];
      for (const term of terminalCalls) {
        const action = await buildProposedAction(term.functionCall!);
        if (action) actions.push(action);
      }
      const summaries = actions.map((a) => a.summary).join("\n");
      return {
        reply: explanation ? `${explanation}\n\n${summaries}` : summaries,
        proposedActions: actions,
      };
    }

    // Sinon : exécute les search_catalog demandés et poursuit la boucle.
    contents.push({ role: "model", parts: modelParts });
    const responseParts: GeminiPart[] = [];
    for (const p of functionCalls) {
      const call = p.functionCall!;
      if (call.name === "search_catalog") {
        const query = String((call.args as Record<string, unknown>).query ?? "");
        const hits = await searchCatalogForAgent(query);
        responseParts.push({
          functionResponse: {
            id: call.id,
            name: call.name,
            response: { results: hits },
          },
        });
      } else if (call.name === "find_products_to_improve") {
        const hits = await getProductsNeedingAttention();
        responseParts.push({
          functionResponse: {
            id: call.id,
            name: call.name,
            response: { results: hits },
          },
        });
      } else {
        responseParts.push({
          functionResponse: { id: call.id, name: call.name, response: { error: "Outil inconnu" } },
        });
      }
    }
    contents.push({ role: "user", parts: responseParts });
  }

  return { reply: "Je n'arrive pas à conclure cette demande — peux-tu la reformuler plus simplement ?" };
}
