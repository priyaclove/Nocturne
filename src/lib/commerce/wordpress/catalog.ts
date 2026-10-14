import type { DepartmentSlug, Product } from "../types";
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByDepartment,
  getRelatedProducts,
} from "../products";
import { isWordPressConfigured } from "./config";
import { wooFetch } from "./client";
import { mapWooProduct, type WooProduct } from "./map";

/*
  High-level catalog access. Each function returns our `Product` type, sourced
  from WooCommerce when configured and falling back to the bundled mock data
  otherwise (or if a request fails). Server-only — call from Server Components.

  Pages import THESE instead of the mock helpers to become WordPress-ready.
*/

export async function getCatalog(): Promise<Product[]> {
  if (!isWordPressConfigured()) return getProducts();
  try {
    // Fetch every page (WooCommerce caps per_page at 100). Only parent
    // products are needed for listings — variations come with the product.
    const all: WooProduct[] = [];
    for (let page = 1; page <= 20; page++) {
      const batch = await wooFetch<WooProduct[]>("products", {
        per_page: 100,
        page,
        status: "publish",
        type: "variable",
      });
      all.push(...batch);
      if (batch.length < 100) break;
    }
    const mapped = all.map(mapWooProduct);
    return mapped.length ? mapped : getProducts();
  } catch (err) {
    console.error("[commerce] WooCommerce fetch failed; using mock data.", err);
    return getProducts();
  }
}

export async function getFeaturedCatalog(): Promise<Product[]> {
  if (!isWordPressConfigured()) return getFeaturedProducts();
  const all = await getCatalog();
  const featured = all.filter((p) => p.featured);
  return featured.length ? featured : all.slice(0, 8);
}

export async function getCatalogProduct(
  slug: string,
): Promise<Product | undefined> {
  if (!isWordPressConfigured()) return getProductBySlug(slug);
  try {
    const woo = await wooFetch<WooProduct[]>("products", { slug });
    return woo[0] ? mapWooProduct(woo[0]) : getProductBySlug(slug);
  } catch (err) {
    console.error("[commerce] WooCommerce product fetch failed.", err);
    return getProductBySlug(slug);
  }
}

export async function getCatalogByDepartment(
  department: DepartmentSlug,
): Promise<Product[]> {
  if (!isWordPressConfigured()) return getProductsByDepartment(department);
  const all = await getCatalog();
  return all.filter((p) => p.department === department);
}

interface WooVariation {
  id: number;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  image?: { src: string };
  attributes: { name: string; option: string }[];
}

export interface VariationData {
  /** option value → image URL (e.g. "Black" → "…/black.jpg"). */
  images: Record<string, string>;
  /** Lowest variation regular price (cents) when on sale — the "was" price. */
  compareAtPrice?: number;
}

const toCents = (v: string) => {
  const n = Number.parseFloat(v || "0");
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
};

/**
 * Per-variant images + the sale "was" price for a variable product. Returns
 * empty data when WordPress isn't configured.
 */
export async function getVariationData(
  productId: string,
): Promise<VariationData> {
  if (!isWordPressConfigured()) return { images: {} };
  try {
    const variations = await wooFetch<WooVariation[]>(
      `products/${productId}/variations`,
      { per_page: 100 },
    );
    const images: Record<string, string> = {};
    let anyOnSale = false;
    let minRegular = Infinity;
    for (const v of variations) {
      if (v.on_sale) anyOnSale = true;
      const reg = toCents(v.regular_price || v.price);
      if (reg > 0) minRegular = Math.min(minRegular, reg);
      const src = v.image?.src;
      if (src) {
        for (const attr of v.attributes) {
          if (attr.option && !(attr.option in images)) images[attr.option] = src;
        }
      }
    }
    return {
      images,
      compareAtPrice:
        anyOnSale && Number.isFinite(minRegular) ? minRegular : undefined,
    };
  } catch (err) {
    console.error("[commerce] WooCommerce variations fetch failed.", err);
    return { images: {} };
  }
}

export async function getRelatedCatalog(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  if (!isWordPressConfigured()) return getRelatedProducts(product, limit);
  const all = await getCatalog();
  return all
    .filter((p) => p.department === product.department && p.slug !== product.slug)
    .slice(0, limit);
}
