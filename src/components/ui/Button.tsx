import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-1 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  // Antique metallic gold — the single primary action in a view.
  gold: "bg-gold-gradient text-[var(--color-on-gold)] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] hover:shadow-[0_8px_24px_-10px_rgba(166,132,60,0.7)] active:brightness-97",
  solid: "bg-ink text-bg hover:opacity-90 active:opacity-95",
  outline:
    "relative border border-[color-mix(in_srgb,var(--color-gold)_55%,transparent)] text-gold hover:border-gold hover:bg-[color-mix(in_srgb,var(--color-gold)_8%,transparent)]",
  ghost: "text-ink hover:text-gold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[0.65rem]",
  md: "h-11 px-7 text-[0.7rem]",
  lg: "h-14 px-9 text-[0.72rem]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = Common & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >;

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = "gold", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorRest } = rest as AnchorProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
