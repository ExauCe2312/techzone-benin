"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CONDITIONS, SUBCATEGORIES, type CategorySlug } from "@/lib/constants";
import { formatFCFA } from "@/lib/format";

export default function ShopFilters({
  brands,
  priceBounds,
}: {
  brands: string[];
  priceBounds: { min: number; max: number };
}) {
  const router = useRouter();
  const params = useSearchParams();

  const cat = params.get("cat") ?? "";
  const sub = params.get("sub") ?? "";
  const condition = params.get("etat") ?? "";
  const activeBrands = params.get("marques")?.split(",").filter(Boolean) ?? [];

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.push(`/boutique?${next.toString()}`);
  }

  function setCategory(value: string) {
    update((p) => {
      if (value === cat) {
        p.delete("cat");
      } else {
        p.set("cat", value);
      }
      p.delete("sub");
    });
  }

  function setSub(value: string) {
    update((p) => {
      if (value === sub) p.delete("sub");
      else p.set("sub", value);
    });
  }

  function toggleBrand(brand: string) {
    update((p) => {
      const set = new Set(activeBrands);
      if (set.has(brand)) set.delete(brand);
      else set.add(brand);
      if (set.size) p.set("marques", Array.from(set).join(","));
      else p.delete("marques");
    });
  }

  function setCondition(value: string) {
    update((p) => {
      if (value === condition) p.delete("etat");
      else p.set("etat", value);
    });
  }

  return (
    <div className="glass-strong glass-sheen flex flex-col gap-6 rounded-[1.75rem] p-5">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Catégorie</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                cat === c.slug ? "bg-ink text-paper" : "text-ink-soft hover:bg-white/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {cat && SUBCATEGORIES[cat as CategorySlug]?.length > 1 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Sous-catégorie</p>
          <div className="flex flex-wrap gap-1.5">
            {SUBCATEGORIES[cat as CategorySlug].map((s) => (
              <button
                key={s.slug}
                onClick={() => setSub(s.slug)}
                className={`glass-pill rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  sub === s.slug ? "bg-accent text-white border-accent" : "text-ink-soft"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">État</p>
        <div className="flex gap-1.5">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCondition(c.value)}
              className={`glass-pill rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                condition === c.value ? "bg-ink text-paper border-ink" : "text-ink-soft"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {brands.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Marque</p>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
            {brands.map((b) => (
              <label key={b} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  className="check"
                  checked={activeBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted">Budget</p>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{formatFCFA(priceBounds.min)}</span>
          <span className="h-px flex-1 bg-line-strong" />
          <span>{formatFCFA(priceBounds.max)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={params.get("prixMin") ?? ""}
            onBlur={(e) => update((p) => (e.target.value ? p.set("prixMin", e.target.value) : p.delete("prixMin")))}
            className="field !py-2 text-xs"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={params.get("prixMax") ?? ""}
            onBlur={(e) => update((p) => (e.target.value ? p.set("prixMax", e.target.value) : p.delete("prixMax")))}
            className="field !py-2 text-xs"
          />
        </div>
      </div>

      {cat || sub || condition || activeBrands.length ? (
        <button
          onClick={() => router.push("/boutique")}
          className="text-left text-xs font-semibold text-accent underline underline-offset-2"
        >
          Réinitialiser les filtres
        </button>
      ) : null}
    </div>
  );
}
