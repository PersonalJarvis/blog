// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://blog.personaljarvis.ai",
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: "github-dark-dimmed", wrap: false },
  },
  server: { port: 4410, host: "127.0.0.1" },
  vite: { plugins: [tailwindcss()], server: { strictPort: true } },
});
