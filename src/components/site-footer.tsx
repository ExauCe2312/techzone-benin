import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { CATEGORIES, STORE } from "@/lib/constants";
import { whatsappCustomLink } from "@/lib/whatsapp";

export default function SiteFooter() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-night text-paper">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[110px] animate-glass-shift"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative h-10 w-10 flex-none overflow-hidden rounded-xl">
                <Image src="/logo.png" alt={STORE.name} fill sizes="40px" className="object-cover" />
              </span>
              <span className="font-display text-base font-extrabold tracking-tight">
                TechZone<span className="text-accent">Bénin</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/65">
              Catalogue téléphones, ordinateurs, tablettes & accessoires. Toutes les commandes se
              concluent directement sur WhatsApp.
            </p>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">Catégories</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/75">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/boutique?cat=${c.slug}`} className="transition-colors hover:text-accent">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">Infos</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/75">
              <li>{STORE.address}</li>
              <li>{STORE.hours}</li>
              <li>{STORE.whatsappDisplay}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">Une question ?</p>
            <a
              href={whatsappCustomLink("Bonjour Techzone Bénin, j'ai une question sur un produit.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-4 inline-flex px-5 py-2.5 text-sm font-semibold"
            >
              <MessageCircle size={16} />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-paper/45 sm:flex-row">
          <p>© {new Date().getFullYear()} TechZone Bénin. Tous droits réservés.</p>
          <p>Abomey-Calavi, Bénin</p>
        </div>
      </div>
    </footer>
  );
}
