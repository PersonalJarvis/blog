/**
 * Build-time social cards (1200 x 630 PNG): what X, LinkedIn, Slack and
 * messengers show when a post link is shared. Rendered with satori (HTML-ish
 * tree -> SVG) and resvg (SVG -> PNG), so no browser is needed and CI can
 * build them.
 *
 * The card wears the blog's DARK roles (global.css, prefers-color-scheme:
 * dark). A dark card reads as one deliberate object in every feed, light or
 * dark; the paper colour read as an empty page on X's dark theme.
 *
 * Left: brand, category, title, date. Right: the post's cover screenshot when
 * its frontmatter names one, otherwise the Gigi portrait.
 *
 * X lays the post title over the image's bottom-left corner, so nothing lives
 * in that strip (SAFE_BOTTOM) — a rule or a line of text there collides with it.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
// Not a direct dependency: astro's default image service already requires
// sharp to build the posts' WebP screenshots, so it is present in every build.
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";

// Resolved from the project root: the build bundles this module into a
// temporary folder, so paths relative to import.meta.url would point there.
const root = process.cwd();
const font = (pkg: string, file: string) => readFileSync(join(root, "node_modules", pkg, "files", file));

const serif = font("@fontsource/newsreader", "newsreader-latin-500-normal.woff");
const inter400 = font("@fontsource/inter", "inter-latin-400-normal.woff");
const inter500 = font("@fontsource/inter", "inter-latin-500-normal.woff");
const mono500 = font("@fontsource/jetbrains-mono", "jetbrains-mono-latin-500-normal.woff");
const gigi = `data:image/svg+xml;base64,${readFileSync(join(root, "public", "gigi.svg")).toString("base64")}`;

// The dark roles of src/styles/global.css — satori cannot read CSS variables.
const C = {
  paper: "#131311",
  ink: "#f2f0e9",
  ink3: "#9c988d",
  ruleStrong: "#3c3a34",
  accent: "#e3ad4f",
};
/** --accent (dark) as an rgb triple, for the glow and the cover's halo. */
const ACCENT_RGB = "227, 173, 79";

const W = 1200;
const H = 630;
const PAD = 72;
/** Height of the bottom strip X covers with its title overlay. */
const SAFE_BOTTOM = 112;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
});
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}) =>
  h("img", { width, height, ...style }, undefined, { src, width, height });

export interface OgCard {
  title: string;
  /** Category or series, shown above the title. */
  label: string;
  /** Small print under the title, e.g. "Sep 30, 2026 · 9 min read". */
  meta: string;
  /** Project-relative path of a real screenshot shown on the right. */
  cover?: string;
}

/** Loads a cover as a PNG data URI; satori cannot decode the WebP the posts ship. */
async function loadCover(path: string): Promise<{ src: string; width: number; height: number }> {
  const file = join(root, path);
  if (!existsSync(file)) throw new Error(`Social card cover not found: ${path}`);
  const { data, info } = await sharp(file).png().toBuffer({ resolveWithObject: true });
  return { src: `data:image/png;base64,${data.toString("base64")}`, width: info.width, height: info.height };
}

/** The largest title size whose estimated wrap stays within three lines. */
function titleSize(title: string, width: number): number {
  for (let size = 68; size > 40; size -= 2) {
    // Newsreader 500 averages about 0.44em per character; 2.6 rather than 3
    // leaves room for words that break earlier than the estimate says.
    if ((title.length * size * 0.44) / width <= 2.6) return size;
  }
  return 40;
}

export async function renderOg(card: OgCard): Promise<Uint8Array> {
  const cover = card.cover ? await loadCover(card.cover) : undefined;
  const column = cover ? 500 : 620;
  const size = titleSize(card.title, column);

  // The screenshot runs off the right edge on purpose: it reads as a view into
  // the app rather than a thumbnail pasted onto a slide.
  const coverWidth = 700;
  const coverHeight = cover ? Math.round((coverWidth * cover.height) / cover.width) : 0;
  const visual = cover
    ? h(
        "div",
        {
          position: "absolute",
          left: 628,
          top: Math.round((H - coverHeight) / 2),
          display: "flex",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid rgba(242, 240, 233, 0.14)",
          boxShadow: `0 32px 90px rgba(0, 0, 0, 0.6), 0 0 120px rgba(${ACCENT_RGB}, 0.10)`,
        },
        [img(cover.src, coverWidth, coverHeight)],
      )
    : img(gigi, 300, 325, { position: "absolute", left: 810, top: 146 });

  // Gigi appears once: small beside the name next to a cover, large without one.
  const brand = h("div", { display: "flex", alignItems: "center", gap: 14 }, [
    ...(cover ? [img(gigi, 36, 39)] : []),
    h("div", { fontSize: 24, fontWeight: 500, color: C.ink }, "Personal Jarvis"),
    h("div", { width: 1, height: 22, background: C.ruleStrong }),
    h("div", { fontSize: 24, color: C.ink3 }, "Blog"),
  ]);

  const text = h("div", { display: "flex", flexDirection: "column" }, [
    h(
      "div",
      { fontFamily: "JetBrains Mono", fontSize: 18, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: C.accent },
      card.label,
    ),
    h(
      "div",
      {
        display: "block",
        marginTop: 20,
        fontFamily: "Newsreader",
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: -0.02 * size,
        color: C.ink,
        lineClamp: 3,
      },
      card.title,
    ),
    h("div", { marginTop: 26, fontSize: 22, color: C.ink3 }, card.meta),
  ]);

  const tree = h(
    "div",
    {
      width: W,
      height: H,
      display: "flex",
      position: "relative",
      backgroundColor: C.paper,
      // Eased stops: a single linear fall-off draws a visible ring where it ends.
      backgroundImage: `radial-gradient(circle at ${cover ? "84% 50%" : "80% 50%"}, rgba(${ACCENT_RGB}, 0.15) 0%, rgba(${ACCENT_RGB}, 0.085) 22%, rgba(${ACCENT_RGB}, 0.04) 38%, rgba(${ACCENT_RGB}, 0.015) 52%, rgba(${ACCENT_RGB}, 0) 68%)`,
      fontFamily: "Inter",
      color: C.ink,
    },
    [
      visual,
      h(
        "div",
        {
          position: "absolute",
          left: PAD,
          top: PAD - 8,
          width: column,
          height: H - (PAD - 8) - SAFE_BOTTOM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        [brand, text],
      ),
    ],
  );

  const svg = await satori(tree as never, {
    width: W,
    height: H,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter500, weight: 500, style: "normal" },
      { name: "Newsreader", data: serif, weight: 500, style: "normal" },
      { name: "JetBrains Mono", data: mono500, weight: 500, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
}
