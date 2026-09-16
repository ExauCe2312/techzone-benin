"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/db/schema";
import CategoryPlaceholder from "@/components/category-placeholder";

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="glass-strong glass-sheen relative aspect-square overflow-hidden rounded-[2rem]">
        {images.length ? (
          <Image
            src={images[active]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <CategoryPlaceholder category={product.category} className="absolute inset-0" />
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2.5">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
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
