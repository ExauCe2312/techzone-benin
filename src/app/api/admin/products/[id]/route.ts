import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { deleteProduct, updateProduct } from "@/lib/data";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  subcategoryLabel: z.string().optional(),
  condition: z.enum(["neuf", "occasion"]).optional(),
  conditionDetail: z.string().optional(),
  warranty: z.string().nullable().optional(),
  description: z.string().optional(),
  price: z.number().int().positive().optional(),
  priceNote: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await updateProduct(productId, parsed.data);
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  revalidateTag("products", "max");
  return NextResponse.json({ item: product });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }
  await deleteProduct(productId);
  revalidateTag("products", "max");
  return NextResponse.json({ ok: true });
}
