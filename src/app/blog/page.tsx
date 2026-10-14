import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts, getFeaturedPost, formatPostDate } from "@/lib/commerce/blog";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JournalCover } from "@/components/blog/JournalCover";

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Notes on living well — craft, materials, rituals and sourcing from the Nocturne Journal.",
};

export default function JournalPage() {
  const featured = getFeaturedPost();
  const rest = getPosts().filter((p) => p.slug !== featured.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />

      <header className="mt-6 border-b border-line pb-10">
        <p className="eyebrow text-gold">The Journal</p>
        <h1 className="mt-4 font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">
          Notes on living well
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          On craft, materials, and the small ceremonies that make a day feel
          considered.
        </p>
      </header>

      {/* featured */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group mt-12 grid gap-8 border-b border-line pb-12 lg:grid-cols-2"
      >
        <JournalCover
          post={featured}
          className="aspect-[3/2]"
          letterClassName="text-[9rem]"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        >
          <span className="eyebrow absolute left-5 top-5 text-gold">
            {featured.category}
          </span>
        </JournalCover>
        <div className="flex flex-col justify-center">
          <p className="text-xs text-muted">
            {formatPostDate(featured.date)} · {featured.readingMinutes} min read
          </p>
          <h2 className="mt-3 font-serif text-3xl font-light leading-tight text-ink group-hover:text-gold sm:text-4xl">
            {featured.title}
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            {featured.excerpt}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
            Read entry
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </div>
      </Link>

      {/* grid */}
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <JournalCover post={post} className="aspect-[3/2]">
              <span className="eyebrow absolute left-4 top-4 text-gold">
                {post.category}
              </span>
            </JournalCover>
            <p className="mt-4 text-xs text-muted">
              {formatPostDate(post.date)} · {post.readingMinutes} min read
            </p>
            <h3 className="mt-2 font-serif text-xl font-light leading-snug text-ink group-hover:text-gold">
              {post.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
