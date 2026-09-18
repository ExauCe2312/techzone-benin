"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Send, Sparkles, X } from "lucide-react";
import type { Product } from "@/db/schema";
import type { ProposedAction } from "@/lib/agent";
import { formatFCFA } from "@/lib/format";

type ChatMessage = {
  role: "user" | "model";
  text: string;
  proposedAction?: ProposedAction;
  status?: "pending" | "applied" | "dismissed";
};

const SUGGESTIONS = [
  "Ajoute un iPhone 11 64Go à 185000 FCFA, neuf",
  "Change le prix du Redmi Note 14 Pro à 95000 FCFA",
  "Complète les caractéristiques du Tecno Spark 50",
];

export default function CatalogAgent({ onProductChange }: { onProductChange: (product: Product) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [applyingAt, setApplyingAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Erreur de l'agent.");
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply,
          proposedAction: data.proposedAction,
          status: data.proposedAction ? "pending" : undefined,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  async function applyAction(index: number, action: ProposedAction) {
    setApplyingAt(index);
    setError(null);
    try {
      const res =
        action.type === "create"
          ? await fetch("/api/admin/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(action.fields),
            })
          : await fetch(`/api/admin/products/${action.productId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(action.fields),
            });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === "string" ? data.error : "Échec de l'application.");
      setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, status: "applied" } : m)));
      onProductChange(data.item as Product);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setApplyingAt(null);
    }
  }

  function dismiss(index: number) {
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, status: "dismissed" } : m)));
  }

  return (
    <div className="glass-strong glass-sheen flex h-[70vh] max-h-[720px] flex-col rounded-[1.75rem] p-4 sm:p-5">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent/15 text-accent">
          <Sparkles size={15} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Assistant catalogue</p>
          <p className="text-xs text-muted">Décris ce que tu veux ajouter ou modifier, en une phrase.</p>
        </div>
        <button
          onClick={() => send("Analyse mon catalogue et propose-moi une amélioration concrète sur un produit, avec ton explication.")}
          disabled={loading}
          className="glass-pill inline-flex flex-none items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-accent disabled:opacity-50"
        >
          <Sparkles size={12} />
          Suggestion
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="glass rounded-2xl px-3.5 py-2.5 text-left text-xs text-ink-soft hover:bg-white/50"
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"}`}>
              <div
                className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-ink text-paper" : "glass text-ink-soft"
                }`}
              >
                {m.text}
              </div>

              {m.proposedAction ? (
                <div className="glass-strong mt-2 rounded-2xl border border-accent/25 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {m.proposedAction.type === "create" ? "Nouveau produit" : "Modification proposée"}
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-xs text-ink-soft">
                    {m.proposedAction.type === "create" ? (
                      <>
                        <p className="font-semibold text-ink">{m.proposedAction.fields.name}</p>
                        <p>{formatFCFA(m.proposedAction.fields.price)} · {m.proposedAction.fields.conditionDetail}</p>
                        <p>{m.proposedAction.fields.description}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-ink">{m.proposedAction.productName}</p>
                        {Object.entries(m.proposedAction.fields).map(([k, v]) => (
                          <p key={k}>
                            {k} → {String(v)}
                          </p>
                        ))}
                      </>
                    )}
                  </div>

                  {m.status === "applied" ? (
                    <p className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <Check size={13} /> Appliqué
                    </p>
                  ) : m.status === "dismissed" ? (
                    <p className="mt-2.5 text-xs font-semibold text-muted">Ignoré</p>
                  ) : (
                    <div className="mt-2.5 flex gap-2">
                      <button
                        onClick={() => applyAction(i, m.proposedAction!)}
                        disabled={applyingAt === i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {applyingAt === i ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Appliquer
                      </button>
                      <button
                        onClick={() => dismiss(i)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-xs font-semibold text-ink-soft"
                      >
                        <X size={12} />
                        Ignorer
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {loading ? (
          <div className="flex justify-start">
            <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs text-muted">
              <Loader2 size={13} className="animate-spin" />
              Réflexion…
            </div>
          </div>
        ) : null}
      </div>

      {error ? <p className="mb-2 text-xs font-medium text-red-600">{error}</p> : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line pt-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex. Ajoute un Samsung Galaxy A17 128Go à 92000 FCFA"
          className="field flex-1 !py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="grid h-10 w-10 flex-none place-items-center rounded-full bg-ink text-paper disabled:opacity-40"
          aria-label="Envoyer"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
