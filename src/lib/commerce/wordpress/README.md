# WordPress / WooCommerce integration

This folder is the **bridge** between the NOCTURNE frontend and a headless
WordPress + WooCommerce backend. WordPress itself is **not** here — it's a
separate installation. This code just fetches from it.

```
Next.js (this app)  ──HTTP──▶  WordPress + WooCommerce (separate install)
       getCatalog()             wp-json/wc/v3/products
```

## Files

| File | Role |
|------|------|
| `config.ts` | Reads env vars; `isWordPressConfigured()` |
| `client.ts` | Low-level authenticated WooCommerce REST fetch (cached) |
| `map.ts` | Converts WooCommerce JSON → our `Product` type |
| `catalog.ts` | High-level `getCatalog()`, `getCatalogProduct()`, … with mock fallback |
| `index.ts` | Public exports |

## How it behaves

Every function **falls back to the bundled mock data** when WordPress isn't
configured or a request fails — so the site always works. Set the env vars and
real products appear automatically; no page code changes.

## Setup (one time)

### 1. Stand up WordPress (separate from this project)
- Local: [LocalWP](https://localwp.com) or `npx @wordpress/env start`.
- Hosted: any WordPress host.

### 2. Install & configure WooCommerce
- Install the **WooCommerce** plugin, run the setup wizard.
- Add products. For categories, use these slugs so they map to our departments:
  `apparel`, `footwear`, `accessories`, `beauty`, `home`, `pantry`
  (anything else maps to `home` — adjust `map.ts` → `toDepartment` to taste).
- **Settings → Permalinks → Post name.**

### 3. Create REST API keys
- WooCommerce → **Settings → Advanced → REST API → Add key**.
- Permission: **Read** (Read/Write only when you add checkout later).
- Copy the **Consumer key** and **Consumer secret**.

### 4. Point NOCTURNE at it
- Copy `.env.example` → `.env.local`, fill in `WORDPRESS_URL`,
  `WOOCOMMERCE_KEY`, `WOOCOMMERCE_SECRET`.
- Add your WP media hostname to `next.config.ts` → `images.remotePatterns`
  (so product photos load through next/image).
- Restart `npm run dev`. Done — the catalog is now live from WordPress.

## Which pages use it

Already wired (Server Components): **/shop**, **/category/[slug]**,
**/products/[slug]**. They call the `getCatalog*` functions, so they switch to
WordPress automatically.

## Still on mock (intentionally, for now)

- **Homepage** editorial sections, **search suggestions** (client-side), and the
  **cart line resolution** still read the bundled data. The cleanest next step
  for a fully-live store is:
  - store a product snapshot in each cart entry at add-time (so the cart doesn't
    need a client-side product lookup), and
  - add a small `/api/search` route so header suggestions query WordPress.
- **Checkout** is intentionally not implemented — it needs server-side order
  creation, payment, and validation (WooCommerce Store API / Checkout).
