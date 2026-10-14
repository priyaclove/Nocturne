"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { getDepartment } from "@/lib/commerce/products";
import { ProductImage } from "@/components/products/ProductImage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Slide-over mini-cart. Driven by cart context drawer state. */
export function MiniCart() {
  const { drawerOpen, closeDrawer, lines, subtotal, count, update, remove } =
    useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70]",
        drawerOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!drawerOpen}
    >
      {/* overlay */}
      <div
        onClick={closeDrawer}
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-300",
          drawerOpen ? "opacity-100" : "opacity-0",
        )}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col border-l border-line bg-bg transition-transform duration-300 ease-out",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-xl font-light text-ink">
            Your Bag{" "}
            <span className="tnum text-sm text-muted">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-gold"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-8 w-8 text-faint" aria-hidden="true" />
            <div>
              <p className="font-serif text-lg text-ink">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted">
                Pieces you add will appear here.
              </p>
            </div>
            <Button variant="outline" onClick={closeDrawer}>
              Continue browsing
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.product.id} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${line.product.slug}`}
                    onClick={closeDrawer}
                    className="w-20 shrink-0 overflow-hidden bg-surface"
                  >
                    <ProductImage product={line.product} />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="eyebrow text-muted">
                          {getDepartment(line.product.department)?.label}
                        </p>
                        <Link
                          href={`/products/${line.product.slug}`}
                          onClick={closeDrawer}
                          className="mt-1 block font-serif text-base leading-tight text-ink hover:text-gold"
                        >
                          {line.product.name}
                        </Link>
                        {line.variant && (
                          <p className="mt-0.5 text-xs text-muted">
                            {line.variant}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.product.id)}
                        aria-label={`Remove ${line.product.name}`}
                        className="h-fit text-muted transition-colors hover:text-[var(--color-danger)]"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border border-line">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            update(line.product.id, line.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="tnum w-8 text-center text-sm text-ink">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            update(line.product.id, line.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="tnum text-sm font-medium text-ink">
                        {formatMoney(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="tnum text-lg font-medium text-ink">
                  {formatMoney(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">
                Shipping & taxes calculated at checkout.
              </p>
              <div className="mt-4 grid gap-2">
                <Button href="/cart" variant="gold" onClick={closeDrawer}>
                  View bag & checkout
                </Button>
                <Button variant="ghost" onClick={closeDrawer}>
                  Continue browsing
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
