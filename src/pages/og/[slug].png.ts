import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts, SITE } from "@/lib";
import { renderOg } from "@/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return [
    { params: { slug: "default" }, props: { title: "Notes from building Personal Jarvis", label: "Blog" } },
    ...posts.map((p) => ({
      params: { slug: p.id },
      props: { title: p.data.title, label: p.data.series ?? p.data.category },
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg({ title: props.title as string, label: (props.label as string) ?? SITE.title });
  return new Response(png as BodyInit, { headers: { "Content-Type": "image/png" } });
};
