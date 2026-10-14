import { clamp } from "@/lib/utils";
import type { AppliedCoupon, CartEntry, CartLine, Product } from "./types";

/*
  Pure cart operations. Each entry carries a snapshot of the product, so the
  cart renders and totals correctly regardless of where the product came from
  (WooCommerce or mock) — no catalogue lookup required. Totals are estimates;
  the WooCommerce order is authoritative.
*/

const MAX_QTY = 99;

export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return clamp(Math.round(quantity), 1, MAX_QTY);
}

export function addEntry(
  entries: CartEntry[],
  product: Product,
  quantity: number,
  variant?: string,
): CartEntry[] {
  if (!product.inStock) return entries;

  const existing = entries.find((e) => e.product.id === product.id);
  if (existing) {
    return entries.map((e) =>
      e.product.id === product.id
        ? {
            ...e,
            quantity: normalizeQuantity(e.quantity + quantity),
            variant: variant ?? e.variant,
          }
        : e,
    );
  }
  return [
    ...entries,
    { product, quantity: normalizeQuantity(quantity), variant },
  ];
}

export function updateEntryQuantity(
  entries: CartEntry[],
  productId: string,
  quantity: number,
): CartEntry[] {
  if (quantity <= 0) return removeEntry(entries, productId);
  return entries.map((e) =>
    e.product.id === productId
      ? { ...e, quantity: normalizeQuantity(quantity) }
      : e,
  );
}

export function removeEntry(
  entries: CartEntry[],
  productId: string,
): CartEntry[] {
  return entries.filter((e) => e.product.id !== productId);
}

export function resolveCartLines(entries: CartEntry[]): CartLine[] {
  return entries.map((entry) => {
    const quantity = normalizeQuantity(entry.quantity);
    return {
      product: entry.product,
      quantity,
      variant: entry.variant,
      lineTotal: entry.product.price * quantity,
    };
  });
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

export function cartItemCount(entries: CartEntry[]): number {
  return entries.reduce((sum, e) => sum + e.quantity, 0);
}

/** Discount (in cents) a coupon applies to a subtotal. Preview only. */
export function couponDiscount(
  coupon: AppliedCoupon | null,
  subtotal: number,
): number {
  if (!coupon) return 0;
  const raw =
    coupon.discountType === "percent"
      ? Math.round((subtotal * coupon.amount) / 100)
      : Math.round(coupon.amount * 100); // fixed_cart / fixed_product
  return Math.min(Math.max(raw, 0), subtotal);
}
