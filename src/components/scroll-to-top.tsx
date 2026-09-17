"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 600;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Retour en haut de la page"
      className="glass-strong glass-sheen fixed bottom-5 right-4 z-40 grid h-12 w-12 place-items-center rounded-full text-ink shadow-lg transition-transform duration-200 hover:-translate-y-1 sm:bottom-7 sm:right-7"
    >
      <ArrowUp size={19} strokeWidth={2.2} />
    </button>
  );
}
