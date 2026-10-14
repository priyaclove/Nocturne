import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getDepartment } from "@/lib/commerce/products";
import {
  getCatalogProduct,
  getRelatedCatalog,
  getVariationData,
} from "@/lib/commerce/wordpress";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductGrid } from "@/components/products/ProductGrid";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();

  const department = getDepartment(product.department);
  const [related, variation] = await Promise.all([
    getRelatedCatalog(product),
    getVariationData(product.id),
  ]);

  // For variable products the "was" price lives on the variations.
  const enriched = {
    ...product,
    compareAtPrice: variation.compareAtPrice ?? product.compareAtPrice,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          {
            label: department?.label ?? "",
            href: `/category/${product.department}`,
          },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <ProductHero
          product={enriched}
          departmentLabel={department?.label}
          variantImages={variation.images}
        />
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-line pt-14">
          <h2 className="font-serif text-3xl font-light text-ink">
            You may also like
          </h2>
          <ProductGrid products={related} className="mt-10" />
        </section>
      )}
    </div>
  );
}
