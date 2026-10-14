import type { Product } from "./types";

/*
  Display pricing helpers. Figures are for presentation only — a real backend
  would validate the authoritative price at checkout.
*/

export function isOnSale(product: Product): boolean {
  if (product.onSale) return true;
  return (
    product.compareAtPrice !== undefined && product.compareAtPrice > product.price
  );
}

/** Whole-number percent off, or 0 when not on sale. */
export function discountPercent(product: Product): number {
  if (!isOnSale(product) || !product.compareAtPrice) return 0;
  return Math.round(
    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
  );
}
