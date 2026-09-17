"use client";

import { ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/db/schema";
import { formatFCFA } from "@/lib/format";
import { ConditionBadge } from "@/components/ui";
import WhatsAppButton from "@/components/whatsapp-button";

export default function ProductActions({ product }: { product: Product }) {
  return (
    <div className="glass-strong glass-sheen rounded-[1.75rem] p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <ConditionBadge condition={product.condition} detail={product.conditionDetail} />
        {product.warranty ? (
          <span className="glass-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-ink-soft">
            <ShieldCheck size={13} className="text-accent" />
            {product.warranty}
          </span>
        ) : null}
      </div>

      <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {formatFCFA(product.price)}
        {product.priceNote ? (
          <span className="ml-2 align-middle text-sm font-medium text-muted">{product.priceNote}</span>
        ) : null}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{product.description}</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <WhatsAppButton productName={product.name} price={product.price} category={product.subcategoryLabel} size="lg" className="flex-1" />
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Truck size={14} className="text-accent" />
        Livraison partout au Bénin — les modalités sont confirmées avec vous sur WhatsApp.
      </p>
    </div>
  );
}
