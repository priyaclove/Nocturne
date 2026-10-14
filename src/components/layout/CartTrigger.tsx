"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

/** Header bag button — opens the mini-cart drawer and shows a live count. */
export function CartTrigger() {
  const { count, hydrated, openDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`Open bag${hydrated && count > 0 ? `, ${count} items` : ""}`}
      className="group relative inline-flex items-center gap-2 text-ink transition-colors hover:text-gold"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      <span className="eyebrow hidden sm:inline">Bag</span>
      {hydrated && count > 0 && (
        <span className="tnum absolute -right-2.5 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.625rem] font-semibold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
