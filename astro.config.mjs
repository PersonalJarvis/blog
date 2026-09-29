// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Served at personaljarvis.ai/blog/: GitHub Pages publishes an org's project
  // repo under the org site's custom domain, so the blog inherits its HTTPS.
  site: "https://personaljarvis.ai",
  base: "/blog",
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: "github-dark-dimmed", wrap: false },
  },
  server: { port: 4410, host: "127.0.0.1" },
  vite: { plugins: [tailwindcss()], server: { strictPort: true } },
});
