"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { formatFCFA } from "@/lib/format";
import type { SearchHit } from "@/lib/data";

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Réinitialise la recherche à chaque nouvelle ouverture (motif recommandé par React :
  // ajuster l'état pendant le rendu plutôt que dans un effet, pour éviter un rendu en cascade).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTerm("");
      setResults([]);
    }
  }

  useEffect(() => {
    const query = term.trim();
    if (query.length < 2) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- état de chargement classique avant un fetch async, sans risque de rendu en cascade ici.
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/recherche?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  if (!open) return null;

  const showResults = term.trim().length >= 2 ? results : [];

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-night/55 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-[8vh] w-[92vw] max-w-xl">
        <div className="glass-strong glass-sheen rounded-[1.75rem] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-muted" />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Rechercher un produit, une marque…"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            />
            <button onClick={onClose} aria-label="Fermer" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/40">
              <X size={16} />
            </button>
          </div>

          {loading ? <p className="mt-4 text-xs text-muted">Recherche…</p> : null}

          {showResults.length > 0 ? (
            <div className="mt-4 flex flex-col gap-1 border-t border-line pt-3">
              {showResults.map((r) => (
                <Link
                  key={r.slug}
                  href={`/produit/${r.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/40"
                >
                  <span className="relative h-12 w-12 flex-none overflow-hidden rounded-xl bg-sand">
                    {r.image ? (
                      <Image src={r.image} alt={r.name} fill sizes="48px" className="object-cover" />
                    ) : null}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-ink">{r.name}</span>
                    <span className="block text-xs text-muted">{r.brand}</span>
                  </span>
                  <span className="text-sm font-bold text-accent">{formatFCFA(r.price)}</span>
                </Link>
              ))}
            </div>
          ) : term.trim().length >= 2 && !loading ? (
            <p className="mt-4 text-sm text-muted">Aucun résultat pour « {term} ».</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
