import type { APIRoute, GetStaticPaths } from "astro";
import { formatDate, getPosts, readingMinutes } from "@/lib";
import { renderOg, type OgCard } from "@/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  const cards: { slug: string; card: OgCard }[] = [
    {
      slug: "default",
      card: {
        title: "Notes from building Personal Jarvis",
        label: "New features, field notes and tips",
        meta: "personaljarvis.ai/blog",
      },
    },
    ...posts.map((p) => ({
      slug: p.id,
      card: {
        title: p.data.title,
        label: p.data.series ?? p.data.category,
        meta: `${formatDate(p.data.pubDate)} · ${readingMinutes(p.body)} min read`,
        cover: p.data.cover && `src/assets/posts/${p.id}/${p.data.cover}`,
      },
    })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.card as OgCard);
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
