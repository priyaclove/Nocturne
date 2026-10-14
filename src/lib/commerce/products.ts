import type { Department, DepartmentSlug, Product } from "./types";

/*
  NOCTURNE mock catalog — the initial product data access implementation.
  All prices in integer CENTS. Products are original, fictional items.
*/

export const departments: Department[] = [
  {
    slug: "apparel",
    label: "Apparel",
    tagline: "Quiet tailoring",
    description:
      "Considered garments in natural fibres — built to be worn for years, not seasons.",
  },
  {
    slug: "footwear",
    label: "Footwear",
    tagline: "Walk softly",
    description: "Hand-finished leather and minimal silhouettes for every hour.",
  },
  {
    slug: "accessories",
    label: "Accessories",
    tagline: "The finishing note",
    description: "Leather, metal and horn — the small things that carry weight.",
  },
  {
    slug: "beauty",
    label: "Beauty & Wellness",
    tagline: "Nightly ritual",
    description: "Botanical formulas and slow fragrance for the end of the day.",
  },
  {
    slug: "home",
    label: "Home & Objects",
    tagline: "Lived-in luxury",
    description: "Hand-thrown, hand-poured, hand-finished pieces for the home.",
  },
  {
    slug: "pantry",
    label: "Pantry",
    tagline: "A fuller table",
    description: "Single-origin and small-batch provisions worth savouring.",
  },
];

