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

export const SITE = {
  title: "Personal Jarvis Blog",
  tagline: "New features, field notes and tips for running your own desktop AI.",
  main: "https://personaljarvis.ai",
  github: "https://github.com/PersonalJarvis/PersonalJarvis",
};
