import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductGallery from "@/components/product-gallery";
import ProductActions from "@/components/product-actions";
import ProductCard from "@/components/product-card";
import { SectionHeading } from "@/components/ui";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/constants";

type Params = Promise<{ slug: string }>;

// Même choix que sur la page d'accueil : pas de pré-génération statique au
// build, pour ne pas dépendre de la disponibilité de Supabase à ce moment-là.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.subcategory, product.id, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <nav className="flex items-center gap-1.5 text-xs text-muted">
        <Link href="/" className="hover:text-accent">Accueil</Link>
        <ChevronRight size={12} />
        <Link href={`/boutique?cat=${product.category}`} className="hover:text-accent">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </Link>
        <ChevronRight size={12} />
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} />

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {product.subcategoryLabel}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          {product.brand ? <p className="mt-1 text-sm text-muted">{product.brand}</p> : null}

          <div className="mt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <SectionHeading eyebrow="Vous pourriez aimer" title="Produits similaires" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
