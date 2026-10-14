import { isWordPressConfigured } from "./config";
import { wooFetch, wooPost } from "./client";

/*
  Order creation. Builds a WooCommerce order from the cart and POSTs it, so the
  order is created and managed entirely inside WooCommerce (WooCommerce →
  Orders). Prices, stock and the coupon discount are all calculated by
  WooCommerce — the frontend never sets amounts.

  Requires an API key with READ/WRITE permission.
*/

interface WooVariationLite {
  id: number;
  stock_status: string;
  attributes: { name: string; option: string }[];
}

interface WooOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
  /** Chosen variant label, e.g. "Black" or "Black · M". */
  variant?: string;
}

export interface BillingInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address_1: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

export interface CreatedOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
}

interface OrderLine {
  product_id: number;
  quantity: number;
  variation_id?: number;
}

/** Pick the variation that matches a chosen variant label, else a sensible default. */
function matchVariation(
  variations: WooVariationLite[],
  variant?: string,
): WooVariationLite | undefined {
  if (variations.length === 0) return undefined;
  if (variant) {
    const tokens = variant.split("·").map((t) => t.trim());
    const found = variations.find((v) =>
      v.attributes.every((a) => tokens.includes(a.option)),
    );
    if (found) return found;
  }
  return variations.find((v) => v.stock_status === "instock") ?? variations[0];
}

export async function createOrder({
  items,
  billing,
  couponCode,
}: {
  items: CheckoutItem[];
  billing: BillingInfo;
  couponCode?: string | null;
}): Promise<CreatedOrder> {
  if (!isWordPressConfigured()) {
    throw new Error("WordPress is not configured.");
  }
  if (items.length === 0) throw new Error("Cart is empty.");

  const variationCache = new Map<string, WooVariationLite[]>();
  const lineItems: OrderLine[] = [];

  for (const item of items) {
    let variations = variationCache.get(item.productId);
    if (!variations) {
      try {
        variations = await wooFetch<WooVariationLite[]>(
          `products/${item.productId}/variations`,
          { per_page: 100 },
        );
      } catch {
        variations = [];
      }
      variationCache.set(item.productId, variations);
    }

    const line: OrderLine = {
      product_id: Number(item.productId),
      quantity: item.quantity,
    };
    const match = matchVariation(variations, item.variant);
    if (match) line.variation_id = match.id;
    lineItems.push(line);
  }

  const payload = {
    status: "pending", // no payment gateway yet — awaits payment
    set_paid: false,
    billing,
    shipping: {
      first_name: billing.first_name,
      last_name: billing.last_name,
      address_1: billing.address_1,
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country,
    },
    line_items: lineItems,
    ...(couponCode ? { coupon_lines: [{ code: couponCode }] } : {}),
  };

  const order = await wooPost<WooOrder>("orders", payload);
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    total: order.total,
    currency: order.currency,
  };
}
