import Link from "next/link";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Logo";
import { CartTrigger } from "./CartTrigger";
import { ThemeToggle } from "./ThemeToggle";
import { DepartmentsMenu } from "./DepartmentsMenu";
import { MobileNav, type NavLink } from "./MobileNav";

const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "/shop" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Header() {
  return (
    <div className="sticky top-0 z-50 bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <AnnouncementBar />
      <header className="border-b border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4">
          {/* left — mobile menu + desktop nav */}
          <div className="flex items-center gap-6">
            <MobileNav links={NAV_LINKS} />
            <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
              <Link
                href="/shop"
                className="text-sm text-ink transition-colors hover:text-gold"
              >
                Shop All
              </Link>
              <DepartmentsMenu />
            </nav>
          </div>

          {/* center — logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* right — nav + bag */}
          <div className="flex items-center justify-end gap-6">
            <nav aria-label="Secondary" className="hidden items-center gap-6 lg:flex">
              <Link
                href="/blog"
                className="text-sm text-ink transition-colors hover:text-gold"
              >
                Journal
              </Link>
              <Link
                href="/about"
                className="text-sm text-ink transition-colors hover:text-gold"
              >
                About
              </Link>
            </nav>
            <ThemeToggle />
            <CartTrigger />
          </div>
        </div>
      </header>
    </div>
  );
}
