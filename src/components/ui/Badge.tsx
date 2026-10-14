import { cn } from "@/lib/utils";

type Tone = "gold" | "outline" | "sale";

const tones: Record<Tone, string> = {
  gold: "bg-gold-gradient text-[var(--color-on-gold)]",
  outline: "border border-line text-ink",
  sale: "bg-[var(--color-danger)] text-white",
};

export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
