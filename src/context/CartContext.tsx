"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addEntry,
  cartItemCount,
  cartSubtotal,
  couponDiscount,
  removeEntry,
  resolveCartLines,
  updateEntryQuantity,
} from "@/lib/commerce/cart";
import type {
  AppliedCoupon,
  CartEntry,
  CartLine,
  Product,
} from "@/lib/commerce/types";

const STORAGE_KEY = "nocturne.cart.v1";

interface CartContextValue {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** Applied promo code (validated against WooCommerce), or null. */
  coupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon | null) => void;
  /** Coupon discount (cents) and the resulting total. */
  discount: number;
  total: number;
  /** Mini-cart drawer visibility. */
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (product: Product, quantity: number, variant?: string) => void;
  update: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is CartEntry =>
          e &&
          e.product &&
          typeof e.product.id === "string" &&
          typeof e.quantity === "number",
      )
      .map((e) => ({
        product: e.product,
        quantity: e.quantity,
        variant: typeof e.variant === "string" ? e.variant : undefined,
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    // Hydrate from localStorage after mount: SSR renders an empty cart so the
    // markup matches, then we fill it in on the client. This deliberate
    // post-mount setState is the correct pattern here.
    /* eslint-disable react-hooks/set-state-in-effect */
    setEntries(readStorage());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* storage unavailable — operate in memory */
    }
  }, [entries, hydrated]);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const add = useCallback(
    (product: Product, quantity: number, variant?: string) => {
      setEntries((prev) => addEntry(prev, product, quantity, variant));
      setDrawerOpen(true);
    },
    [],
  );
  const update = useCallback((productId: string, quantity: number) => {
    setEntries((prev) => updateEntryQuantity(prev, productId, quantity));
  }, []);
  const remove = useCallback((productId: string) => {
    setEntries((prev) => removeEntry(prev, productId));
  }, []);
  const clear = useCallback(() => {
    setEntries([]);
    setCoupon(null);
  }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const applyCoupon = useCallback((c: AppliedCoupon | null) => setCoupon(c), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveCartLines(entries);
    const subtotal = cartSubtotal(lines);
    const discount = couponDiscount(coupon, subtotal);
    return {
      hydrated,
      lines,
      count: cartItemCount(entries),
      subtotal,
      coupon,
      applyCoupon,
      discount,
      total: subtotal - discount,
      drawerOpen,
      openDrawer,
      closeDrawer,
      add,
      update,
      remove,
      clear,
    };
  }, [entries, hydrated, coupon, applyCoupon, drawerOpen, openDrawer, closeDrawer, add, update, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
