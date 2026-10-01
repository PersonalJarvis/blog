/**
 * Plays the real Personal Jarvis pet sprite sheets in the browser.
 *
 * The frame maths is a port of the desktop renderer (`ui/orb/pet_renderer.py`
 * in the Personal Jarvis repo): `frameIndex` with its accent frames (the idle
 * blink every third breath), `pingPong` for a talking mouth with no voice
 * level, one-shots that rest on their last frame, and idle acts that play once.
 * Sheets are drawn nearest-neighbour at an integer scale of device pixels, so
 * every sprite pixel stays a crisp square.
 */

export interface Anim {
  row: number;
  frames: number;
  fps: number;
  loop?: boolean;
  accent_frames?: number;
  accent_every?: number;
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  frame_size: number;
  animations: Record<string, Anim>;
  acts: Record<string, Anim>;
}

/** How long a one-shot state holds before the pet returns (`ONE_SHOT_SECONDS`). */
export const ONE_SHOT_S: Record<string, number> = { success: 1.5, error: 2.0 };

export function frameIndex(elapsed: number, a: Anim, loop: boolean): number {
  const count = Math.max(1, a.frames);
  if (count === 1 || a.fps <= 0) return 0;
  const step = Math.floor(Math.max(0, elapsed) * a.fps);
  if (!loop) return Math.min(step, count - 1);
  const accent = Math.max(0, Math.min(count - 1, a.accent_frames ?? 0));
  if (accent === 0) return step % count;
  const base = count - accent;
  const every = Math.max(1, a.accent_every ?? 1);
  const pos = step % (base * every + accent);
  return pos < base * every ? pos % base : base + (pos - base * every);
}

export function pingPong(elapsed: number, a: Anim): number {
  const count = Math.max(1, a.frames);
  if (count === 1 || a.fps <= 0) return 0;
  const period = 2 * (count - 1);
  const step = Math.floor(Math.max(0, elapsed) * a.fps) % period;
  return step < count ? step : period - step;
}

const images = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = images.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    images.set(src, p);
  }
  return p;
}

export interface Sheets {
  sheet: HTMLImageElement;
  acts: HTMLImageElement;
}

export function loadPet(base: string, pet: Pet): Promise<Sheets> {
  return Promise.all([loadImage(`${base}${pet.id}/sheet.png`), loadImage(`${base}${pet.id}/acts.png`)]).then(
    ([sheet, acts]) => ({ sheet, acts }),
  );
}

/** One pet on screen: a looping state, an optional one-shot, an optional idle act. */
export class Actor {
  state = "idle";
  private stateAt = 0;
  private shot: { name: string; at: number } | null = null;
  private act: { name: string; at: number } | null = null;
  lastAct = "";
  pet: Pet;

  constructor(pet: Pet) {
    this.pet = pet;
  }

  setState(state: string, now: number) {
    this.act = null;
    if (state in ONE_SHOT_S) {
      this.shot = { name: state, at: now };
      return;
    }
    this.shot = null;
    this.state = state;
    this.stateAt = now;
  }

  playAct(name: string, now: number) {
    this.shot = null;
    this.act = { name, at: now };
    this.lastAct = name;
  }

  /** A random act, never the one played last (the desktop renderer's rule). */
  randomAct(): string {
    const names = Object.keys(this.pet.acts);
    const pool = names.filter((n) => n !== this.lastAct);
    const from = pool.length ? pool : names;
    return from[Math.floor(Math.random() * from.length)];
  }

  get busy(): boolean {
    return this.shot !== null || this.act !== null;
  }

  /** What is on screen now: which sheet, which cell. */
  frame(now: number): { acts: boolean; row: number; col: number; label: string } {
    if (this.shot) {
      const a = this.pet.animations[this.shot.name];
      const t = now - this.shot.at;
      if (t < ONE_SHOT_S[this.shot.name]) return { acts: false, row: a.row, col: frameIndex(t, a, false), label: this.shot.name };
      this.shot = null;
    }
    if (this.act) {
      const a = this.pet.acts[this.act.name];
      const t = now - this.act.at;
      if (t < a.frames / a.fps) return { acts: true, row: a.row, col: frameIndex(t, a, false), label: this.act.name };
      this.act = null;
    }
    const a = this.pet.animations[this.state] ?? this.pet.animations.idle;
    const t = now - this.stateAt;
    const col = this.state === "talking" ? pingPong(t, a) : frameIndex(t, a, a.loop !== false);
    return { acts: false, row: a.row, col, label: this.state };
  }
}

/** Draw one cell of a sheet with its top-left corner at (x, y), `scale` device px per sprite px. */
export function drawCell(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  size: number,
  row: number,
  col: number,
  x: number,
  y: number,
  scale: number,
) {
  ctx.drawImage(img, col * size, row * size, size, size, Math.round(x), Math.round(y), size * scale, size * scale);
}

export function devicePixels(): number {
  return Math.max(1, Math.round((window.devicePixelRatio || 1) * 4) / 4);
}

/** Size a canvas to its CSS width and `cssHeight` in device pixels (image smoothing off). */
export function fitCanvas(canvas: HTMLCanvasElement, cssHeight: number): number {
  const dpr = devicePixels();
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(cssHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  canvas.style.height = `${cssHeight}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  return dpr;
}

/** Run `tick` every animation frame, but only while `el` is on screen and the tab is visible. */
export function whileVisible(el: Element, tick: (now: number) => void) {
  let raf = 0;
  let seen = false;
  const loop = () => {
    tick(performance.now() / 1000);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const run = seen && document.visibilityState === "visible";
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  new IntersectionObserver((entries) => {
    seen = entries.some((e) => e.isIntersecting);
    sync();
  }).observe(el);
  document.addEventListener("visibilitychange", sync);
}

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "fire_burst" -> "Fire burst". */
export function humanize(slug: string): string {
  const s = slug.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
