"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/db/schema";
import { formatFCFA } from "@/lib/format";
import { ConditionBadge, GlassPanel } from "@/components/ui";
import CategoryPlaceholder from "@/components/category-placeholder";
import WhatsAppButton from "@/components/whatsapp-button";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const image = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassPanel className="group flex h-full flex-col overflow-hidden" strong>
        <Link href={`/produit/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <CategoryPlaceholder category={product.category} className="absolute inset-0" />
            )}
            <div className="absolute left-2.5 top-2.5">
              <ConditionBadge condition={product.condition} detail={product.conditionDetail} />
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {product.subcategoryLabel}
          </p>
          <Link href={`/produit/${product.slug}`}>
            <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug tracking-tight text-ink">
              {product.name}
            </h3>
          </Link>
          <p className="mt-auto font-display text-lg font-extrabold tracking-tight text-accent">
            {formatFCFA(product.price)}
            {product.priceNote ? (
              <span className="ml-1 text-xs font-medium text-muted">{product.priceNote}</span>
            ) : null}
          </p>
          <WhatsAppButton productName={product.name} size="sm" className="w-full" />
        </div>
      </GlassPanel>
    </motion.div>
  );
}
