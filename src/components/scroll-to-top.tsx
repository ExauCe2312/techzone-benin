"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 500;

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

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClick}
          aria-label="Retour en haut de la page"
          className="glass-strong glass-sheen fixed bottom-5 left-1/2 z-40 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full text-ink shadow-lg sm:bottom-7"
        >
          <ArrowUp size={19} strokeWidth={2.2} />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
