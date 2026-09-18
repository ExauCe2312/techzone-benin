import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { CATEGORIES, SUBCATEGORIES, type CategorySlug } from "@/lib/constants";
import { createProduct, getAllProductsForAdmin, slugExists } from "@/lib/data";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const items = await getAllProductsForAdmin();
  return NextResponse.json({ items });
}

const createSchema = z.object({
  name: z.string().min(2),
  brand: z.string().optional().default(""),
  category: z.string(),
  subcategory: z.string(),
  condition: z.enum(["neuf", "occasion"]),
  conditionDetail: z.string().min(1),
  warranty: z.string().optional().nullable(),
  description: z.string().min(1),
  price: z.number().int().positive(),
  priceNote: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const categoryValid = CATEGORIES.some((c) => c.slug === data.category);
  if (!categoryValid) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  const sub = SUBCATEGORIES[data.category as CategorySlug]?.find((s) => s.slug === data.subcategory);
  if (!sub) {
    return NextResponse.json({ error: "Sous-catégorie invalide." }, { status: 400 });
  }

  const slug = await uniqueSlug(data.name, slugExists);

  const product = await createProduct({
    slug,
    name: data.name,
    brand: data.brand || "",
    category: data.category,
    subcategory: data.subcategory,
    subcategoryLabel: sub.label,
    condition: data.condition,
    conditionDetail: data.conditionDetail,
    warranty: data.warranty || null,
    description: data.description,
    price: data.price,
    priceNote: data.priceNote || null,
    images: data.images ?? [],
    featured: data.featured ?? false,
  });

  revalidateTag("products", { expire: 0 });
  return NextResponse.json({ item: product }, { status: 201 });
}