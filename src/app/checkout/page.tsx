"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";

interface CreatedOrder {
  id: number;
  number: string;
  status: string;
  total: string;
  currency: string;
}

type Form = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!NAME_RE.test(f.first_name.trim()))
    e.first_name = "Enter a valid first name.";
  if (!EMAIL_RE.test(f.email.trim()))
    e.email = "Enter a valid email address.";
  const phone = f.phone.replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15)
    e.phone = "Enter a valid phone number (10–15 digits).";
  if (f.address_1.trim().length < 5)
    e.address_1 = "Enter your full street address.";
  if (!NAME_RE.test(f.city.trim())) e.city = "Enter a valid city.";
  const pin = f.postcode.trim();
  if (f.country.trim().toUpperCase() === "IN") {
    if (!/^\d{6}$/.test(pin)) e.postcode = "Enter a valid 6-digit PIN code.";
  } else if (!/^[A-Za-z0-9 -]{3,10}$/.test(pin)) {
    e.postcode = "Enter a valid postcode.";
  }
  if (!f.country.trim()) e.country = "Enter a country.";
  return e;
}

const baseField =
  "h-11 w-full border bg-transparent px-3 text-sm text-ink placeholder:text-faint focus:outline-none";

export default function CheckoutPage() {
  const { hydrated, lines, subtotal, discount, total, coupon, clear } =
    useCart();

  const [form, setForm] = useState<Form>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<CreatedOrder | null>(null);

  const set =
    (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((prev) =>
        prev[key] ? { ...prev, [key]: undefined } : prev,
      );
    };

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
            variant: l.variant,
          })),
          billing: form,
          couponCode: coupon?.code ?? null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrder(data.order);
        clear();
      } else {
        setError(data.error ?? "Couldn’t place the order.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Order placed ---
  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
          <Check className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-serif text-4xl font-light text-ink">
          Thank you — order placed
        </h1>
        <p className="mt-3 text-muted">
          Your order{" "}
          <span className="font-medium text-ink">#{order.number}</span> has been
          created in WooCommerce.
        </p>
        <div className="mx-auto mt-8 max-w-xs border border-line p-5 text-left text-sm">
          <Summary label="Order" value={`#${order.number}`} />
          <Summary label="Status" value={order.status} />
          <Summary
            label="Total"
            value={formatMoney(Math.round(Number(order.total) * 100))}
            emphasize
          />
        </div>
        <p className="mt-6 text-xs text-faint">
          Payment isn’t collected in this demo — the order is created as
          “pending” for the store to process. View it in WooCommerce → Orders.
        </p>
        <div className="mt-8">
          <Button href="/shop" size="lg">
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-light text-ink">
          Your bag is empty
        </h1>
        <p className="mt-2 text-sm text-muted">Add something to check out.</p>
        <div className="mt-8">
          <Button href="/shop" size="lg">
            Explore the collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Bag", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-6 border-b border-line pb-6 font-serif text-4xl font-light tracking-tight text-ink sm:text-5xl">
        Checkout
      </h1>

      <form
        onSubmit={placeOrder}
        noValidate
        className="mt-8 grid gap-12 lg:grid-cols-[1fr_22rem]"
      >
        {/* details */}
        <div className="space-y-8">
          <section>
            <h2 className="eyebrow text-gold">Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="First name" required error={errors.first_name}>
                <input
                  className={cn(baseField, border(errors.first_name))}
                  value={form.first_name}
                  onChange={set("first_name")}
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Last name">
                <input
                  className={cn(baseField, border())}
                  value={form.last_name}
                  onChange={set("last_name")}
                  autoComplete="family-name"
                />
              </Field>
              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  inputMode="email"
                  className={cn(baseField, border(errors.email))}
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input
                  type="tel"
                  inputMode="tel"
                  className={cn(baseField, border(errors.phone))}
                  value={form.phone}
                  onChange={set("phone")}
                  autoComplete="tel"
                />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="eyebrow text-gold">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Address" required error={errors.address_1}>
                  <input
                    className={cn(baseField, border(errors.address_1))}
                    value={form.address_1}
                    onChange={set("address_1")}
                    autoComplete="address-line1"
                  />
                </Field>
              </div>
              <Field label="City" required error={errors.city}>
                <input
                  className={cn(baseField, border(errors.city))}
                  value={form.city}
                  onChange={set("city")}
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="State / Region">
                <input
                  className={cn(baseField, border())}
                  value={form.state}
                  onChange={set("state")}
                  autoComplete="address-level1"
                />
              </Field>
              <Field label="Postcode" required error={errors.postcode}>
                <input
                  inputMode="numeric"
                  className={cn(baseField, border(errors.postcode))}
                  value={form.postcode}
                  onChange={set("postcode")}
                  autoComplete="postal-code"
                />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input
                  className={cn(baseField, border(errors.country))}
                  value={form.country}
                  onChange={set("country")}
                  autoComplete="country"
                />
              </Field>
            </div>
          </section>

          {error && (
            <p
              className="border border-[var(--color-danger)]/40 bg-[color-mix(in_srgb,var(--color-danger)_8%,transparent)] px-4 py-3 text-sm text-[var(--color-danger)]"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        {/* summary */}
        <aside className="h-fit border border-line p-6 lg:sticky lg:top-32">
          <h2 className="font-serif text-2xl font-light text-ink">Your order</h2>
          <ul className="mt-5 space-y-3 border-b border-line pb-5">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex justify-between gap-3 text-sm"
              >
                <span className="text-ink">
                  {line.product.name}
                  {line.variant && (
                    <span className="text-muted"> · {line.variant}</span>
                  )}
                  <span className="tnum text-muted"> × {line.quantity}</span>
                </span>
                <span className="tnum shrink-0 text-ink">
                  {formatMoney(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-3 text-sm">
            <Summary label="Subtotal" value={formatMoney(subtotal)} />
            {discount > 0 && (
              <Summary
                label={`Discount (${coupon?.code})`}
                value={`− ${formatMoney(discount)}`}
                accent
              />
            )}
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="font-medium text-ink">Total</dt>
              <dd className="tnum text-lg font-medium text-ink">
                {formatMoney(total)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Placing order…" : "Place order"}
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-faint">
            <Lock className="h-3 w-3" aria-hidden="true" />
            Order created in WooCommerce. No payment is collected in this demo.
          </p>

          <Link
            href="/cart"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to bag
          </Link>
        </aside>
      </form>
    </div>
  );
}

const border = (error?: string) =>
  error ? "border-[var(--color-danger)]" : "border-line focus:border-gold";

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block text-muted">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </label>
  );
}

function Summary({
  label,
  value,
  emphasize,
  accent,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={emphasize ? "font-medium text-ink" : "text-muted"}>
        {label}
      </dt>
      <dd
        className={
          emphasize
            ? "tnum font-medium text-ink"
            : accent
              ? "tnum text-[var(--color-ok)]"
              : "tnum text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}
