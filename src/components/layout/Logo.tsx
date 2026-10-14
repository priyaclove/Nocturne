import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Nocturne crescent — a thin metallic-gold crescent moon. Works at favicon
 * scale. Uses an embedded gradient so the mark reads as brushed gold.
 */
export function CrescentMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nocturne-gold" x1="4" y1="4" x2="20" y2="20">
          <stop offset="0" stopColor="#efdfb6" />
          <stop offset="0.55" stopColor="#c6a664" />
          <stop offset="1" stopColor="#a9833f" />
        </linearGradient>
      </defs>
      <path
        d="M18.2 15.3A7.5 7.5 0 0 1 8.7 5.8a7.5 7.5 0 1 0 9.5 9.5Z"
        fill="url(#nocturne-gold)"
      />
    </svg>
  );
}

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <Link
      href="/"
      aria-label="Nocturne — home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <CrescentMark className="h-4 w-4 transition-transform duration-700 group-hover:-rotate-[25deg]" />
      <span
        className={cn(
          "font-serif uppercase tracking-[0.4em] text-ink transition-colors duration-300 group-hover:text-champagne",
          size === "sm" ? "text-base" : "text-lg",
        )}
      >
        Nocturne
      </span>
    </Link>
  );
}
