# NOCTURNE — Images

The site now ships with **real demo photography** (curated Unsplash URLs) so you
can see how images look in both light and dark themes. Each image falls back to
an on-brand generated panel if a URL ever fails — so you never see a broken image.

## How images are set

Product photos come from the **`PRODUCT_IMAGES` map** in
`src/lib/commerce/products.ts`, and journal covers from the **`COVERS` map** in
`src/lib/commerce/blog.ts`. To use your own image for any item, just change its
URL in that map. Two options for the value:

1. **A remote URL** — `"https://your-cdn.com/coat.jpg"`. Add the host to
   `remotePatterns` in `next.config.ts` (Unsplash is already allowed).
2. **A local file** — set it to `"/products/<slug>.jpg"` and drop the file into
   `public/products/` using the table below.

> Removing an item from the map makes it look for `public/products/<slug>.jpg`
> automatically, then the generated panel.

---

## 1. Product image specs → `public/products/`

- **Format:** `.jpg` / `.webp`
- **Shape:** portrait **4 : 5** (taller than wide)
- **Recommended size:** **1200 × 1500 px**, under ~300 KB each
- **Style tip (à la Timzee):** shoot/crop on a consistent light, neutral
  background so the grid looks cohesive and premium. Product centered.

| File name to add | Product |
|---|---|
| `public/products/monolith-wool-overcoat.jpg` | Monolith Wool Overcoat *(also used as the homepage hero image)* |
| `public/products/cashmere-crew-ash.jpg` | Cashmere Crew — Ash |
| `public/products/silk-blend-shirt-noir.jpg` | Silk-Blend Shirt — Noir |
| `public/products/hand-welted-derby-espresso.jpg` | Hand-Welted Derby — Espresso |
| `public/products/minimal-leather-sneaker-bone.jpg` | Minimal Leather Sneaker — Bone |
| `public/products/brushed-gold-signet.jpg` | Brushed Gold Signet |
| `public/products/full-grain-leather-tote-cognac.jpg` | Full-Grain Leather Tote — Cognac |
| `public/products/tortoise-optical-frames.jpg` | Tortoise Optical Frames |
| `public/products/midnight-renewal-serum.jpg` | Midnight Renewal Serum |
| `public/products/amber-oud-eau-de-parfum.jpg` | Amber & Oud Eau de Parfum |
| `public/products/botanical-hand-balm.jpg` | Botanical Hand Balm |
| `public/products/hand-thrown-stoneware-set.jpg` | Hand-Thrown Stoneware Set |
| `public/products/linen-bedding-clay.jpg` | Linen Bedding — Clay |
| `public/products/blackened-brass-candleholder.jpg` | Blackened Brass Candleholder |
| `public/products/sculpted-ceramic-vase.jpg` | Sculpted Ceramic Vase |
| `public/products/nocturne-blend-single-origin.jpg` | Nocturne Blend — Single Origin |
| `public/products/aged-balsamic-reserve.jpg` | Aged Balsamic Reserve |
| `public/products/wildflower-raw-honey.jpg` | Wildflower Raw Honey |

---

## 2. Journal (blog) cover images → `public/journal/`

- **Format:** `.jpg`
- **Shape:** landscape **3 : 2**
- **Recommended size:** **1600 × 1067 px**, under ~400 KB each

| File name to add | Article |
|---|---|
| `public/journal/the-case-for-fewer-better-things.jpg` | The Case for Fewer, Better Things |
| `public/journal/how-leather-earns-its-patina.jpg` | How Leather Earns Its Patina |
| `public/journal/an-evening-ritual-worth-keeping.jpg` | An Evening Ritual Worth Keeping |
| `public/journal/sourcing-notes-the-nocturne-blend.jpg` | Sourcing Notes: The Nocturne Blend |

---

## 3. Where to find images

Use your own product photos, or royalty-free sources such as **Unsplash**,
**Pexels**, or **Pixabay** (free for commercial use). Download, rename to match
the table above, and drop into the folder.

> If you prefer to load images from a remote URL instead of `/public`, set the
> product's `images: ["https://…"]` in `src/lib/commerce/products.ts` **and** add
> that image host to `remotePatterns` in `next.config.ts`.

---

## 4. Optional

- **Favicon / brand tile:** `src/app/icon.svg` (already a gold crescent — edit if
  you want a different mark).
- **Open Graph / social share image:** add `public/og.jpg` (1200 × 630) and
  reference it from `metadata.openGraph` in `src/app/layout.tsx` if you want rich
  link previews.
