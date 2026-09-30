import type { APIRoute, GetStaticPaths } from "astro";
import { CATEGORY_LABEL, CATEGORY_TONE, formatDate, getPosts, illustration, readingMinutes } from "@/lib";
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
        tone: CATEGORY_TONE.agents,
        drawing: illustration("default"),
      },
    },
    ...posts.map((p) => ({
      slug: p.id,
      card: {
        title: p.data.title,
        label: p.data.series ?? CATEGORY_LABEL[p.data.category],
        meta: `${formatDate(p.data.pubDate)} · ${readingMinutes(p.body)} min read`,
        tone: CATEGORY_TONE[p.data.category],
        drawing: illustration(p.id),
      },
    })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: { card } }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.card as OgCard);
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
