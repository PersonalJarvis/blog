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
  // The whole stylesheet is ~5 KB compressed. Inline, it costs no round trip
  // before the first paint; fetched, it blocked rendering for ~150 ms on a
  // phone (Lighthouse, render-blocking requests).
  build: { inlineStylesheets: "always" },
  markdown: {
    // Two code themes, switched with the page (see global.css, "Code").
    shikiConfig: { themes: { light: "github-light", dark: "github-dark-dimmed" }, wrap: false },
  },
  server: { port: 4410, host: "127.0.0.1" },
  vite: { plugins: [tailwindcss()], server: { strictPort: true } },
});
