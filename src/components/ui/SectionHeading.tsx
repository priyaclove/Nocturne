import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Editorial section header: gold eyebrow + light serif title + optional link. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = "start",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  align?: "start" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "flex flex-col items-center text-center"
          : "flex flex-wrap items-end justify-between gap-6"
      }
    >
      <div className="max-w-2xl">
        <p
          className={
            align === "center"
              ? "eyebrow flex items-center justify-center gap-3 text-gold"
              : "eyebrow flex items-center gap-3 text-gold"
          }
        >
          <span className="h-px w-7 bg-gold-gradient" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-5 font-serif text-4xl font-extralight leading-[1.08] tracking-tight text-ink sm:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      {link && align === "start" && (
        <Link
          href={link.href}
          className="group inline-flex items-center gap-2 pb-1 text-sm text-ink transition-colors hover:text-gold"
        >
          <span className="link-underline">{link.label}</span>
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
