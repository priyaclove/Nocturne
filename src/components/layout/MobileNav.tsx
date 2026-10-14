"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { departments } from "@/lib/commerce/products";
import { departmentIcons } from "@/lib/commerce/department-icons";
import { CrescentMark } from "./Logo";

export interface NavLink {
  label: string;
  href: string;
}

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(90vw,24rem)] flex-col border-r border-line bg-bg">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="inline-flex items-center gap-2 text-ink">
                <CrescentMark className="h-4 w-4 text-gold" />
                <span className="font-serif uppercase tracking-[0.3em]">Menu</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center text-muted hover:text-gold"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav aria-label="Primary">
                <ul className="space-y-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 font-serif text-xl font-light text-ink hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <p className="eyebrow mt-8 text-muted">Departments</p>
              <ul className="mt-3 space-y-0.5">
                {departments.map((dept) => {
                  const Icon = departmentIcons[dept.slug];
                  return (
                    <li key={dept.slug}>
                      <Link
                        href={`/category/${dept.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 py-2.5 text-sm text-ink hover:text-gold"
                      >
                        <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
                        {dept.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
