import { departments } from "./products";
import { isOnSale } from "./pricing";
import type { Product, ProductQuery, SortOption } from "./types";

/* Pure filtering + sorting over an in-memory product array. */

const deptLabel = (slug: string) =>
  departments.find((d) => d.slug === slug)?.label ?? slug;

function matchesSearch(product: Product, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    product.name.toLowerCase().includes(needle) ||
    product.subtitle.toLowerCase().includes(needle) ||
    product.description.toLowerCase().includes(needle) ||
    deptLabel(product.department).toLowerCase().includes(needle)
  );
}

export function sortProducts(
  products: Product[],
  sort: SortOption = "featured",
): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      // Featured first, otherwise preserve catalog order.
      return sorted.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
  }
}

export function filterProducts(
  products: Product[],
  query: ProductQuery,
): Product[] {
  const filtered = products.filter((product) => {
    if (query.q && !matchesSearch(product, query.q)) return false;
    if (query.department && product.department !== query.department) return false;
    if (query.onSaleOnly && !isOnSale(product)) return false;
    return true;
  });
  return sortProducts(filtered, query.sort);
}

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price · Low to High",
  "price-desc": "Price · High to Low",
  "name-asc": "Alphabetical",
};
