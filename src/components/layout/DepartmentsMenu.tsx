"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { departments, getDepartmentCount } from "@/lib/commerce/products";
import { departmentIcons } from "@/lib/commerce/department-icons";
import { cn } from "@/lib/utils";

/** Desktop "Departments" dropdown — opens on hover and keyboard focus. */
export function DepartmentsMenu() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={show}
        onBlur={hide}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="inline-flex items-center gap-1 text-sm text-ink transition-colors hover:text-gold"
      >
        Departments
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-4"
        >
          <div className="rise border border-line bg-surface p-2 shadow-2xl">
            <ul className="grid grid-cols-2 gap-1">
              {departments.map((dept) => {
                const Icon = departmentIcons[dept.slug];
                return (
                  <li key={dept.slug}>
                    <Link
                      href={`/category/${dept.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 p-3 transition-colors hover:bg-surface-2"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-line text-gold">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="text-sm text-ink">{dept.label}</span>
                          <span className="tnum text-[0.625rem] text-muted">
                            {getDepartmentCount(dept.slug)}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-muted">
                          {dept.tagline}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
