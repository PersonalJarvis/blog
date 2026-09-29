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
- Dark-only design; colours only via tokens in `src/styles/tokens.css`. Logo = the Gigi ghost
  (`public/gigi.svg`), never the gold four-point star.
- Done means `npm run verify` passes AND the page was looked at in Chrome (`blog-visual-qa`).
