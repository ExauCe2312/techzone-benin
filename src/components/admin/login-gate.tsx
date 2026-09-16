"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginGate() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Mot de passe incorrect.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-night px-4 py-16 text-paper">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px] animate-glass-shift"
        aria-hidden="true"
      />

      <div className="glass-dark glass-sheen relative w-full max-w-sm rounded-[1.75rem] p-7">
        <div className="flex items-center gap-2.5 text-amber-400">
          <ShieldAlert size={20} />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Zone réservée</p>
        </div>
        <h1 className="mt-4 font-display text-xl font-extrabold tracking-tight">
          🚨 Vous n&apos;êtes probablement pas censé être ici
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-paper/60">
          Le gardien du catalogue TechZone Bénin surveille cette page en silence. Si vous avez le
          mot de passe, entrez-le. Sinon… demi-tour conseillé. 👀
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
          <div className="relative">
            <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/40" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-10 pr-11 text-sm text-paper outline-none placeholder:text-paper/35 focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper"
              aria-label={show ? "Masquer" : "Afficher"}
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error ? <p className="text-xs font-medium text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-1 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {loading ? "Vérification…" : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
