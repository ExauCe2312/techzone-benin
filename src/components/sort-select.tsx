"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";

export default function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("tri") ?? "pertinence";

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "pertinence") next.delete("tri");
    else next.set("tri", value);
    router.push(`/boutique?${next.toString()}`);
  }

  return (
    <div className="glass-pill relative rounded-full">
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full bg-transparent py-2.5 pl-4 pr-9 text-sm font-medium text-ink outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}
