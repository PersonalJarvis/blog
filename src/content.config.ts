import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** The categories a post can live in. Order here is the order of the index tabs. */
export const CATEGORIES = ["features", "tips", "agents", "voice", "engineering"] as const;

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** One sentence, shown under the title and used as the meta description. */
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("The Personal Jarvis team"),
    category: z.enum(CATEGORIES),
    /** Optional series prefix, e.g. "Using Jarvis". */
    series: z.string().optional(),
    /** Jarvis version the post was written against, e.g. "1.4". */
    version: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
