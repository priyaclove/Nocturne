import type { Metadata } from "next";
import { Hammer, Leaf, Clock, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nocturne is a house of considered living — fewer, better things, chosen slowly and made to last.",
};

const values = [
  {
    icon: Clock,
    title: "Built to last",
    body: "We choose pieces for how they age, not how they trend. Quality that outlives the season.",
  },
  {
    icon: Hammer,
    title: "Honestly made",
    body: "Real materials and honest construction — welted shoes, thrown ceramics, milled wool.",
  },
  {
    icon: HandHeart,
    title: "Makers first",
    body: "We work with small ateliers and single apiaries who still do the work by hand.",
  },
  {
    icon: Leaf,
    title: "Quietly responsible",
    body: "Natural fibres, recycled metals, and considered, minimal packaging.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="luxe-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "About" }]}
          />
          <p className="eyebrow mt-8 text-gold">Our philosophy</p>
          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-light leading-[1.05] tracking-tight text-ink sm:text-6xl">
            A house built on fewer, better things.
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted">
            Nocturne began with a simple frustration: too much, too fast, made to
            be replaced. We wanted the opposite — a small, considered collection
            worth keeping.
          </p>
        </div>
      </section>

      {/* narrative */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="space-y-6 text-lg leading-relaxed text-muted">
          <p>
            We are a department store in the old sense — apparel, footwear,
            objects and provisions under one roof — but edited to a single
            standard. If a piece won&apos;t age well, earn its place, or outlast a
            trend, it doesn&apos;t make the floor.
          </p>
          <p>
            Everything is chosen the same way: natural materials, honest
            construction, and makers who still care about the work. A coat milled
            in Biella. A bowl thrown by hand. Coffee roasted to order. The names
            change; the standard does not.
          </p>
          <p className="font-serif text-2xl font-light italic text-ink">
            &ldquo;Luxury, at its best, is not excess. It is attention — paid
            slowly, to small things.&rdquo;
          </p>
        </div>
      </section>

      {/* values */}
      <section className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="bg-bg p-7">
                <v.icon className="h-6 w-6 text-gold" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="mt-5 font-serif text-xl font-light text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact / cta */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-10 border border-line p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-gold">Say hello</p>
            <h2 className="mt-4 font-serif text-3xl font-light text-ink">
              We&apos;d love to hear from you.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Questions about a piece, an order, or a partnership? Our client care
              team reads every note. (Sample contact details — this is a
              demonstration storefront.)
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink">
              <li>care@nocturne.example</li>
              <li className="tnum">+1 (555) 000-0199</li>
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Button href="/shop" size="lg">
              Explore the collection
            </Button>
            <Button href="/blog" variant="ghost">
              Read the Journal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
