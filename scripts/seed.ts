import "dotenv/config";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import catalogue from "@/data/catalogue.json";

async function main() {
  console.log(`Import de ${catalogue.length} produits…`);

  for (const item of catalogue as Array<Record<string, unknown>>) {
    await db
      .insert(products)
      .values({
        slug: item.slug as string,
        name: item.name as string,
        brand: (item.brand as string) ?? "",
        category: item.category as string,
        subcategory: item.subcategory as string,
        subcategoryLabel: (item.subcategoryLabel as string) ?? "",
        condition: item.condition as string,
        conditionDetail: (item.conditionDetail as string) ?? "Neuf",
        warranty: (item.warranty as string | null) ?? null,
        description: (item.description as string) ?? "",
        price: item.price as number,
        priceNote: (item.priceNote as string | null) ?? null,
        images: [],
        featured: Boolean(item.featured),
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          name: item.name as string,
          brand: (item.brand as string) ?? "",
          category: item.category as string,
          subcategory: item.subcategory as string,
          subcategoryLabel: (item.subcategoryLabel as string) ?? "",
          condition: item.condition as string,
          conditionDetail: (item.conditionDetail as string) ?? "Neuf",
          warranty: (item.warranty as string | null) ?? null,
          description: (item.description as string) ?? "",
          price: item.price as number,
          priceNote: (item.priceNote as string | null) ?? null,
          featured: Boolean(item.featured),
          updatedAt: new Date(),
        },
      });
  }

  const [{ count }] = await db.execute<{ count: number }>(sql`select count(*)::int as count from products`).then(
    (r) => r.rows as unknown as { count: number }[],
  );
  console.log(`Terminé. ${count} produits en base.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Échec du seed :", err);
  process.exit(1);
});
