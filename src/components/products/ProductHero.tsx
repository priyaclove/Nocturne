"use client";

import { useState } from "react";
import { Check, Minus, Plus, Truck, Leaf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { isOnSale, discountPercent } from "@/lib/commerce/pricing";
import type { Product } from "@/lib/commerce/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { GeneratedPanel } from "./ProductImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Interactive product hero: the image + variant selectors share state, so
 * choosing a colour/size swaps the photo to that variant's image (sourced from
 * WooCommerce variation images, keyed by option value).
 */
export function ProductHero({
  product,
  departmentLabel,
  variantImages,
}: {
  product: Product;
  departmentLabel?: string;
  variantImages: Record<string, string>;
}) {
  const { add } = useCart();
  const onSale = isOnSale(product);
  const outOfStock = !product.inStock;

  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const needsSize = Boolean(product.sizes?.length);

  // Prefer the image for the chosen colour, then size, then the parent image.
  const displayImage =
    (color && variantImages[color]) ||
    (size && variantImages[size]) ||
    product.images[0] ||
    `/products/${product.slug}.jpg`;

  function handleAdd() {
    if (needsSize && !size) {
      setSizeError(true);
      return;
    }
    const variant = [color, size].filter(Boolean).join(" · ") || undefined;
    add(product, qty, variant);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Image */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden border border-line bg-surface">
          <div className="relative aspect-[4/5]">
            <ImageWithFallback
              key={displayImage}
              src={displayImage}
              alt={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              fallback={<GeneratedPanel product={product} />}
            />
          </div>
          <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
            {product.badge && <Badge tone="gold">{product.badge}</Badge>}
            {onSale && <Badge tone="sale">−{discountPercent(product)}%</Badge>}
          </div>
        </div>
      </div>

      {/* Info + purchase */}
      <div>
        <p className="eyebrow text-gold">{departmentLabel}</p>
        <h1 className="mt-4 font-serif text-4xl font-light leading-tight tracking-tight text-ink sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-2 text-muted">{product.subtitle}</p>

        <div className="mt-5 flex items-baseline gap-3">
          <span
            className={cn(
              "tnum text-2xl font-medium",
              onSale ? "text-gold" : "text-ink",
            )}
          >
            {formatMoney(product.price)}
          </span>
          {onSale && product.compareAtPrice && (
            <span className="tnum text-muted line-through">
              {formatMoney(product.compareAtPrice)}
            </span>
          )}
        </div>

        <p className="mt-6 max-w-prose leading-relaxed text-muted">
          {product.description}
        </p>

        {product.details.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {product.details.map((detail) => (
              <li
                key={detail}
                className="flex items-start gap-2.5 text-sm text-ink"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {detail}
              </li>
            ))}
          </ul>
        )}

        {/* Purchase */}
        <div className="mt-8 space-y-6 border-t border-line pt-8">
          {outOfStock ? (
            <div className="border border-line bg-surface p-5">
              <p className="text-ink">Currently sold out</p>
              <p className="mt-1 text-sm text-muted">
                This piece is between runs. Explore related items below.
              </p>
            </div>
          ) : (
            <>
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-muted">
                    Colour — <span className="text-ink">{color}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          "border px-4 py-2 text-sm transition-colors",
                          color === c
                            ? "border-gold text-gold"
                            : "border-line text-ink hover:border-muted",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-muted">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSize(s);
                          setSizeError(false);
                        }}
                        className={cn(
                          "min-w-11 border px-3 py-2 text-sm transition-colors",
                          size === s
                            ? "border-gold text-gold"
                            : "border-line text-ink hover:border-muted",
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p
                      className="mt-2 text-xs text-[var(--color-danger)]"
                      role="alert"
                    >
                      Please select a size.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-stretch gap-3">
                <div className="inline-flex items-center border border-line">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-ink hover:text-gold"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="tnum w-10 text-center text-sm text-ink">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-ink hover:text-gold"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <Button className="flex-1" size="lg" onClick={handleAdd}>
                  Add to bag
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Assurances */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Assurance
            icon={Truck}
            title="Complimentary shipping"
            body="On orders over ₹5,000. Options shown at checkout once connected."
          />
          <Assurance
            icon={Leaf}
            title="Considered packaging"
            body="Recyclable, minimal, and sent with care."
          />
        </div>
      </div>
    </div>
  );
}

function Assurance({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-line p-4">
      <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
      <p className="mt-2 text-sm text-ink">{title}</p>
      <p className="mt-1 text-xs leading-snug text-muted">{body}</p>
    </div>
  );
}
