/** Small helpers shared by the chart components. */

export const CLI_COLOR: Record<string, string> = {
  Codex: "var(--s1)",
  "Claude Code": "var(--s2)",
  "Grok Build": "var(--s3)",
  OpenCode: "var(--s4)",
  Antigravity: "var(--s5)",
};

/** Fixed categorical order — colour follows the entity, never its rank. */
export const CLI_ORDER = ["Codex", "Claude Code", "Grok Build", "OpenCode", "Antigravity"];

export const MONTH_NAME: Record<string, string> = {
  "2026-05": "May",
  "2026-06": "June",
  "2026-07": "July",
  "2026-08": "August",
  "2026-09": "September",
};

/** A bar whose data end (top) is rounded and whose baseline end is square. */
export function barUp(x: number, y: number, w: number, base: number, r = 4): string {
  const h = base - y;
  if (h <= 0) return "";
  const rr = Math.min(r, w / 2, h);
  return `M${x},${base}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${base}Z`;
}

/** 24h minute count -> "4:35 pm". */
export function clock(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

export function pct(v: number, digits = 0): string {
  const s = (v * 100).toFixed(digits);
  // Never round a partial share up to a full 100%.
  if (v < 1 && Number(s) >= 100) return `${(v * 100).toFixed(digits + 1)}%`;
  return `${s}%`;
}

/** Escape text placed inside a data-tip attribute's HTML. */
export function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}
