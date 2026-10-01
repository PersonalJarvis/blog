# How post titles are written

Derived from all 493 titles on claude.com/blog (sitemap, 2026-10-01). Median title:
9 words, 60 characters. Not one of them ends in a question mark; hype words appear
twice in 493. The titles work because they state a fact, not because they tease one.

## The principle

A title is a plain statement of what is now true, or of what we did. The reader
should know what the post says before clicking. The interesting part lives in the
facts, never in the wording.

## The four shapes (pick one)

1. **Subject + verb + what changed** (launches, features)
   - Claude: "Claude Code now supports artifacts", "Claude gets its own browser in Cowork"
   - Ours: "Coding agents now keep running when you close Personal Jarvis"
2. **How + who + did what** (engineering and usage stories)
   - Claude: "How Anthropic runs large-scale code migrations with Claude Code"
   - Ours: "How we build Personal Jarvis with up to 16 coding agents at once"
3. **Name: the concrete contents** (only for a bundle of several changes)
   - Claude: "New in Claude Managed Agents: self-hosted sandboxes and MCP tunnels"
4. **Fact. Our answer.** (rare: two plain sentences)
   - Claude: "Coding sessions are longer and use more context. Claude Opus 5.5 is built with that in mind."

## Rules

- The product or "we" is the subject. Active verb, present tense. "now" marks a change.
- Sentence case. Only names are capitalised.
- At most 70 characters. One idea per title.
- A number only when it is the real headline and comes from the post's data.
- Never: a question, an exclamation mark, emoji, "actually", "really", "finally",
  "ultimate", "unlock", "supercharge", "seamless", "game-changer", "revolution",
  "secret", "everything you need", "here's why", "without burning", "a world to live in".
- Never: slogan chiasmus ("Close the app, keep the agents"), cute metaphor after a
  colon, "you" as the hook ("...do you actually run?"), a promise in place of a fact.
- The description carries the numbers and the snag; the title stays short and literal.
- Slugs never change after publishing; a renamed title keeps its old URL.

## Test before committing

Read the title alone, without the post. If it could sit above a press release from
any company, it is too vague. If it makes the reader guess, it is a tease. Rewrite
until a stranger can say in one sentence what the post reports.

`npm run verify` runs `scripts/check-titles.mjs`, which blocks the mechanical cases
(question, exclamation, banned words, length). The judgement calls above are yours.
