import { NextResponse } from "next/server";
import { getCoupon } from "@/lib/commerce/wordpress/coupons";

/**
 * GET /api/coupon?code=OMNI40
 * Validates a promo code against WooCommerce (server-side, keys never exposed)
 * and returns its discount shape for the cart to apply.
 *
 * This validates and previews the discount; the authoritative application still
 * happens at real checkout against WooCommerce.
 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code")?.trim() ?? "";
  if (!code) {
    return NextResponse.json({ valid: false, error: "Enter a code." });
  }

  const coupon = await getCoupon(code);
  if (!coupon) {
    return NextResponse.json({
      valid: false,
      error: "That code isn’t valid or has expired.",
    });
  }

  return NextResponse.json({ valid: true, coupon });
}
