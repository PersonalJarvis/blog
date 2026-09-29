# Personal Jarvis Blog

Source of [personaljarvis.ai/blog](https://personaljarvis.ai/blog/): new features, field notes
and tips for [Personal Jarvis](https://personaljarvis.ai), the open-source desktop AI assistant.

Astro 7 + MDX, static, deployed to GitHub Pages. Charts are Astro components that render
inline SVG at build time from aggregated data in `src/data/` — no chart library.

```sh
npm install
npm run dev      # http://127.0.0.1:4410
npm run verify   # type-check + production build
```

Posts live in `src/content/posts/*.mdx`; charts in `src/components/charts/`.
Social cards are rendered at build time to `/og/<slug>.png`.
