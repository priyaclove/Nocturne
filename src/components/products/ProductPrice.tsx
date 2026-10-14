import { formatMoney } from "@/lib/format";
import { isOnSale } from "@/lib/commerce/pricing";
import type { Product } from "@/lib/commerce/types";
import { cn } from "@/lib/utils";

export function ProductPrice({
  product,
  size = "md",
}: {
  product: Product;
  size?: "md" | "lg";
}) {
  const onSale = isOnSale(product);
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={cn(
          "tnum font-medium",
          onSale ? "text-gold" : "text-ink",
          size === "lg" ? "text-2xl" : "text-sm",
        )}
      >
        {formatMoney(product.price)}
      </span>
      {onSale && product.compareAtPrice && (
        <span
          className={cn(
            "tnum text-muted line-through",
            size === "lg" ? "text-base" : "text-xs",
          )}
        >
          {formatMoney(product.compareAtPrice)}
        </span>
      )}
    </div>
  );
}
