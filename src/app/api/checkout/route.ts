import { NextResponse } from "next/server";
import { createOrder } from "@/lib/commerce/wordpress/orders";

/**
 * POST /api/checkout
 * Creates a real WooCommerce order from the cart. WooCommerce owns the order,
 * prices, stock and coupon discount. Keys stay server-side.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, billing, couponCode } = body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Your bag is empty." },
        { status: 400 },
      );
    }
    if (!billing?.email || !billing?.first_name || !billing?.address_1) {
      return NextResponse.json(
        { ok: false, error: "Please fill in the required details." },
        { status: 400 },
      );
    }

    const order = await createOrder({ items, billing, couponCode });
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    console.error("[checkout] order creation failed", err);
    const msg = err instanceof Error ? err.message : "";
    const hint =
      msg.includes("401") || msg.includes("403")
        ? "Your WooCommerce API key needs Read/Write permission."
        : "Please try again.";
    return NextResponse.json(
      { ok: false, error: `Couldn’t place the order. ${hint}` },
      { status: 500 },
    );
  }
}
