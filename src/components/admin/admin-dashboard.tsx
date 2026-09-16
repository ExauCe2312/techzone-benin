"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut, Pencil, Plus, Sparkles, Trash2, Upload, X,
} from "lucide-react";
import type { Product } from "@/db/schema";
import { CATEGORIES, CONDITIONS, SUBCATEGORIES, type CategorySlug } from "@/lib/constants";
import { formatFCFA } from "@/lib/format";
import { compressImage } from "@/lib/compress-image";

type FormState = {
  id: number | null;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  condition: "neuf" | "occasion";
  conditionDetail: string;
  warranty: string;
  notes: string;
  description: string;
  price: string;
  priceNote: string;
  images: string[];
  featured: boolean;
  active: boolean;
};

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  brand: "",
  category: "telephones",
  subcategory: SUBCATEGORIES.telephones[0].slug,
  condition: "neuf",
  conditionDetail: "Neuf",
  warranty: "",
  notes: "",
  description: "",
  price: "",
  priceNote: "",
  images: [],
  featured: false,
  active: true,
};

export default function AdminDashboard({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const subOptions = SUBCATEGORIES[form.category] ?? [];
  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query],
  );

  function startNew() {
    setForm(EMPTY_FORM);
    setError(null);
    setFormOpen(true);
  }

  function startEdit(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category as CategorySlug,
      subcategory: p.subcategory,
      condition: p.condition as "neuf" | "occasion",
      conditionDetail: p.conditionDetail,
      warranty: p.warranty ?? "",
      notes: "",
      description: p.description,
      price: String(p.price),
      priceNote: p.priceNote ?? "",
      images: p.images ?? [],
      featured: p.featured,
      active: p.active,
    });
    setError(null);
    setFormOpen(true);
  }

  async function onGenerate() {
    if (!form.name) {
      setError("Indiquez au moins le nom du produit avant de générer la description.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const sub = subOptions.find((s) => s.slug === form.subcategory);
      const res = await fetch("/api/admin/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          categoryLabel: sub?.label ?? form.category,
          conditionDetail: form.conditionDetail,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de la génération.");
      setForm((f) => ({ ...f, description: data.description }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setGenerating(false);
    }
  }

  async function onUploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const body = new FormData();
      body.append("file", compressed);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi de l'image.");
      setForm((f) => ({ ...f, images: [...f.images, data.url] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (!form.name || !form.price) {
      setError("Le nom et le prix sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const sub = subOptions.find((s) => s.slug === form.subcategory);
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        subcategory: form.subcategory,
        subcategoryLabel: sub?.label,
        condition: form.condition,
        conditionDetail: form.conditionDetail,
        warranty: form.warranty || null,
        description: form.description,
        price: Number(form.price),
        priceNote: form.priceNote || null,
        images: form.images,
        featured: form.featured,
        active: form.active,
      };

      const res = form.id
        ? await fetch(`/api/admin/products/${form.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.join(", ") || data.error || "Échec de l'enregistrement.");

      if (form.id) {
        setProducts((list) => list.map((p) => (p.id === form.id ? data.item : p)));
      } else {
        setProducts((list) => [data.item, ...list]);
      }
      setFormOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Supprimer ce produit du catalogue ?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts((list) => list.filter((p) => p.id !== id));
  }

  async function onToggleActive(p: Product) {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    const data = await res.json();
    if (res.ok) {
      setProducts((list) => list.map((item) => (item.id === p.id ? data.item : item)));
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Espace admin</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
            Gestion du catalogue ({products.length} produits)
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-accent"
          >
            <Plus size={15} /> Ajouter un produit
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink-soft hover:border-accent hover:text-accent"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </div>

      {formOpen ? (
        <div className="glass-strong glass-sheen mt-8 rounded-[1.75rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">
              {form.id ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <button onClick={() => setFormOpen(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/40">
              <X size={16} />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              Nom du produit
              <input className="field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex. Samsung Galaxy A17 128+4" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Marque
              <input className="field" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} placeholder="Ex. Samsung" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Catégorie
              <select
                className="field"
                value={form.category}
                onChange={(e) => {
                  const category = e.target.value as CategorySlug;
                  setForm((f) => ({ ...f, category, subcategory: SUBCATEGORIES[category][0].slug }));
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Sous-catégorie
              <select className="field" value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))}>
                {subOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.label}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              État
              <select
                className="field"
                value={form.condition}
                onChange={(e) => {
                  const condition = e.target.value as "neuf" | "occasion";
                  const label = CONDITIONS.find((c) => c.value === condition)?.label ?? "";
                  setForm((f) => ({ ...f, condition, conditionDetail: label }));
                }}
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Détail de l&apos;état
              <input className="field" value={form.conditionDetail} onChange={(e) => setForm((f) => ({ ...f, conditionDetail: e.target.value }))} placeholder="Ex. Occasion 10/10" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Prix (FCFA)
              <input type="number" className="field" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Ex. 75000" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              Note de prix (optionnel)
              <input className="field" value={form.priceNote} onChange={(e) => setForm((f) => ({ ...f, priceNote: e.target.value }))} placeholder="Ex. / pack" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              Garantie (optionnel)
              <input className="field" value={form.warranty} onChange={(e) => setForm((f) => ({ ...f, warranty: e.target.value }))} placeholder="Ex. Garantie 2 mois + assistance maintenance illimitée" />
            </label>

            <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              Notes / caractéristiques (pour aider l&apos;IA à rédiger)
              <textarea className="field" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Ex. écran 15,6 pouces, i5, 8 Go RAM, SSD 256 Go" />
            </label>

            <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
              <div className="flex items-center justify-between">
                <span>Description</span>
                <button
                  type="button"
                  onClick={onGenerate}
                  disabled={generating}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 disabled:opacity-50"
                >
                  <Sparkles size={13} />
                  {generating ? "Génération…" : "Générer avec l'IA"}
                </button>
              </div>
              <textarea className="field" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Généré automatiquement, ou écrivez la vôtre" />
            </div>

            <div className="flex flex-col gap-2 text-sm sm:col-span-2">
              <span>Photos</span>
              <div className="flex flex-wrap gap-2.5">
                {form.images.map((src, i) => (
                  <div key={src} className="glass relative h-20 w-20 overflow-hidden rounded-xl">
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                    <button
                      onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-white"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <label className="glass flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl text-[11px] text-muted hover:text-accent">
                  {uploading ? "Envoi…" : (
                    <>
                      <Upload size={16} />
                      Ajouter
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onUploadImage(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
              <input type="checkbox" className="check" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
              Mettre en avant sur la page d&apos;accueil
            </label>
            <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
              <input type="checkbox" className="check" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              En stock (visible sur le site — décoche pour marquer comme épuisé)
            </label>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

          <div className="mt-6 flex gap-3">
            <button onClick={onSave} disabled={saving} className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-paper hover:bg-accent disabled:opacity-50">
              {saving ? "Enregistrement…" : form.id ? "Mettre à jour" : "Ajouter au catalogue"}
            </button>
            <button onClick={() => setFormOpen(false)} className="rounded-full border border-line-strong px-6 py-2.5 text-sm font-semibold text-ink-soft">
              Annuler
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        <input
          className="field max-w-sm"
          placeholder="Rechercher un produit…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="glass-strong mt-4 divide-y divide-line overflow-hidden rounded-[1.5rem]">
          {filtered.map((p) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 ${!p.active ? "opacity-60" : ""}`}>
              <div className="glass relative h-14 w-14 flex-none overflow-hidden rounded-xl">
                {p.images?.[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill sizes="56px" className="object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-muted">
                  {p.subcategoryLabel} · {p.conditionDetail}
                  {!p.active ? <span className="ml-1.5 font-semibold text-red-600">· Épuisé</span> : null}
                </p>
              </div>
              <p className="flex-none font-display text-sm font-bold text-accent">{formatFCFA(p.price)}</p>
              <button
                onClick={() => onToggleActive(p)}
                className={`flex-none rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  p.active ? "bg-white/40 text-ink-soft hover:bg-amber-500/15 hover:text-amber-700" : "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25"
                }`}
              >
                {p.active ? "Marquer épuisé" : "Remettre en stock"}
              </button>
              <button onClick={() => startEdit(p)} className="grid h-9 w-9 flex-none place-items-center rounded-full hover:bg-white/40" aria-label="Modifier">
                <Pencil size={15} />
              </button>
              <button onClick={() => onDelete(p.id)} className="grid h-9 w-9 flex-none place-items-center rounded-full text-red-600 hover:bg-red-500/10" aria-label="Supprimer">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {filtered.length === 0 ? <p className="p-6 text-center text-sm text-muted">Aucun produit.</p> : null}
        </div>
      </div>
    </div>
  );
}
