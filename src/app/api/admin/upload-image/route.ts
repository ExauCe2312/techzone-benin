import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/supabase-storage";

const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (8 Mo maximum)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadProductImage(buffer, file.name, file.type);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
