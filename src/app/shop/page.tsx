import type { Metadata } from "next";
import Link from "next/link";
import { PackageX } from "lucide-react";
import { departments } from "@/lib/commerce/products";
import { getCatalog } from "@/lib/commerce/wordpress";
import { filterProducts } from "@/lib/commerce/filtering";
import type { DepartmentSlug, SortOption } from "@/lib/commerce/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSort } from "@/components/products/ProductSort";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "The full Nocturne collection — apparel, footwear, accessories, beauty, home and pantry.",
};

type SearchParams = Record<string, string | string[] | undefined>;
const str = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const department = str(sp.department) as DepartmentSlug | undefined;
  const sort = (str(sp.sort) as SortOption | undefined) ?? "featured";
  const onSaleOnly = str(sp.sale) === "1";
  const q = str(sp.q);

  const products = filterProducts(await getCatalog(), {
    department,
    sort,
    onSaleOnly,
    q,
  });

  const buildHref = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { department, sort: sort === "featured" ? undefined : sort, sale: onSaleOnly ? "1" : undefined, q, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Shop All" }]}
      />

      <header className="mt-6 flex flex-col gap-2 border-b border-line pb-8">
        <p className="eyebrow text-gold">The collection</p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-ink sm:text-5xl">
          {q ? "Search" : "Shop All"}
        </h1>
        <p className="max-w-xl text-sm text-muted">
          {q
            ? `Results for “${q}”.`
            : "Every piece under the Nocturne roof, gathered in one place."}
        </p>
      </header>

      {/* filter + sort bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill href={buildHref({ department: undefined })} active={!department}>
            All
          </FilterPill>
          {departments.map((d) => (
            <FilterPill
              key={d.slug}
              href={buildHref({ department: d.slug })}
              active={department === d.slug}
            >
              {d.label}
            </FilterPill>
          ))}
          <FilterPill href={buildHref({ sale: onSaleOnly ? undefined : "1" })} active={onSaleOnly}>
            On sale
          </FilterPill>
        </div>
        <div className="flex items-center gap-4">
          <span className="tnum text-sm text-muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
          <ProductSort />
        </div>
      </div>

      <div className="mt-12">
        {products.length === 0 ? (
          <EmptyState
            icon={PackageX}
            title="Nothing here yet"
            description="No pieces match this selection. Try another department or clear the filters."
            action={
              <Button href="/shop" variant="outline">
                Clear filters
              </Button>
            }
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-4 py-2 text-sm transition-colors",
        active
          ? "border-gold bg-gold/10 text-gold"
          : "border-line text-ink hover:border-muted",
      )}
    >
      {children}
    </Link>
  );
}
