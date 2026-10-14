/*
  NOCTURNE domain types.
  Monetary values are integer CENTS. These describe the shapes the UI consumes;
  the mock modules are the first implementation and can later be backed by a
  real commerce API returning the same shapes.
*/

export type DepartmentSlug =
  | "apparel"
  | "footwear"
  | "accessories"
  | "beauty"
  | "home"
  | "pantry";

export interface Department {
  slug: DepartmentSlug;
  label: string;
  tagline: string;
  description: string;
}

export type ProductBadge = "new" | "limited" | "bestseller";

export interface Product {
  id: string;
  slug: string;
  name: string;
  department: DepartmentSlug;
  /** One-line editorial subtitle. */
  subtitle: string;
  description: string;
  /** Short editorial feature bullets. */
  details: string[];
  /** Price in cents. */
  price: number;
  /** Original price in cents when on offer (strike-through). */
  compareAtPrice?: number;
  /** Real photo URLs when available; empty uses the generated visual. */
  images: string[];
  colors?: string[];
  sizes?: string[];
  origin?: string;
  badge?: ProductBadge;
  inStock: boolean;
  featured?: boolean;
  /** True when the product (or any variation) is on sale. */
  onSale?: boolean;
}

export interface CartEntry {
  /** A snapshot of the product at add-time, so the cart doesn't depend on a
      live catalogue lookup (works for WooCommerce or mock products alike). */
  product: Product;
  quantity: number;
  /** Chosen variant (size / colour) label. */
  variant?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
  variant?: string;
  lineTotal: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface ProductQuery {
  q?: string;
  department?: DepartmentSlug;
  sort?: SortOption;
  onSaleOnly?: boolean;
}

export interface AppliedCoupon {
  code: string;
  /** "percent" | "fixed_cart" | "fixed_product" */
  discountType: string;
  amount: number;
  freeShipping: boolean;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  /** ISO date string (no runtime Date needed). */
  date: string;
  readingMinutes: number;
  body: string[];
  featured?: boolean;
  /** Cover image URL (demo). Local public/journal/<slug>.jpg overrides via UI. */
  cover?: string;
}
