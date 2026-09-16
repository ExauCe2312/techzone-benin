import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-28 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Erreur 404</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Le produit ou la page que vous cherchez n&apos;est plus disponible.
      </p>
      <Link
        href="/boutique"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
      >
        Retour au catalogue
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
