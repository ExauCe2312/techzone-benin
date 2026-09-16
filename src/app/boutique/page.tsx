import type { Metadata } from "next";
import ProductCard from "@/components/product-card";
import ShopFilters from "@/components/shop-filters";
import SortSelect from "@/components/sort-select";
import { SectionHeading } from "@/components/ui";
import { getBrands, getPriceBounds, getProducts } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Parcourez le catalogue TechZone Bénin et commandez directement sur WhatsApp.",
};

type SearchParams = Promise<{
  cat?: string;
  sub?: string;
  q?: string;
  marques?: string;
  prixMin?: string;
  prixMax?: string;
  etat?: string;
  tri?: string;
}>;

export default async function BoutiquePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const filters = {
    cat: sp.cat,
    sub: sp.sub,
    q: sp.q,
    marques: sp.marques?.split(",").filter(Boolean),
    prixMin: sp.prixMin ? Number(sp.prixMin) : undefined,
    prixMax: sp.prixMax ? Number(sp.prixMax) : undefined,
    condition: (sp.etat === "neuf" || sp.etat === "occasion" ? sp.etat : undefined) as
      | "neuf"
      | "occasion"
      | undefined,
    sort: sp.tri,
  };

  const [items, brands, priceBounds] = await Promise.all([
    getProducts(filters),
    getBrands(sp.cat),
    getPriceBounds(),
  ]);

  const title = sp.cat ? CATEGORY_LABELS[sp.cat] ?? "Boutique" : "Toute la boutique";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-18">
      <SectionHeading
        eyebrow="Catalogue"
        title={title}
        action={<SortSelect />}
      />

      {sp.q ? (
        <p className="mt-4 text-sm text-muted">
          Résultats pour « {sp.q} » — {items.length} produit{items.length > 1 ? "s" : ""}
        </p>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ShopFilters brands={brands} priceBounds={priceBounds} />
        </aside>

        <div>
          {items.length === 0 ? (
            <div className="glass-strong rounded-[1.75rem] p-12 text-center">
              <p className="font-display text-lg font-bold text-ink">Aucun produit ne correspond</p>
              <p className="mt-2 text-sm text-muted">
                Essayez d&apos;élargir votre recherche ou de réinitialiser les filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
