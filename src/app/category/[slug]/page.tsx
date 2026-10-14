import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { departments, getDepartment } from "@/lib/commerce/products";
import { getCatalogByDepartment } from "@/lib/commerce/wordpress";
import { departmentIcons } from "@/lib/commerce/department-icons";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/products/ProductGrid";

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = getDepartment(slug);
  if (!dept) return { title: "Category not found" };
  return { title: dept.label, description: dept.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const department = getDepartment(slug);
  if (!department) notFound();

  const products = await getCatalogByDepartment(department.slug);
  const Icon = departmentIcons[department.slug];

  return (
    <div>
      {/* category hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="luxe-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: department.label },
            ]}
          />
          <div className="mt-8 flex flex-col items-start gap-5">
            <span className="flex h-14 w-14 items-center justify-center border border-line text-gold">
              <Icon className="h-6 w-6" strokeWidth={1.25} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow text-gold">{department.tagline}</p>
              <h1 className="mt-3 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">
                {department.label}
              </h1>
              <p className="mt-4 max-w-xl leading-relaxed text-muted">
                {department.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-10 flex items-center justify-between border-b border-line pb-4">
          <span className="tnum text-sm text-muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
          {/* sibling departments */}
          <nav aria-label="Other departments" className="hidden gap-4 sm:flex">
            {departments
              .filter((d) => d.slug !== department.slug)
              .slice(0, 3)
              .map((d) => (
                <a
                  key={d.slug}
                  href={`/category/${d.slug}`}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {d.label}
                </a>
              ))}
          </nav>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
