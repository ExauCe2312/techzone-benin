"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/* ————— Apparition au scroll ————— */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ————— Titre de section éditorial ————— */
export function SectionHeading({
  eyebrow,
  title,
  action,
  align = "left",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-4 ${
        align === "center" ? "flex-col items-center text-center" : ""
      }`}
    >
      <div>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          {eyebrow}
        </p>
        <h2
          className={`mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05] ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

/* ————— Panneau de verre générique ————— */
export function GlassPanel({
  children,
  className = "",
  strong = false,
  sheen = true,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
  sheen?: boolean;
}) {
  return (
    <div
      className={`${strong ? "glass-strong" : "glass"} ${sheen ? "glass-sheen" : ""} rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}

/* ————— Badge d'état (neuf / occasion) ————— */
export function ConditionBadge({ condition, detail }: { condition: string; detail: string }) {
  const isNeuf = condition === "neuf";
  return (
    <span
      className={`glass-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
        isNeuf ? "text-emerald-800" : "text-amber-800"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isNeuf ? "bg-emerald-500" : "bg-amber-500"}`} />
      {detail}
    </span>
  );
}
