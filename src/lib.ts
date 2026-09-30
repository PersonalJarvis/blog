import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/** Published posts, newest first. Drafts only show on the dev server. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Minutes to read at 230 words per minute, counting prose only. */
export function readingMinutes(body: string | undefined): number {
  const text = (body ?? "")
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/```[\s\S]*?```/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

/** A site-internal path with the /blog base prefixed: href("x/") -> "/blog/x/". */
export function href(path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Version of the social card design, sent as ?v= on og:image. X and LinkedIn
 * cache a card image by its URL for days; bump this when src/og.ts changes
 * how cards look, or shares keep showing the old design.
 */
export const OG_VERSION = 2;

export const SITE = {
  title: "Personal Jarvis Blog",
  tagline: "What we ship, what we measure while shipping it, and how to get more out of an AI assistant on your own machine.",
  main: "https://personaljarvis.ai",
  github: "https://github.com/PersonalJarvis/PersonalJarvis",
};

/** How a category reads on the page; the schema enum stays the URL key. */
export const CATEGORY_LABEL: Record<Post["data"]["category"], string> = {
  features: "Features",
  tips: "Tips",
  agents: "Coding agents",
  voice: "Voice",
  engineering: "Engineering",
};

/** The index filtered to one category: a plain link that works without JS. */
export function categoryHref(category: Post["data"]["category"]): string {
  return href(`?category=${category}#posts`);
}
