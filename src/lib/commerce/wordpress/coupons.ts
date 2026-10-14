import { isWordPressConfigured } from "./config";
import { wooFetch } from "./client";

/*
  Coupon lookup against the WooCommerce REST API. Server-only.
  Used by the /api/coupon route so the storefront can validate a promo code
  without exposing the API keys to the browser.
*/

interface WooCoupon {
  code: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  amount: string;
  free_shipping: boolean;
  date_expires: string | null;
}

export interface CouponResult {
  code: string;
  /** "percent" | "fixed_cart" | "fixed_product" */
  discountType: string;
  /** Percentage (for percent) or currency amount (for fixed_*). */
  amount: number;
  freeShipping: boolean;
}

export async function getCoupon(code: string): Promise<CouponResult | null> {
  if (!isWordPressConfigured()) return null;
  try {
    const list = await wooFetch<WooCoupon[]>("coupons", {
      code: code.trim().toLowerCase(),
    });
    const c = list[0];
    if (!c) return null;

    // Reject expired coupons.
    if (c.date_expires) {
      const expires = new Date(c.date_expires).getTime();
      if (Number.isFinite(expires) && expires < Date.now()) return null;
    }

    return {
      code: c.code.toUpperCase(),
      discountType: c.discount_type,
      amount: Number.parseFloat(c.amount || "0"),
      freeShipping: Boolean(c.free_shipping),
    };
  } catch (err) {
    console.error("[commerce] Coupon lookup failed.", err);
    return null;
  }
}