// Demo photography (curated Unsplash). Swap these for your own by editing the
// map, or override locally by dropping files in public/products/ (see IMAGES.md).
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&h=1250&q=70`;

const PRODUCT_IMAGES: Record<string, string[]> = {
  "monolith-wool-overcoat": [U("1539533113208-f6df8cc8b543")],
  "cashmere-crew-ash": [U("1576566588028-4147f3842f27")],
  "silk-blend-shirt-noir": [U("1602810318383-e386cc2a3ccf")],
  "hand-welted-derby-espresso": [U("1549298916-b41d501d3772")],
  "minimal-leather-sneaker-bone": [U("1460353581641-37baddab0fa2")],
  "brushed-gold-signet": [U("1605100804763-247f67b3557e")],
  "full-grain-leather-tote-cognac": [U("1584917865442-de89df76afd3")],
  "tortoise-optical-frames": [U("1574258495973-f010dfbb5371")],
  "midnight-renewal-serum": [U("1620916566398-39f1143ab7be")],
  "amber-oud-eau-de-parfum": [U("1541643600914-78b084683601")],
  "botanical-hand-balm": [U("1556228578-8c89e6adf883")],
  "hand-thrown-stoneware-set": [U("1610701596007-11502861dcfa")],
  "linen-bedding-clay": [U("1522771739844-6a9f6d5f14af")],
  "blackened-brass-candleholder": [U("1603006905003-be475563bc59")],
  "sculpted-ceramic-vase": [U("1578749556568-bc2c40e68b61")],
  "nocturne-blend-single-origin": [U("1559056199-641a0ac8b55e")],
  "aged-balsamic-reserve": [U("1474979266404-7eaacbcd87c5")],
  "wildflower-raw-honey": [U("1587049352846-4a222e784d38")],
};

const baseProducts: Product[] = [
  // — Apparel —
  {
    id: "n-01",
    slug: "monolith-wool-overcoat",
    name: "Monolith Wool Overcoat",
    department: "apparel",
    subtitle: "Double-faced Italian wool",
    description:
      "A floor-skimming, single-breasted overcoat cut from double-faced virgin wool. Unlined and raw-edged, it drapes with weight and softens with wear.",
    details: [
      "100% virgin wool, milled in Biella",
      "Unlined, hand-finished seams",
      "Horn buttons, welt pockets",
    ],
    price: 68000,
    images: [],
    colors: ["Charcoal", "Camel", "Noir"],
    sizes: ["XS", "S", "M", "L", "XL"],
    origin: "Tailored in Portugal",
    badge: "bestseller",
    inStock: true,
    featured: true,
  },
  {
    id: "n-02",
    slug: "cashmere-crew-ash",
    name: "Cashmere Crew — Ash",
    department: "apparel",
    subtitle: "Grade-A Mongolian cashmere",
    description:
      "A mid-weight crew knit in grade-A cashmere, fully fashioned for a clean shoulder and a collar that holds its shape.",
    details: ["12-gauge grade-A cashmere", "Fully fashioned", "Ribbed trims"],
    price: 24500,
    compareAtPrice: 29500,
    images: [],
    colors: ["Ash", "Oat", "Ink"],
    sizes: ["S", "M", "L", "XL"],
    origin: "Knit in Scotland",
    inStock: true,
    featured: true,
  },
  {
    id: "n-03",
    slug: "silk-blend-shirt-noir",
    name: "Silk-Blend Shirt — Noir",
    department: "apparel",
    subtitle: "Sandwashed silk & cotton",
    description:
      "A fluid, sand-washed silk-cotton shirt with a soft camp collar. Matte, weighty, and quietly luxurious.",
    details: ["70% silk, 30% cotton", "Sandwashed matte finish", "Corozo buttons"],
    price: 18500,
    images: [],
    colors: ["Noir", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  // — Footwear —
  {
    id: "n-04",
    slug: "hand-welted-derby-espresso",
    name: "Hand-Welted Derby — Espresso",
    department: "footwear",
    subtitle: "Goodyear-welted calf leather",
    description:
      "A plain-toe derby built on a Goodyear welt for resoling and a lifetime of wear. Burnished espresso calf over a leather sole.",
    details: ["Goodyear-welted construction", "Vegetable-tanned calf", "Leather sole"],
    price: 42000,
    images: [],
    sizes: ["40", "41", "42", "43", "44", "45"],
    origin: "Made in England",
    badge: "limited",
    inStock: true,
    featured: true,
  },
  {
    id: "n-05",
    slug: "minimal-leather-sneaker-bone",
    name: "Minimal Leather Sneaker — Bone",
    department: "footwear",
    subtitle: "Full-grain, tonal",
    description:
      "A pared-back low-top in full-grain leather with a tonal cupsole. No logos — just clean lines and a soft footbed.",
    details: ["Full-grain Italian leather", "Tonal cupsole", "Removable footbed"],
    price: 23000,
    images: [],
    sizes: ["40", "41", "42", "43", "44", "45"],
    inStock: true,
  },
  // — Accessories —
  {
    id: "n-06",
    slug: "brushed-gold-signet",
    name: "Brushed Gold Signet",
    department: "accessories",
    subtitle: "Recycled 14k vermeil",
    description:
      "A weighty signet in brushed 14k gold vermeil over recycled silver. A modern heirloom with a softly domed face.",
    details: ["14k gold vermeil", "Recycled sterling core", "Brushed finish"],
    price: 19500,
    images: [],
    sizes: ["52", "54", "56", "58"],
    badge: "new",
    inStock: true,
    featured: true,
  },
  {
    id: "n-07",
    slug: "full-grain-leather-tote-cognac",
    name: "Full-Grain Leather Tote — Cognac",
    department: "accessories",
    subtitle: "Vegetable-tanned, unlined",
    description:
      "A structured east-west tote in vegetable-tanned cognac leather that patinas beautifully. Unlined, with a single interior slip.",
    details: ["Vegetable-tanned full-grain", "Unlined interior", "Edge-painted straps"],
    price: 32000,
    compareAtPrice: 38000,
    images: [],
    inStock: true,
  },
  {
    id: "n-08",
    slug: "tortoise-optical-frames",
    name: "Tortoise Optical Frames",
    department: "accessories",
    subtitle: "Italian acetate",
    description:
      "Hand-polished frames cut from Mazzucchelli acetate with a warm tortoise grain and titanium core wire.",
    details: ["Mazzucchelli acetate", "Titanium core", "Hand polished"],
    price: 16500,
    images: [],
    inStock: false,
  },
  // — Beauty & Wellness —
  {
    id: "n-09",
    slug: "midnight-renewal-serum",
    name: "Midnight Renewal Serum",
    department: "beauty",
    subtitle: "Bakuchiol & squalane",
    description:
      "A slow, overnight serum pairing gentle bakuchiol with plant squalane to renew while you sleep. Unscented, non-greasy.",
    details: ["Bakuchiol (retinol alternative)", "Plant squalane", "Fragrance-free"],
    price: 8800,
    images: [],
    badge: "bestseller",
    inStock: true,
    featured: true,
  },
  {
    id: "n-10",
    slug: "amber-oud-eau-de-parfum",
    name: "Amber & Oud Eau de Parfum",
    department: "beauty",
    subtitle: "50ml · slow fragrance",
    description:
      "A warm, resinous evening scent — amber and oud over a soft leather base. Long-wearing and quietly intense.",
    details: ["Amber, oud, soft leather", "20% concentration", "50ml refillable flacon"],
    price: 14500,
    images: [],
    inStock: true,
    featured: true,
  },
  {
    id: "n-11",
    slug: "botanical-hand-balm",
    name: "Botanical Hand Balm",
    department: "beauty",
    subtitle: "Shea & sweet almond",
    description:
      "A fast-absorbing balm rich in shea and sweet almond oil, lightly scented with vetiver and bergamot.",
    details: ["Shea butter base", "Vetiver & bergamot", "75ml aluminium tube"],
    price: 3200,
    images: [],
    inStock: true,
  },
  // — Home & Objects —
  {
    id: "n-12",
    slug: "hand-thrown-stoneware-set",
    name: "Hand-Thrown Stoneware Set",
    department: "home",
    subtitle: "Set of four · reactive glaze",
    description:
      "Four hand-thrown stoneware bowls finished in a reactive ash glaze — each one quietly different from the next.",
    details: ["Hand-thrown stoneware", "Reactive ash glaze", "Dishwasher safe"],
    price: 12800,
    images: [],
    badge: "limited",
    inStock: true,
    featured: true,
  },
  {
    id: "n-13",
    slug: "linen-bedding-clay",
    name: "Linen Bedding — Clay",
    department: "home",
    subtitle: "Stonewashed French flax",
    description:
      "A stonewashed linen duvet set in soft clay, woven from European flax and pre-washed for a lived-in drape.",
    details: ["100% French flax linen", "Stonewashed", "Coconut-shell buttons"],
    price: 28500,
    images: [],
    inStock: true,
  },
  {
    id: "n-14",
    slug: "blackened-brass-candleholder",
    name: "Blackened Brass Candleholder",
    department: "home",
    subtitle: "Solid cast brass",
    description:
      "A low, solid brass taper holder with a blackened patina that catches light at the edges. Weighted and quietly sculptural.",
    details: ["Solid cast brass", "Blackened patina", "Felted base"],
    price: 9500,
    images: [],
    badge: "new",
    inStock: true,
  },
  {
    id: "n-15",
    slug: "sculpted-ceramic-vase",
    name: "Sculpted Ceramic Vase",
    department: "home",
    subtitle: "Matte bone finish",
    description:
      "A sculptural vase with an off-round mouth and a chalky matte-bone glaze. Equally striking empty or filled.",
    details: ["Slip-cast ceramic", "Matte bone glaze", "Watertight interior"],
    price: 11000,
    images: [],
    inStock: true,
  },
  // — Pantry —
  {
    id: "n-16",
    slug: "nocturne-blend-single-origin",
    name: "Nocturne Blend — Single Origin",
    department: "pantry",
    subtitle: "Dark roast · 340g",
    description:
      "A deep, low-acid single-origin roast with notes of cocoa, date and black cherry. Roasted in small batches to order.",
    details: ["Single-origin Colombian", "Dark roast", "340g valve bag"],
    price: 2400,
    images: [],
    badge: "bestseller",
    inStock: true,
    featured: true,
  },
  {
    id: "n-17",
    slug: "aged-balsamic-reserve",
    name: "Aged Balsamic Reserve",
    department: "pantry",
    subtitle: "12-year · Modena",
    description:
      "A 12-year aged balsamic from Modena — syrupy, glossy and complex. A few drops is all it takes.",
    details: ["Aged 12 years", "DOP Modena", "250ml"],
    price: 4200,
    compareAtPrice: 4800,
    images: [],
    inStock: true,
  },
  {
    id: "n-18",
    slug: "wildflower-raw-honey",
    name: "Wildflower Raw Honey",
    department: "pantry",
    subtitle: "Unfiltered · 400g",
    description:
      "Raw, unfiltered wildflower honey with a soft floral finish, jarred by a single apiary.",
    details: ["Raw & unfiltered", "Single apiary", "400g glass jar"],
    price: 1900,
    images: [],
    inStock: true,
  },
];

// Attach demo photography (local public/ files still take precedence at render).
const products: Product[] = baseProducts.map((p) => ({
  ...p,
  images: PRODUCT_IMAGES[p.slug] ?? p.images,
}));

// --- Data access boundary ---

export function getProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByDepartment(dept: DepartmentSlug): Product[] {
  return products.filter((p) => p.department === dept);
}

export function getDepartment(slug: string): Department | undefined {
  return departments.find((d) => d.slug === slug);
}

export function getDepartmentCount(slug: DepartmentSlug): number {
  return products.filter((p) => p.department === slug).length;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.department === product.department && p.slug !== product.slug)
    .slice(0, limit);
}
