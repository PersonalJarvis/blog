/**
 * Build-time social cards (1200 x 630 PNG): what X, LinkedIn, Slack and
 * messengers show when a post link is shared. Rendered with satori (HTML-ish
 * tree -> SVG) and resvg (SVG -> PNG), so no browser is needed and CI can
 * build them.
 *
 * The card is the post's thumbnail at share size: the category's flat tone
 * (CATEGORY_TONE) with the post's line drawing (src/illustrations/) on the
 * right, and brand, category, title and date in ink on the left. A solid
 * colour reads as one deliberate object in every feed, light or dark.
 *
 * X lays the post title over the image's bottom-left corner, so nothing lives
 * in that strip (SAFE_BOTTOM) — a rule or a line of text there collides with it.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
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

// Ink on the tone, as in the drawings themselves.
const C = {
  ink: "#141413",
  ink3: "rgba(20, 20, 19, 0.66)",
  rule: "rgba(20, 20, 19, 0.3)",
};

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
  /** The flat background colour, from CATEGORY_TONE. */
  tone: string;
  /** The post's line drawing as SVG markup, from illustration(). */
  drawing: string;
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
  const column = 540;
  const size = titleSize(card.title, column);
  const drawing = `data:image/svg+xml;base64,${Buffer.from(card.drawing).toString("base64")}`;
  const visual = img(drawing, 600, 400, { position: "absolute", left: 588, top: 96 });

  const brand = h("div", { display: "flex", alignItems: "center", gap: 14 }, [
    img(gigi, 36, 39),
    h("div", { fontSize: 24, fontWeight: 500, color: C.ink }, "Personal Jarvis"),
    h("div", { width: 1.5, height: 22, background: C.rule }),
    h("div", { fontSize: 24, color: C.ink3 }, "Blog"),
  ]);

  const text = h("div", { display: "flex", flexDirection: "column" }, [
    h(
      "div",
      { fontFamily: "JetBrains Mono", fontSize: 18, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase", color: C.ink3 },
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
      backgroundColor: card.tone,
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
