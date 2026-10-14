"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { getDepartment } from "@/lib/commerce/products";
import { ProductImage } from "@/components/products/ProductImage";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 500000; // cents (₹5,000)

export default function CartPage() {
  const {
    hydrated,
    lines,
    subtotal,
    count,
    update,
    remove,
    clear,
    coupon,
    applyCoupon,
    discount,
    total,
  } = useCart();

  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function submitCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupon?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        applyCoupon(data.coupon);
        setCouponError(null);
      } else {
        applyCoupon(null);
        setCouponError(data.error ?? "That code isn’t valid.");
      }
    } catch {
      setCouponError("Couldn’t check that code. Try again.");
    } finally {
      setChecking(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <p className="text-sm text-muted">Loading your bag…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-9 w-9 text-faint" aria-hidden="true" />
        <h1 className="mt-5 font-serif text-3xl font-light text-ink">
          Your bag is empty
        </h1>
        <p className="mt-2 text-sm text-muted">
          When you add pieces, they will gather here.
        </p>
        <div className="mt-8">
          <Button href="/shop" size="lg">
            Explore the collection
          </Button>
        </div>
      </div>
    );
  }

  const freeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.freeShipping;
  const shippingNote = freeShipping
    ? "Complimentary"
    : `Add ${formatMoney(FREE_SHIPPING_THRESHOLD - subtotal)} for free shipping`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Bag" }]} />

      <div className="mt-6 flex items-end justify-between border-b border-line pb-6">
        <h1 className="font-serif text-4xl font-light tracking-tight text-ink sm:text-5xl">
          Your Bag <span className="tnum text-xl text-muted">({count})</span>
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted transition-colors hover:text-[var(--color-danger)]"
        >
          Clear bag
        </button>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_22rem]">
        {/* line items */}
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.product.id} className="flex gap-5 py-6">
              <Link
                href={`/products/${line.product.slug}`}
                className="w-24 shrink-0 overflow-hidden border border-line bg-surface sm:w-28"
              >
                <ProductImage product={line.product} />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="eyebrow text-muted">
                      {getDepartment(line.product.department)?.label}
                    </p>
                    <Link
                      href={`/products/${line.product.slug}`}
                      className="mt-1 block font-serif text-xl font-light text-ink hover:text-gold"
                    >
                      {line.product.name}
                    </Link>
                    {line.variant && (
                      <p className="mt-1 text-sm text-muted">{line.variant}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.product.id)}
                    aria-label={`Remove ${line.product.name}`}
                    className="h-fit text-muted transition-colors hover:text-[var(--color-danger)]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="inline-flex items-center border border-line">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => update(line.product.id, line.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center text-ink hover:text-gold"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="tnum w-10 text-center text-sm text-ink">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => update(line.product.id, line.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center text-ink hover:text-gold"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <span className="tnum text-base font-medium text-ink">
                    {formatMoney(line.lineTotal)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* summary */}
        <aside className="h-fit border border-line p-6 lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl font-light text-ink">
            Order summary
          </h2>

          {/* promo code */}
          <div className="mt-5 border-b border-line pb-5">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xs border border-gold/40 bg-gold/5 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-ink">
                  <Tag className="h-4 w-4 text-gold" aria-hidden="true" />
                  <span className="font-medium">{coupon.code}</span> applied
                </span>
                <button
                  type="button"
                  onClick={() => {
                    applyCoupon(null);
                    setCode("");
                  }}
                  aria-label="Remove coupon"
                  className="text-muted hover:text-[var(--color-danger)]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form onSubmit={submitCoupon}>
                <label htmlFor="promo" className="eyebrow text-muted">
                  Promo code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="h-11 flex-1 border border-line bg-transparent px-3 text-sm uppercase tracking-wider text-ink placeholder:text-faint focus:border-gold focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={checking || !code.trim()}
                    className={cn(
                      "h-11 border px-4 text-sm transition-colors",
                      checking || !code.trim()
                        ? "border-line text-faint"
                        : "border-gold text-gold hover:bg-gold hover:text-bg",
                    )}
                  >
                    {checking ? "…" : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p
                    className="mt-2 text-xs text-[var(--color-danger)]"
                    role="alert"
                  >
                    {couponError}
                  </p>
                )}
              </form>
            )}
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Subtotal" value={formatMoney(subtotal)} />
            {discount > 0 && (
              <Row
                label={`Discount (${coupon?.code})`}
                value={`− ${formatMoney(discount)}`}
                accent
              />
            )}
            <Row label="Shipping" value={shippingNote} muted={!freeShipping} />
            <Row label="Taxes" value="Calculated at checkout" muted />
            <div className="border-t border-line pt-3">
              <Row label="Estimated total" value={formatMoney(total)} emphasize />
            </div>
          </dl>

          <div className="mt-6">
            <Button href="/checkout" className="w-full" size="lg">
              Proceed to checkout
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-faint">
            Your order is created and managed in WooCommerce. Totals and any
            coupon are confirmed by the store.
          </p>

          <Link
            href="/shop"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  emphasize,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  emphasize?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={emphasize ? "font-medium text-ink" : "text-muted"}>
        {label}
      </dt>
      <dd
        className={
          emphasize
            ? "tnum text-lg font-medium text-ink"
            : accent
              ? "tnum text-[var(--color-ok)]"
              : muted
                ? "text-right text-xs text-muted"
                : "tnum text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
