import { NextResponse } from "next/server";
import { z } from "zod";
import { runCatalogAgent, type AgentMessage } from "@/lib/agent";

const schema = z.object({
  message: z.string().min(1),
  history: z
    .array(z.object({ role: z.enum(["user", "model"]), text: z.string() }))
    .max(20)
    .optional()
    .default([]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await runCatalogAgent(parsed.data.message, parsed.data.history as AgentMessage[]);
    return NextResponse.json(result);
  } catch (err) {
    const messageText = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: messageText }, { status: 502 });
  }
}
