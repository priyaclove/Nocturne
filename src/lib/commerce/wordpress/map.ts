import type { DepartmentSlug, Product } from "../types";

/*
  Translate WooCommerce REST product JSON into our `Product` shape. This is the
  single place to adjust if your store's fields differ — the rest of the app
  only ever sees our clean `Product` type.
*/

/** The subset of the WooCommerce product response we read. */
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  sku: string;
  featured: boolean;
  stock_status: string;
  categories: { id: number; name: string; slug: string }[];
  images: { id: number; src: string; alt: string }[];
  attributes: { name: string; options: string[] }[];
}

const DEPARTMENTS: DepartmentSlug[] = [
  "apparel",
  "footwear",
  "accessories",
  "beauty",
  "home",
  "pantry",
];

/** "$12.50" / "12.50" → 1250 (integer cents). */
function toCents(value: string): number {
  const n = Number.parseFloat(value || "0");
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// WooCommerce category slugs that differ from our department slugs.
const DEPARTMENT_ALIASES: Record<string, DepartmentSlug> = {
  "beauty-wellness": "beauty",
  "home-objects": "home",
};

/** Map the first WooCommerce category slug to one of our departments. */
function toDepartment(woo: WooProduct): DepartmentSlug {
  for (const cat of woo.categories) {
    const slug = cat.slug;
    if (DEPARTMENT_ALIASES[slug]) return DEPARTMENT_ALIASES[slug];
    if (DEPARTMENTS.includes(slug as DepartmentSlug)) {
      return slug as DepartmentSlug;
    }
  }
  return "home";
}

function attribute(woo: WooProduct, needle: string): string[] | undefined {
  const match = woo.attributes.find((a) =>
    a.name.toLowerCase().includes(needle),
  );
  return match?.options?.length ? match.options : undefined;
}

export function mapWooProduct(woo: WooProduct): Product {
  const short = stripHtml(woo.short_description);
  return {
    id: String(woo.id),
    slug: woo.slug,
    name: woo.name,
    department: toDepartment(woo),
    subtitle: short.length > 60 ? `${short.slice(0, 57)}…` : short,
    description: stripHtml(woo.description) || short,
    details: woo.attributes.map((a) => `${a.name}: ${a.options.join(", ")}`),
    price: toCents(woo.price || woo.regular_price),
    compareAtPrice:
      woo.on_sale && woo.regular_price ? toCents(woo.regular_price) : undefined,
    images: woo.images.map((i) => i.src).filter(Boolean),
    colors: attribute(woo, "colour") ?? attribute(woo, "color"),
    sizes: attribute(woo, "size"),
    badge: woo.featured ? "bestseller" : undefined,
    inStock: woo.stock_status === "instock",
    featured: woo.featured,
    onSale: woo.on_sale,
  };
}
