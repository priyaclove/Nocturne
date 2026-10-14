import { Button } from "@/components/ui/Button";
import { CrescentMark } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <CrescentMark className="h-8 w-8 text-gold" />
      <p className="eyebrow mt-8 text-muted">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl font-light tracking-tight text-ink">
        Lost after dark
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
        The page you&apos;re looking for has slipped out of view. Let&apos;s find
        your way back.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/" size="lg">
          Return home
        </Button>
        <Button href="/shop" variant="outline" size="lg">
          Shop all
        </Button>
      </div>
    </div>
  );
}
