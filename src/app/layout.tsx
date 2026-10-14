import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MiniCart } from "@/components/cart/MiniCart";
import { Loader } from "@/components/ui/Loader";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nocturne — A House of Considered Living",
    template: "%s · Nocturne",
  },
  description:
    "Nocturne is a dark-luxe house of goods — apparel, footwear, accessories, beauty, home and pantry. Fewer, better things, chosen slowly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* Apply the saved theme before paint to prevent a flash of the wrong
            palette. Defaults to light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nocturne.theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.loader-root{display:none!important}`}</style>
        </noscript>
        <Loader />
        <div className="grain" aria-hidden="true" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-gold focus:bg-bg focus:px-4 focus:py-2 focus:text-sm focus:text-gold"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MiniCart />
        </CartProvider>
      </body>
    </html>
  );
}
