import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  departments,
  getDepartmentCount,
  getFeaturedProducts,
  getProductBySlug,
} from "@/lib/commerce/products";
import { departmentIcons } from "@/lib/commerce/department-icons";
import { getPosts, formatPostDate } from "@/lib/commerce/blog";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductImage } from "@/components/products/ProductImage";
import { JournalCover } from "@/components/blog/JournalCover";

const CONTAINER = "mx-auto max-w-7xl px-4";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 8);
  const hero = getProductBySlug("monolith-wool-overcoat");
  const posts = getPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="gold-glow absolute inset-0" aria-hidden="true" />
        <div className="luxe-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className={`${CONTAINER} relative grid items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-32`}>
          <div className="rise">
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-10 bg-gold-gradient" aria-hidden="true" />
              A house of considered living
            </p>
            <h1 className="mt-8 font-serif text-6xl font-extralight leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
              Fewer, better
              <br />
              things — chosen
              <br />
              <span className="text-gold-gradient italic">after dark.</span>
            </h1>
            <p className="mt-9 max-w-md text-base leading-relaxed text-muted">
              A curated department of apparel, objects and provisions. Quietly
              made, built to last, and gathered under one roof.
            </p>
            <div className="mt-11 flex flex-wrap gap-4">
              <Button href="/shop" size="lg">
                Shop the collection
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button href="/blog" variant="outline" size="lg">
                Read the Journal
              </Button>
            </div>
          </div>

          {/* featured hero product */}
          {hero && (
            <Reveal delay={120}>
              <Link
                href={`/products/${hero.slug}`}
                className="group relative mx-auto block w-full max-w-md border border-line bg-surface/60 backdrop-blur-sm transition-colors hover:border-[color-mix(in_srgb,var(--color-gold)_40%,transparent)]"
              >
                <div className="overflow-hidden">
                  <div className="transition-transform duration-[900ms] ease-out group-hover:scale-105">
                    <ProductImage product={hero} priority />
                  </div>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-line p-6">
                  <div>
                    <Badge tone="gold">Signature</Badge>
                    <p className="mt-3 font-serif text-2xl font-light text-ink">
                      {hero.name}
                    </p>
                    <p className="tnum mt-1 text-sm text-muted">
                      {formatMoney(hero.price)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      {/* VALUES STRIP */}
      <section className="border-b border-line bg-surface/30">
        <div className={`${CONTAINER} grid grid-cols-2 divide-x divide-line md:grid-cols-4`}>
          {[
            "Complimentary shipping over ₹5,000",
            "Made to last, not to replace",
            "Small-batch & single-origin",
            "Considered packaging",
          ].map((v, i) => (
            <p
              key={i}
              className="px-5 py-6 text-center text-xs leading-snug tracking-wide text-muted"
            >
              {v}
            </p>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className={`${CONTAINER} py-28`}>
        <Reveal>
          <SectionHeading
            eyebrow="Six departments"
            title="One considered house"
            description="From tailoring to the table — everything under the Nocturne roof is chosen to the same standard."
            link={{ label: "Shop all", href: "/shop" }}
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-3">
          {departments.map((dept, i) => {
            const Icon = departmentIcons[dept.slug];
            return (
              <Reveal as="div" key={dept.slug} delay={i * 70}>
                <Link
                  href={`/category/${dept.slug}`}
                  className="group relative flex h-full flex-col justify-between gap-10 bg-bg p-7 transition-colors hover:bg-surface sm:p-9"
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      className="h-7 w-7 text-gold transition-transform duration-500 group-hover:-translate-y-1"
                      strokeWidth={1}
                      aria-hidden="true"
                    />
                    <span className="tnum text-xs text-faint">
                      {String(getDepartmentCount(dept.slug)).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-ink transition-colors group-hover:text-gold sm:text-[1.7rem]">
                      {dept.label}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{dept.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* THE EDIT */}
      <section className="border-y border-line bg-surface/30">
        <div className={`${CONTAINER} py-28`}>
          <Reveal>
            <SectionHeading
              eyebrow="The edit"
              title="Chosen this season"
              description="A cross-section of the catalogue — the pieces we'd reach for first."
              link={{ label: "View all", href: "/shop" }}
            />
          </Reveal>
          <Reveal className="mt-16">
            <ProductGrid products={featured} />
          </Reveal>
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className={`${CONTAINER} py-28`}>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative aspect-[5/4] overflow-hidden border border-line bg-gradient-to-br from-surface-2 to-bg">
            <div className="gold-glow absolute inset-0" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center font-serif text-[12rem] font-extralight leading-none text-gold-gradient opacity-25">
              N
            </span>
            <span className="pointer-events-none absolute inset-6 border border-line/60" />
            <p className="eyebrow absolute bottom-7 left-7 text-gold">
              Est. after dark
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-7 bg-gold-gradient" aria-hidden="true" />
              The Nocturne way
            </p>
            <h2 className="mt-6 font-serif text-4xl font-extralight leading-[1.1] text-ink sm:text-5xl">
              We believe the best things are bought once.
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted">
              Every piece is selected for how it will age, not how it photographs.
              We favour natural materials, honest construction and makers who
              still do the work by hand — then we let the rest fall away.
            </p>
            <div className="mt-9">
              <Button href="/about" variant="outline">
                Our philosophy
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="border-t border-line">
        <div className={`${CONTAINER} py-28`}>
          <Reveal>
            <SectionHeading
              eyebrow="The Journal"
              title="Notes on living well"
              link={{ label: "All entries", href: "/blog" }}
            />
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="div" key={post.slug} delay={i * 90}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <JournalCover post={post} className="aspect-[3/2]">
                    <span className="eyebrow absolute left-4 top-4 text-gold">
                      {post.category}
                    </span>
                  </JournalCover>
                  <p className="mt-5 text-xs text-muted">
                    {formatPostDate(post.date)} · {post.readingMinutes} min read
                  </p>
                  <h3 className="mt-2.5 font-serif text-xl font-light leading-snug text-ink transition-colors group-hover:text-gold">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="gold-glow absolute inset-0" aria-hidden="true" />
        <div className={`${CONTAINER} relative py-32 text-center`}>
          <Reveal>
            <p className="eyebrow text-gold">Begin</p>
            <h2 className="mx-auto mt-6 max-w-2xl font-serif text-5xl font-extralight leading-[1.05] text-ink sm:text-6xl">
              A quieter kind of
              <span className="text-gold-gradient italic"> luxury </span>
              awaits.
            </h2>
            <div className="mt-11 flex justify-center">
              <Button href="/shop" size="lg">
                Explore the collection
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
