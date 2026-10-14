import type { JournalPost } from "@/lib/commerce/types";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { cn } from "@/lib/utils";

/**
 * Journal cover image. Looks for `/journal/<slug>.jpg`; until that file is
 * added it shows an on-brand gold initial panel. Overlay content (e.g. the
 * category label) goes in `children`.
 */
export function JournalCover({
  post,
  className,
  letterClassName = "text-7xl",
  sizes,
  priority = false,
  children,
}: {
  post: JournalPost;
  className?: string;
  letterClassName?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-line bg-gradient-to-br from-surface-2 to-bg",
        className,
      )}
    >
      <ImageWithFallback
        src={post.cover ?? `/journal/${post.slug}.jpg`}
        alt={post.title}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        priority={priority}
        fallback={
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center font-serif font-light text-gold-gradient opacity-20",
              letterClassName,
            )}
          >
            {post.title.charAt(0)}
          </span>
        }
      />
      {children}
    </div>
  );
}
