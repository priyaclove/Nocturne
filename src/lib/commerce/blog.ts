import type { JournalPost } from "./types";

/* The Nocturne Journal — editorial content (mock). Dates are ISO strings. */

// Demo cover photography (curated Unsplash, 3:2).
const C = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&h=1066&q=70`;

const COVERS: Record<string, string> = {
  "the-case-for-fewer-better-things": C("1591047139829-d91aecb6caea"),
  "how-leather-earns-its-patina": C("1548036328-c9fa89d128fa"),
  "an-evening-ritual-worth-keeping": C("1603006905003-be475563bc59"),
  "sourcing-notes-the-nocturne-blend": C("1447933601403-0c6688de566e"),
};

const basePosts: JournalPost[] = [
  {
    slug: "the-case-for-fewer-better-things",
    title: "The Case for Fewer, Better Things",
    excerpt:
      "On buying slowly, living with objects that age well, and the quiet luxury of restraint.",
    category: "Philosophy",
    author: "Elena Vasseur",
    date: "2026-09-28",
    readingMinutes: 6,
    featured: true,
    body: [
      "There is a particular kind of calm that comes from owning less. Not the austerity of empty rooms, but the ease of being surrounded only by things you have chosen deliberately — objects that earn their place by being useful, beautiful, or both.",
      "We have built Nocturne around a single conviction: that fewer, better things make for a fuller life. A single well-cut overcoat worn for a decade tells a richer story than a closet of forgotten purchases. A hand-thrown bowl that bears the mark of its maker carries a presence that mass production cannot imitate.",
      "This is not about spending more. It is about spending once, and spending well. About choosing the piece you will still reach for in five years, and letting everything else fall away.",
      "The things that last are rarely the loudest. They are considered, quietly made, and built to be lived with. That is the whole of our catalogue, and the whole of our philosophy.",
    ],
  },
  {
    slug: "how-leather-earns-its-patina",
    title: "How Leather Earns Its Patina",
    excerpt:
      "Vegetable-tanned leather only improves with use. A short field guide to the marks of a life well-carried.",
    category: "Craft",
    author: "Marcus Oyelaran",
    date: "2026-09-12",
    readingMinutes: 4,
    body: [
      "Full-grain, vegetable-tanned leather is one of the few materials that looks better the harder you use it. Where synthetics crack and peel, good leather deepens — absorbing light, oil, and the small accidents of daily life into a surface uniquely yours.",
      "The process is slow by design. Tanned with bark and plant extracts rather than chemicals, the hide keeps its natural character: the grain, the occasional scar, the subtle variation across a single piece.",
      "Carry a vegetable-tanned tote for a season and you will see it begin. The corners darken first, then the handles, then the body — until the bag reads less like a product and more like a record.",
      "Our advice: use it, and use it often. Patina cannot be bought. It can only be earned.",
    ],
  },
  {
    slug: "an-evening-ritual-worth-keeping",
    title: "An Evening Ritual Worth Keeping",
    excerpt:
      "Slow fragrance, warm light, and the small ceremonies that mark the end of a day.",
    category: "Living",
    author: "Sana Okafor",
    date: "2026-08-30",
    readingMinutes: 5,
    body: [
      "The end of the day deserves more than a hurried collapse. A ritual — however small — draws a line between the noise of the hours behind you and the rest ahead.",
      "Ours begins with light. A single blackened-brass taper, lit before anything else, turns a room from functional to considered in a moment. Then fragrance: a few drops of something warm and resinous on the wrist, amber and oud, slow to fade.",
      "Finally, care. A serum worked into the skin while the mind unwinds; a balm for the hands that carried the day. None of it takes long. That is rather the point.",
      "Luxury, at its best, is not excess. It is attention — paid slowly, to small things, at the right hour.",
    ],
  },
  {
    slug: "sourcing-notes-the-nocturne-blend",
    title: "Sourcing Notes: The Nocturne Blend",
    excerpt:
      "Where our dark roast comes from, why we roast to order, and how to brew it at home.",
    category: "Pantry",
    author: "Marcus Oyelaran",
    date: "2026-08-14",
    readingMinutes: 4,
    body: [
      "Our house roast begins with a single-origin Colombian lot grown at altitude, where cooler nights slow the cherries and concentrate their sweetness. We roast it dark but stop short of bitter — chasing cocoa, date, and a whisper of black cherry.",
      "We roast to order in small batches. Coffee is at its best within weeks of roasting, and shipping it fresh matters more than any tasting note we could print on the bag.",
      "At home, keep it simple: a burr grinder, water just off the boil, and a ratio of around sixteen parts water to one part coffee. Let it bloom for thirty seconds before the main pour.",
      "Brewed well, it needs nothing added. Brewed carelessly, no bean can save it. The ceremony is half the pleasure.",
    ],
  },
];

const posts: JournalPost[] = basePosts.map((p) => ({
  ...p,
  cover: COVERS[p.slug] ?? p.cover,
}));

export function getPosts(): JournalPost[] {
  return posts;
}

export function getFeaturedPost(): JournalPost {
  return posts.find((p) => p.featured) ?? posts[0];
}

export function getPostBySlug(slug: string): JournalPost | undefined {
  return posts.find((p) => p.slug === slug);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatPostDate(iso: string): string {
  // Parse the ISO string explicitly (no reliance on runtime "now").
  const [y, m, d] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(y, m - 1, d)));
}
