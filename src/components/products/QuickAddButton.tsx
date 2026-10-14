"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/commerce/types";

/** Compact add-to-bag on product cards; opens the mini-cart via the context. */
export function QuickAddButton({ product }: { product: Product }) {
  const { add } = useCart();

  if (!product.inStock) {
    return (
      <span className="eyebrow border border-line px-3 py-2 text-muted">
        Sold out
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Add ${product.name} to bag`}
      onClick={() => add(product, 1)}
      className="relative z-10 inline-flex items-center gap-1.5 border border-line bg-bg/80 px-3 py-2 text-xs text-ink backdrop-blur transition-colors hover:border-gold hover:text-gold"
    >
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      Add to bag
    </button>
  );
}
