import Link from "next/link";
import { getDepartment } from "@/lib/commerce/products";
import { discountPercent, isOnSale } from "@/lib/commerce/pricing";
import type { Product } from "@/lib/commerce/types";
import { ProductImage } from "./ProductImage";
import { ProductPrice } from "./ProductPrice";
import { QuickAddButton } from "./QuickAddButton";
import { Badge } from "@/components/ui/Badge";

const BADGE_LABELS: Record<string, string> = {
  new: "New",
  limited: "Limited",
  bestseller: "Bestseller",
};

/**
 * Product card. The title is the real link with an overlay extending its hit
 * area; the quick-add button layers above it (valid link + button semantics).
 */
export function ProductCard({ product }: { product: Product }) {
  const department = getDepartment(product.department);
  const onSale = isOnSale(product);

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden border border-line/50 bg-surface transition-colors duration-500 group-hover:border-[color-mix(in_srgb,var(--color-gold)_40%,transparent)]">
        <div className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
          <ProductImage product={product} />
        </div>

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <Badge tone="gold">{BADGE_LABELS[product.badge]}</Badge>
          )}
          {onSale && (
            <Badge tone="sale">
              {discountPercent(product) > 0
                ? `−${discountPercent(product)}%`
                : "Sale"}
            </Badge>
          )}
        </div>

        {/* quick add on hover (and always on touch) */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <QuickAddButton product={product} />
        </div>
      </div>

      <div className="mt-5">
        <p className="eyebrow text-muted">{department?.label}</p>
        <h3 className="mt-2.5 font-serif text-xl font-light leading-snug text-ink">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors group-hover:text-gold after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-muted">{product.subtitle}</p>
        <div className="mt-2.5">
          <ProductPrice product={product} />
        </div>
      </div>
    </article>
  );
}
