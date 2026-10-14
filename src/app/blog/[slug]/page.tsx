import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPosts, getPostBySlug, formatPostDate } from "@/lib/commerce/blog";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JournalCover } from "@/components/blog/JournalCover";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Entry not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const more = getPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/blog" },
          { label: post.title },
        ]}
      />

      <header className="mt-8 border-b border-line pb-10 text-center">
        <p className="eyebrow text-gold">{post.category}</p>
        <h1 className="mx-auto mt-5 max-w-2xl font-serif text-4xl font-light leading-tight tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-xs text-muted">
          By {post.author} · {formatPostDate(post.date)} ·{" "}
          {post.readingMinutes} min read
        </p>
      </header>

      {/* cover */}
      <JournalCover
        post={post}
        className="mt-10 aspect-[3/2]"
        letterClassName="text-[9rem]"
        sizes="(max-width: 768px) 100vw, 768px"
        priority
      />

      {/* body */}
      <div className="mx-auto mt-12 max-w-2xl space-y-6">
        {post.body.map((paragraph, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-lg leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-light first-letter:leading-[0.8] first-letter:text-gold"
                : "text-lg leading-relaxed text-muted"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14 border-t border-line pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the Journal
        </Link>
      </div>

      {/* more */}
      {more.length > 0 && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="font-serif text-2xl font-light text-ink">
            Keep reading
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                <p className="eyebrow text-gold">{p.category}</p>
                <h3 className="mt-2 font-serif text-xl font-light leading-snug text-ink group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <Button href="/shop" variant="outline">
          Explore the collection
        </Button>
      </div>
    </article>
  );
}
