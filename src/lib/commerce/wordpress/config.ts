/*
  WordPress / WooCommerce connection config.

  These are read from environment variables (set in .env.local — see
  .env.example). They are SERVER-ONLY: because the names have no NEXT_PUBLIC_
  prefix, Next.js strips them from the browser bundle, so the secret can never
  reach the client. Only import this module from Server Components / server code.
*/

export const wpConfig = {
  /** Base WordPress site URL, e.g. https://shop.example.com (no trailing slash). */
  url: (process.env.WORDPRESS_URL ?? "").replace(/\/$/, ""),
  /** WooCommerce REST API consumer key (ck_...). */
  consumerKey: process.env.WOOCOMMERCE_KEY ?? "",
  /** WooCommerce REST API consumer secret (cs_...). */
  consumerSecret: process.env.WOOCOMMERCE_SECRET ?? "",
  /** Seconds to cache catalog responses (ISR). */
  revalidateSeconds: Number(process.env.WORDPRESS_REVALIDATE ?? "300"),
};

/** True only when all three WordPress/WooCommerce values are present. */
export function isWordPressConfigured(): boolean {
  return Boolean(
    wpConfig.url && wpConfig.consumerKey && wpConfig.consumerSecret,
  );
}
