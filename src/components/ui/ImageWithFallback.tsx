"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Renders a real image when the file exists; if it 404s (not added yet), it
 * swaps to the provided fallback. This lets product/journal images be added by
 * simply dropping files into /public — no code change, and never a broken image.
 */
export function ImageWithFallback({
  src,
  alt,
  fallback,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <>{fallback}</>;

  // Next's image optimizer refuses loopback/private hosts (e.g. a local
  // WordPress on 127.0.0.1). Serve those unoptimized so they load directly;
  // a real production media domain still gets optimized.
  const isLocalHost = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?\//.test(
    src,
  );

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
      priority={priority}
      unoptimized={isLocalHost}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}
