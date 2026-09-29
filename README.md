# Personal Jarvis Blog

Source of [blog.personaljarvis.ai](https://blog.personaljarvis.ai): new features, field notes
and tips for [Personal Jarvis](https://personaljarvis.ai), the open-source desktop AI assistant.

Astro 7 + MDX, static, deployed to GitHub Pages. Every infographic is an Astro component
(inline SVG/HTML, theme tokens) — no chart library, no client framework.

```sh
npm install
npm run dev      # http://127.0.0.1:4410
npm run verify   # type-check + production build
```

Posts live in `src/content/posts/*.mdx`; figure components in `src/components/figures/`.
Social cards are rendered at build time to `/og/<slug>.png`.
