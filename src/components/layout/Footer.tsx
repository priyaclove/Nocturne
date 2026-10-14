import Link from "next/link";
import { CrescentMark } from "./Logo";
import { departments } from "@/lib/commerce/products";

const columns = [
  {
    heading: "Explore",
    links: [
      { label: "Shop All", href: "/shop" },
      { label: "The Journal", href: "/blog" },
      { label: "About Nocturne", href: "/about" },
    ],
  },
  {
    heading: "Client Care",
    links: [
      { label: "Shipping & Returns", href: "/about" },
      { label: "Contact", href: "/about" },
      { label: "Care Guide", href: "/blog" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* brand + newsletter */}
          <div>
            <span className="inline-flex items-center gap-2.5">
              <CrescentMark className="h-4 w-4 text-gold" />
              <span className="font-serif text-lg uppercase tracking-[0.3em] text-ink">
                Nocturne
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              A house of considered living — fewer, better things, chosen slowly
              and made to last.
            </p>
            <form className="mt-6 flex max-w-sm items-center gap-2">
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                placeholder="Email address"
                className="h-11 flex-1 border border-line bg-transparent px-3 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 border border-gold px-4 text-sm text-gold transition-colors hover:bg-gold hover:text-bg"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-faint">
              Letters from the Journal. No noise. Demo form — not yet connected.
            </p>
          </div>

          {/* departments */}
          <div>
            <h3 className="eyebrow text-muted">Departments</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {departments.map((dept) => (
                <li key={dept.slug}>
                  <Link
                    href={`/category/${dept.slug}`}
                    className="text-ink transition-colors hover:text-gold"
                  >
                    {dept.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow text-muted">{col.heading}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ink transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="tnum">© 2026 Nocturne. A demonstration storefront.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gold">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-gold">
              Terms
            </Link>
            <span className="eyebrow">Made after dark</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
