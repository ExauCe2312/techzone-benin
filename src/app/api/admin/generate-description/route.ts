import { NextResponse } from "next/server";
import { z } from "zod";
import { generateDescription } from "@/lib/gemini";

const schema = z.object({
  name: z.string().min(2),
  categoryLabel: z.string().min(1),
  conditionDetail: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const description = await generateDescription(parsed.data);
    return NextResponse.json({ description });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
