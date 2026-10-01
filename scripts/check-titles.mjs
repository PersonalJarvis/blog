// Blocks post titles that break docs/titles.md in ways a machine can see.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const POSTS = join(import.meta.dirname, "..", "src", "content", "posts");
const MAX_CHARS = 70;
const BANNED = [
  "actually", "really", "finally", "ultimate", "unlock", "supercharge", "seamless",
  "game-changer", "game changer", "revolution", "secret", "everything you need",
  "here's why", "without burning", "world to live in",
];

const problems = [];
for (const file of readdirSync(POSTS).filter((f) => /\.mdx?$/.test(f))) {
  const text = readFileSync(join(POSTS, file), "utf8");
  const match = text.match(/^title:\s*["']?(.*?)["']?\s*$/m);
  if (!match) continue;
  const title = match[1];
  const lower = title.toLowerCase();
  const fail = (why) => problems.push(`${file}: "${title}" - ${why}`);
  if (title.length > MAX_CHARS) fail(`${title.length} characters, max ${MAX_CHARS}`);
  if (/[?!]/.test(title)) fail("no questions or exclamation marks");
  if (/\p{Extended_Pictographic}/u.test(title)) fail("no emoji");
  for (const word of BANNED) {
    if (new RegExp(`\\b${word}\\b`).test(lower)) fail(`banned phrase "${word}"`);
  }
}

if (problems.length) {
  console.error("Post titles break docs/titles.md:\n" + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}
console.log("Post titles OK");
