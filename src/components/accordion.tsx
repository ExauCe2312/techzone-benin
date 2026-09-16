"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="glass-strong divide-y divide-line overflow-hidden rounded-[1.5rem]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-ink">{item.title}</span>
              <ChevronDown
                size={16}
                className={`flex-none text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen ? (
              <div className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
