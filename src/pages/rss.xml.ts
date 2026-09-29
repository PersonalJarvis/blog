import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, SITE } from "@/lib";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.tagline,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/${p.id}/`,
      categories: [p.data.category],
    })),
    customData: "<language>en-us</language>",
  });
}
