"use client";

import { useEffect } from "react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { STORE } from "@/lib/constants";
import { whatsappCustomLink } from "@/lib/whatsapp";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Petit souci technique</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink">
        Cette page n&apos;a pas pu s&apos;afficher
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Ce n&apos;est pas grave — le catalogue a peut-être un problème passager. Tu peux réessayer,
        ou nous écrire directement sur WhatsApp pour passer commande quand même.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-accent"
        >
          <RotateCcw size={15} />
          Réessayer
        </button>
        <a
          href={whatsappCustomLink("Bonjour Techzone Bénin, le site a eu un souci technique, pouvez-vous m'aider ?")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp px-6 py-3 text-sm font-semibold"
        >
          <MessageCircle size={16} />
          Écrire sur WhatsApp
        </a>
      </div>

      <p className="mt-6 text-xs text-muted">{STORE.whatsappDisplay}</p>
    </div>
  );
}
