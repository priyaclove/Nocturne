"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SORT_LABELS } from "@/lib/commerce/filtering";
import type { SortOption } from "@/lib/commerce/types";

const OPTIONS = Object.keys(SORT_LABELS) as SortOption[];

export function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "featured";

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="eyebrow">Sort</span>
      <span className="relative">
        <select
          aria-label="Sort products"
          value={current}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            if (e.target.value === "featured") params.delete("sort");
            else params.set("sort", e.target.value);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="h-10 appearance-none border border-line bg-transparent pl-3 pr-9 text-sm text-ink focus:border-gold focus:outline-none"
        >
          {OPTIONS.map((o) => (
            <option key={o} value={o} className="bg-bg text-ink">
              {SORT_LABELS[o]}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
