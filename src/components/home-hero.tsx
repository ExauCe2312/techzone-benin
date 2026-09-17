"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/db/schema";
import { formatFCFA } from "@/lib/format";
import { STORE } from "@/lib/constants";
import { whatsappCustomLink } from "@/lib/whatsapp";
import CategoryPlaceholder from "@/components/category-placeholder";
import WhatsAppButton from "@/components/whatsapp-button";

export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="hide-scrollbar overflow-hidden border-y border-line bg-cream/70 py-3 backdrop-blur">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {item}
            <span className="text-accent">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomeHero({
  spotlight,
}: {
  spotlight: { name: string; price: number; slug: string; category: string; image: string | null } | null;
}) {
  return (
    <section className="relative overflow-hidden bg-night text-paper">
      <div
        className="pointer-events-none absolute -top-24 left-[10%] h-96 w-96 rounded-full bg-accent/14 blur-[110px] animate-glass-shift"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-[5%] h-[26rem] w-[26rem] rounded-full bg-gold/12 blur-[130px] animate-glass-shift"
        style={{ animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <div>
          <div className="glass-dark glass-sheen inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper/80">
            <Sparkles size={12} className="text-accent" />
            Catalogue en ligne
          </div>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Le bon appareil,
            <br />
            au bon prix.
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/70">
            Téléphones, ordinateurs, tablettes et accessoires — parcourez le catalogue TechZone
            Bénin et commandez en un message, directement sur WhatsApp.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/boutique"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Voir le catalogue
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappCustomLink("Bonjour Techzone Bénin, j'aimerais des conseils sur un produit.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-6 py-3.5 text-sm font-semibold"
            >
              <MessageCircle size={16} />
              Discuter sur WhatsApp
            </a>
          </div>

          <p className="mt-8 text-xs text-paper/45">{STORE.address} · {STORE.hours}</p>
        </div>

        {spotlight ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm animate-float"
          >
            <div className="glass-dark glass-sheen overflow-hidden rounded-[2rem] p-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                {spotlight.image ? (
                  <Image src={spotlight.image} alt={spotlight.name} fill sizes="380px" className="object-cover" />
                ) : (
                  <CategoryPlaceholder category={spotlight.category} className="absolute inset-0" />
                )}
              </div>
              <div className="p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">En vedette</p>
                <h3 className="mt-1 font-display text-lg font-bold leading-snug">{spotlight.name}</h3>
                <p className="mt-1 font-display text-2xl font-extrabold text-accent">
                  {formatFCFA(spotlight.price)}
                </p>
                <WhatsAppButton productName={spotlight.name} className="mt-3 w-full" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
