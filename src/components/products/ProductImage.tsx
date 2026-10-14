import { departmentIcons } from "@/lib/commerce/department-icons";
import type { Product } from "@/lib/commerce/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

/**
 * Product visual.
 *
 * Looks for a real photo at `/products/<slug>.jpg` (or whatever is set on
 * `product.images[0]`). If the file isn't there yet it falls back to an
 * on-brand generated panel — so the catalogue always looks finished, and real
 * photography appears automatically once the files are dropped into
 * `public/products/`. See IMAGES.md for the exact filenames to add.
 */
export function ProductImage({
  product,
  priority = false,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  // Use the product's image URL (demo Unsplash, or your own) when set; else a
  // local file at /products/<slug>.jpg; else the generated panel.
  const src = product.images[0] ?? `/products/${product.slug}.jpg`;

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-surface-2",
        className,
      )}
    >
      <ImageWithFallback
        src={src}
        alt={product.name}
        priority={priority}
        fallback={<GeneratedPanel product={product} />}
      />
    </div>
  );
}

/** On-brand placeholder: a lit serif monogram over a warm gradient. */
export function GeneratedPanel({ product }: { product: Product }) {
  const Icon = departmentIcons[product.department];
  const initial = product.name.charAt(0).toUpperCase();

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-surface-2 to-bg"
      role="img"
      aria-label={product.name}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 38%, rgba(166,132,60,0.14), transparent 60%)",
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="text-gold-gradient font-serif text-[7rem] font-light leading-none opacity-30 sm:text-[9rem]">
          {initial}
        </span>
      </span>
      <span className="absolute left-4 top-4 text-muted/70">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="pointer-events-none absolute inset-3 border border-line/60" />
    </div>
  );
}
