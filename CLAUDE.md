# CLAUDE.md — personal-jarvis-blog

Rules for any coding agent working in this repo.

- This is the blog for personaljarvis.ai/blog. It is its OWN git repo. Never commit it into the
  Personal Jarvis app repo or the main website repo (`personaljarvis.github.io`), and never the
  other way round. The Jarvis app source is READ-ONLY reference for facts.
- Everything committed is English. Conversation with the maintainer is German.
- `.claude/` (authoring skills, topic backlog) and `drafts/` are private and gitignored. Never
  force-add them. Use the `blog-*` skills in `.claude/skills/` for any post work; start with
  `blog-post-writer`.
- Stage explicit paths only. Conventional Commits. Push only when the maintainer says so —
  a push publishes to the public internet.
- The blog has its own quiet reading design (light paper + automatic dark mode, serif body,
  sans small print). It never imitates another website. Colours only via roles in
  `src/styles/global.css`. Logo = the Gigi ghost (`public/gigi.svg`).
- Every post has a cover drawing `src/illustrations/<slug>.svg`: ink line art with Gigi ghosts
  on the category's flat tone (`CATEGORY_TONE`). It is both the index thumbnail and the link
  preview; the build fails without it. Never a screenshot or mockup as a cover.
- Charts use REAL data only (aggregates in `src/data/`, nothing personal). No fake UI mockups.
- Chart tooltips: put the text on a mark as `data-tip` and nothing else. The one script in
  `src/layouts/Base.astro` measures each tooltip and keeps it inside the visible chart
  (`.figure-scroll` clips the rest, and on a phone the plot is wider than the screen). Never
  position a tooltip per chart, and hover the left edge, right edge and top of every new chart
  in the Chrome check.
- Post titles follow `docs/titles.md`: a plain statement of what is now true or what we did,
  sentence case, at most 70 characters, never a question, tease, slogan or hype word.
  `scripts/check-titles.mjs` (part of `npm run verify`) blocks the mechanical cases.
- Done means `npm run verify` passes AND the page was looked at in Chrome (`blog-visual-qa`).
