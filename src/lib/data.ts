import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { products, type NewProduct, type Product } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, ne, or, sql, type SQL } from "drizzle-orm";

export type ProductFilters = {
  cat?: string;
  sub?: string;
  q?: string;
  marques?: string[];
  prixMin?: number;
  prixMax?: number;
  condition?: "neuf" | "occasion";
  sort?: string;
};

const SORTS: Record<string, SQL[]> = {
  pertinence: [desc(products.featured), desc(products.createdAt)],
  nouveautes: [desc(products.createdAt)],
  "prix-asc": [asc(products.price)],
  "prix-desc": [desc(products.price)],
};

// ————— Lecture côté catalogue public : mise en cache 5 min —————
// Le catalogue ne change pas à la seconde, et ça évite d'interroger Supabase
// à chaque visite. `revalidateTag("products")` (appelé après chaque
// création/modification/suppression dans l'admin) vide ce cache immédiatement,
// donc un changement reste visible tout de suite malgré le cache.
const CACHE_OPTIONS = { revalidate: 300, tags: ["products"] };

async function getProductsUncached(filters: ProductFilters): Promise<Product[]> {
  const conditions: SQL[] = [eq(products.active, true)];

  if (filters.cat) conditions.push(eq(products.category, filters.cat));
  if (filters.sub) conditions.push(eq(products.subcategory, filters.sub));
  if (filters.q) {
    const q = `%${filters.q.trim()}%`;
    conditions.push(
      or(ilike(products.name, q), ilike(products.brand, q), ilike(products.description, q))!,
    );
  }
  if (filters.marques?.length)
    conditions.push(or(...filters.marques.map((m) => eq(products.brand, m)))!);
  if (filters.prixMin != null) conditions.push(gte(products.price, filters.prixMin));
  if (filters.prixMax != null) conditions.push(lte(products.price, filters.prixMax));
  if (filters.condition) conditions.push(eq(products.condition, filters.condition));

  const orderBy = SORTS[filters.sort ?? "pertinence"] ?? SORTS.pertinence;

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(...orderBy);
}
export const getProducts = unstable_cache(getProductsUncached, ["products-list"], CACHE_OPTIONS);

async function getProductBySlugUncached(slug: string): Promise<Product | undefined> {
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0];
}
export const getProductBySlug = unstable_cache(getProductBySlugUncached, ["products-by-slug"], CACHE_OPTIONS);

async function getRelatedProductsUncached(
  subcategory: string,
  excludeId: number,
  limit = 4,
): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(
      and(eq(products.active, true), eq(products.subcategory, subcategory), ne(products.id, excludeId)),
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);
}
export const getRelatedProducts = unstable_cache(getRelatedProductsUncached, ["products-related"], CACHE_OPTIONS);

async function getFeaturedProductsUncached(limit = 8): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(and(eq(products.active, true), eq(products.featured, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}
export const getFeaturedProducts = unstable_cache(getFeaturedProductsUncached, ["products-featured"], CACHE_OPTIONS);

async function getNewArrivalsUncached(limit = 4): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(eq(products.active, true))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}
export const getNewArrivals = unstable_cache(getNewArrivalsUncached, ["products-new"], CACHE_OPTIONS);

async function getBrandsUncached(category?: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .where(category ? and(eq(products.active, true), eq(products.category, category)) : eq(products.active, true))
    .orderBy(asc(products.brand));
  return rows.map((r) => r.brand).filter(Boolean);
}
export const getBrands = unstable_cache(getBrandsUncached, ["products-brands"], CACHE_OPTIONS);

async function getCategoryCountsUncached(): Promise<Record<string, number>> {
  const rows = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .where(eq(products.active, true))
    .groupBy(products.category);
  return Object.fromEntries(rows.map((r) => [r.category, r.count]));
}
export const getCategoryCounts = unstable_cache(getCategoryCountsUncached, ["products-category-counts"], CACHE_OPTIONS);

async function getSubcategoryCountsUncached(category?: string): Promise<Record<string, number>> {
  const rows = await db
    .select({ subcategory: products.subcategory, count: sql<number>`count(*)::int` })
    .from(products)
    .where(category ? and(eq(products.active, true), eq(products.category, category)) : eq(products.active, true))
    .groupBy(products.subcategory);
  return Object.fromEntries(rows.map((r) => [r.subcategory, r.count]));
}
export const getSubcategoryCounts = unstable_cache(getSubcategoryCountsUncached, ["products-subcategory-counts"], CACHE_OPTIONS);

async function getPriceBoundsUncached(): Promise<{ min: number; max: number }> {
  const rows = await db
    .select({
      min: sql<number>`min(${products.price})::int`,
      max: sql<number>`max(${products.price})::int`,
    })
    .from(products)
    .where(eq(products.active, true));
  return rows[0] ?? { min: 0, max: 0 };
}
export const getPriceBounds = unstable_cache(getPriceBoundsUncached, ["products-price-bounds"], CACHE_OPTIONS);

/* ————— Recherche instantanée (header) — non mise en cache, coût faible ————— */
export type SearchHit = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string | null;
};

export async function searchProducts(term: string, limit = 6): Promise<SearchHit[]> {
  const q = term.trim();
  if (q.length < 2) return [];
  const like = `%${q}%`;
  return db
    .select({
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      category: products.category,
      price: products.price,
      image: sql<string | null>`${products.images} ->> 0`,
    })
    .from(products)
    .where(
      and(
        eq(products.active, true),
        or(ilike(products.name, like), ilike(products.brand, like))!,
      ),
    )
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

/* ————— Administration du catalogue — toujours en direct, jamais mis en cache ————— */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function createProduct(values: NewProduct): Promise<Product> {
  const [row] = await db.insert(products).values(values).returning();
  return row;
}

export async function updateProduct(id: number, values: Partial<NewProduct>): Promise<Product | undefined> {
  const [row] = await db
    .update(products)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return row;
}

export async function deleteProduct(id: number): Promise<void> {
  await db.delete(products).where(eq(products.id, id));
}

export async function slugExists(slug: string): Promise<boolean> {
  const rows = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  return rows.length > 0;
}
