"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Shirt,
  Footprints,
  Watch,
  Gem,
  SprayCan,
  Glasses,
  Armchair,
  Lamp,
  WashingMachine,
  Refrigerator,
  Coffee,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { CrescentMark } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * NOCTURNE entry loader. A full-screen, theme-aware splash that cycles through
 * the department icons (bag, apparel, footwear, accessories, fragrance, home
 * appliance, pantry) while the page settles, then fades away.
 *
 * Shows on a full page load only (it lives in the layout, which isn't
 * remounted on client-side navigation). A <noscript> rule hides it with JS off.
 */
// A varied parade of the kinds of things Nocturne carries — apparel,
// footwear, accessories, fragrance, and several distinct home items /
// appliances, through to the pantry.
const ICONS: { Icon: LucideIcon; label: string }[] = [
  { Icon: ShoppingBag, label: "Bag" },
  { Icon: Shirt, label: "Apparel" },
  { Icon: Footprints, label: "Footwear" },
  { Icon: Watch, label: "Timepieces" },
  { Icon: Gem, label: "Jewellery" },
  { Icon: SprayCan, label: "Fragrance" },
  { Icon: Glasses, label: "Eyewear" },
  { Icon: Armchair, label: "Furniture" },
  { Icon: Lamp, label: "Lighting" },
  { Icon: WashingMachine, label: "Appliances" },
  { Icon: Refrigerator, label: "Appliances" },
  { Icon: Coffee, label: "Pantry" },
  { Icon: Wine, label: "Cellar" },
];

const STEP_MS = 300; // time each icon is shown
const HOLD_MS = ICONS.length * STEP_MS; // one full pass before fading
const FADE_MS = 600;

export function Loader() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const cycle = setInterval(
      () => setActive((i) => (i + 1) % ICONS.length),
      STEP_MS,
    );
    const hold = setTimeout(() => setFading(true), HOLD_MS);
    return () => {
      clearInterval(cycle);
      clearTimeout(hold);
    };
  }, []);

  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setGone(true), FADE_MS + 50);
    return () => clearTimeout(t);
  }, [fading]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={fading}
      className={cn(
        "loader-root fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-bg transition-opacity ease-out",
        fading ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <span className="sr-only">Loading Nocturne…</span>

      {/* brand */}
      <span className="inline-flex items-center gap-2.5">
        <CrescentMark className="h-4 w-4" />
        <span className="font-serif text-sm uppercase tracking-[0.42em] text-ink">
          Nocturne
        </span>
      </span>

      {/* cycling icon ring */}
      <div className="relative mt-10 flex h-24 w-24 items-center justify-center">
        {/* rotating gold arc */}
        <span className="absolute inset-0 rounded-full border border-line" />
        <span className="loader-spin absolute inset-0 rounded-full border border-transparent border-t-gold" />
        {/* icons cross-fade in place */}
        <div className="relative h-8 w-8">
          {ICONS.map(({ Icon, label }, i) => (
            <Icon
              key={label}
              aria-hidden="true"
              strokeWidth={1.25}
              className={cn(
                "absolute inset-0 h-8 w-8 text-gold transition-all duration-300 ease-out",
                i === active
                  ? "scale-100 opacity-100"
                  : "scale-75 opacity-0",
              )}
            />
          ))}
        </div>
      </div>

      {/* label + progress */}
      <p className="eyebrow mt-8 h-3 text-muted transition-opacity">
        {ICONS[active].label}
      </p>
      <div className="mt-4 h-px w-40 overflow-hidden bg-line">
        <span
          className="loader-bar block h-full bg-gold-gradient"
          style={{ animationDuration: `${HOLD_MS}ms` }}
        />
      </div>
    </div>
  );
}
