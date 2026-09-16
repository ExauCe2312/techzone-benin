import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import HomeHero, { Marquee } from "@/components/home-hero";
import ProductCard from "@/components/product-card";
import CategoryPlaceholder from "@/components/category-placeholder";
import { Reveal, SectionHeading } from "@/components/ui";
import { getCategoryCounts, getFeaturedProducts, getNewArrivals } from "@/lib/data";
import { CATEGORIES, STORE } from "@/lib/constants";
import { whatsappCustomLink } from "@/lib/whatsapp";

// force-dynamic plutôt qu'une regénération statique : sur le plan gratuit
// Supabase, la base peut se mettre en pause après une période d'inactivité,
// ce qui ferait échouer toute la build si cette page essayait de
// pré-générer au moment du déploiement. Le cache des données (5 min,
// voir lib/data.ts) suffit à réduire la charge sur Supabase sans ce risque.
export const dynamic = "force-dynamic";

const PERKS = [
  {
    icon: Truck,
    title: "Livraison partout au Bénin",
    text: "Les modalités et délais sont confirmés directement avec vous sur WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Neuf & occasion vérifiée",
    text: "Chaque fiche indique clairement l'état du produit et la garantie éventuelle.",
  },
  {
    icon: MessageCircle,
    title: "Commande en un message",
    text: "Un bouton, un message prérempli : votre demande nous arrive directement sur WhatsApp.",
  },
  {
    icon: PackageCheck,
    title: "Large choix",
    text: "Téléphones, ordinateurs, tablettes et accessoires réunis dans un seul catalogue.",
  },
];

export default async function HomePage() {
  const [featured, arrivals, counts] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(4),
    getCategoryCounts(),
  ]);

  const spotlightProduct = featured[0];

  return (
    <>
      <HomeHero
        spotlight={
          spotlightProduct
            ? {
                name: spotlightProduct.name,
                price: spotlightProduct.price,
                slug: spotlightProduct.slug,
                category: spotlightProduct.category,
                image: spotlightProduct.images?.[0] ?? null,
              }
            : null
        }
      />

      <Marquee
        items={[
          "Livraison partout au Bénin",
          "Neuf & occasion vérifiée",
          "Commande directe sur WhatsApp",
          "Téléphones, PC, tablettes & accessoires",
          "Catalogue mis à jour régulièrement",
        ]}
      />

      {/* ————— Catégories ————— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <SectionHeading
          eyebrow="Explorer"
          title={
            <>
              Quatre univers.
              <span className="text-outline"> Un seul catalogue.</span>
            </>
          }
          action={
            <Link
              href="/boutique"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-all hover:border-accent hover:text-accent"
            >
              Tout explorer
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.08}>
              <Link
                href={`/boutique?cat=${cat.slug}`}
                className="glass-strong glass-sheen group relative block h-64 overflow-hidden rounded-[1.75rem]"
              >
                <CategoryPlaceholder category={cat.slug} className="absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-white/90 via-white/40 to-transparent p-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                      {counts[cat.slug] ?? 0} produits
                    </p>
                    <h3 className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">
                      {cat.label}
                    </h3>
                  </div>
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-ink text-paper transition-all duration-300 group-hover:rotate-45 group-hover:bg-accent">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— Sélection ————— */}
      {featured.length > 0 ? (
        <section className="border-y border-line bg-sand/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
            <SectionHeading eyebrow="Sélection du moment" title="Quelques pièces à la une" />
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ————— Nouveautés ————— */}
      {arrivals.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
          <SectionHeading
            eyebrow="Tout juste arrivés"
            title="Les derniers ajouts au catalogue"
            action={
              <Link
                href="/boutique?tri=nouveautes"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-all hover:border-accent hover:text-accent"
              >
                Toutes les nouveautés
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          <div className="hide-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            {arrivals.map((p, i) => (
              <div key={p.id} className="w-[240px] flex-none snap-start sm:w-[270px]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ————— Services ————— */}
      <section className="border-t border-line bg-cream/70">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-20">
          {PERKS.map((perk, i) => (
            <Reveal key={perk.title} delay={i * 0.08}>
              <div className="glass group h-full rounded-3xl p-6 transition-colors">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-paper transition-colors duration-300 group-hover:bg-accent">
                  <perk.icon size={20} strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{perk.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— CTA WhatsApp ————— */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:pb-28">
        <Reveal>
          <div className="glass-dark glass-sheen relative overflow-hidden rounded-[2.5rem] px-6 py-14 sm:px-12 lg:px-16">
            <div
              className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
                  Une question avant de commander ?
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl lg:leading-[1.05]">
                  Écrivez-nous directement sur WhatsApp
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-paper/75">
                  {STORE.name} répond sur WhatsApp au {STORE.whatsappDisplay} — {STORE.hours}.
                </p>
              </div>
              <a
                href={whatsappCustomLink("Bonjour Techzone Bénin, j'ai une question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-none px-7 py-3.5 text-sm font-semibold"
              >
                <MessageCircle size={17} />
                Ouvrir la discussion
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
