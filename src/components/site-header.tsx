"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { CATEGORIES, STORE } from "@/lib/constants";
import SearchOverlay from "@/components/search-overlay";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="glass-pill glass-sheen mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 sm:px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative h-9 w-9 flex-none overflow-hidden rounded-xl sm:h-10 sm:w-10">
              <Image src="/logo.png" alt={STORE.name} fill sizes="40px" className="object-cover" />
            </span>
            <span className="hidden font-display text-base font-extrabold tracking-tight sm:block">
              TechZone<span className="text-accent">Bénin</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/boutique?cat=${c.slug}`}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-white/40 hover:text-ink"
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/40 hover:text-ink"
            >
              <Search size={17} />
            </button>
            <Link
              href="/boutique"
              className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent sm:block"
            >
              Voir le catalogue
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/40 hover:text-ink lg:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {open ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-night/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="glass-strong glass-sheen absolute right-3 top-3 w-[85vw] max-w-sm rounded-[1.75rem] p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-extrabold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/40"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/boutique?cat=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-3 py-3 text-[15px] font-semibold text-ink-soft transition-colors hover:bg-white/40 hover:text-ink"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href="/boutique"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-2xl bg-ink px-3 py-3 text-center text-[15px] font-semibold text-paper"
              >
                Voir tout le catalogue
              </Link>
            </nav>
          </div>
        </div>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
