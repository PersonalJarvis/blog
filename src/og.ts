/**
 * Build-time social cards (1200 x 630 PNG): the mascot, a category label in
 * mono, the title large in Inter. Rendered with satori (HTML-ish tree -> SVG)
 * and resvg (SVG -> PNG), so no browser is needed and CI can build them.
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
const gigi = `data:image/svg+xml;base64,${readFileSync(join(root, "public", "gigi.svg")).toString("base64")}`;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOg(opts: { title: string; label: string }): Promise<Uint8Array> {
  const size = opts.title.length > 80 ? 60 : opts.title.length > 50 ? 70 : 82;
  const tree = h(
    "div",
    {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "70px 80px",
      background: "#fbfaf7",
      color: "#171613",
      fontFamily: "Inter",
    },
    [
      h("div", { display: "flex", alignItems: "center", gap: 16 }, [
        h("img", { width: 48, height: 52 }, undefined, { src: gigi, width: 48, height: 52 }),
        h("div", { fontSize: 26, fontWeight: 500 }, "Personal Jarvis"),
        h("div", { fontSize: 26, color: "#6f6c64" }, "Blog"),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 22 }, [
        h("div", { fontSize: 24, color: "#9a6412", fontWeight: 500, textTransform: "capitalize" }, opts.label),
        h("div", { fontFamily: "Newsreader", fontSize: size, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1040 }, opts.title),
      ]),
      h("div", { display: "flex", height: 2, background: "#171613", width: 1040 }),
    ],
  );
  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter500, weight: 500, style: "normal" },
      { name: "Newsreader", data: serif, weight: 500, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
