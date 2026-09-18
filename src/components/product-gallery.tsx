"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/db/schema";
import CategoryPlaceholder from "@/components/category-placeholder";

const AUTO_SLIDE_MS = 4500;
const SWIPE_THRESHOLD_PX = 40;

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [];
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!images.length) return;
      setActive(((index % images.length) + images.length) % images.length);
    },
    [images.length],
  );

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Défilement automatique — en pause si l'onglet n'est pas visible ou si la
  // personne préfère moins d'animations ; repart de zéro à chaque navigation
  // manuelle pour ne pas changer l'image juste après un choix volontaire.
  useEffect(() => {
    if (!hasMultiple) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      if (document.visibilityState === "visible") {
        setActive((i) => (i + 1) % images.length);
      }
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, images.length, active]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="glass-strong glass-sheen relative aspect-square overflow-hidden rounded-[2rem]"
        onTouchStart={hasMultiple ? onTouchStart : undefined}
        onTouchEnd={hasMultiple ? onTouchEnd : undefined}
      >
        {images.length ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={images[active]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={active === 0}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <CategoryPlaceholder category={product.category} className="absolute inset-0" />
        )}

        {hasMultiple ? (
          <>
            <button
              onClick={prev}
              aria-label="Photo précédente"
              className="glass absolute left-2.5 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              aria-label="Photo suivante"
              className="glass absolute right-2.5 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => goTo(i)}
                  aria-label={`Aller à la photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => goTo(i)}
              className={`glass relative h-16 w-16 flex-none overflow-hidden rounded-xl transition-opacity ${
                i === active ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`${product.name} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
