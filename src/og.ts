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

const inter400 = font("@fontsource/inter", "inter-latin-400-normal.woff");
const inter500 = font("@fontsource/inter", "inter-latin-500-normal.woff");
const mono = font("@fontsource/jetbrains-mono", "jetbrains-mono-latin-500-normal.woff");
const gigi = `data:image/svg+xml;base64,${readFileSync(join(root, "public", "gigi.svg")).toString("base64")}`;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
});

export async function renderOg(opts: { title: string; label: string; foot?: string }): Promise<Uint8Array> {
  const size = opts.title.length > 70 ? 58 : opts.title.length > 44 ? 68 : 80;
  const tree = h(
    "div",
    {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      background: "#060605",
      backgroundImage: "radial-gradient(circle at 88% 12%, rgba(255,207,92,0.16), rgba(6,6,5,0) 42%)",
      color: "#f7f7f4",
      fontFamily: "Inter",
    },
    [
      h("div", { display: "flex", alignItems: "center", gap: 18 }, [
        h("img", { width: 58, height: 63 }, undefined, { src: gigi, width: 58, height: 63 }),
        h("div", { fontSize: 26, fontWeight: 500, letterSpacing: -0.4 }, "Personal Jarvis"),
        h("div", { fontSize: 26, color: "#6d6a62" }, "/ Blog"),
      ]),
      h("div", { display: "flex", flexDirection: "column", gap: 26 }, [
        h(
          "div",
          {
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            fontFamily: "Mono",
            fontSize: 20,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#ffcf5c",
            border: "1.5px solid #46433b",
            borderRadius: 999,
            padding: "6px 18px",
          },
          [
            h("div", { width: 12, height: 12, borderRadius: 999, background: "#ffcf5c", marginRight: 14 }),
            h("div", {}, opts.label),
          ],
        ),
        h("div", { fontSize: size, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }, opts.title),
      ]),
      h(
        "div",
        { display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 18, color: "#6d6a62", letterSpacing: 1 },
        [h("div", {}, "BLOG.PERSONALJARVIS.AI"), h("div", {}, opts.foot ?? "OPEN SOURCE · ANY MODEL · YOUR DESKTOP")],
      ),
    ],
  );
  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter500, weight: 500, style: "normal" },
      { name: "Mono", data: mono, weight: 500, style: "normal" },
    ],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
