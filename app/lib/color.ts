import { Color } from '../../types/cube';

export type RGB = { r: number; g: number; b: number };
export type HSV = { h: number; s: number; v: number };

export const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else {
      h = (r - g) / d + 4;
    }
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
};

// robust median of small patch
export const median = (arr: number[]) => {
  const a = [...arr].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};

export const medianHSV = (pixels: RGB[]): HSV => {
  const hs: number[] = [];
  const ss: number[] = [];
  const vs: number[] = [];
  for (const p of pixels) {
    const hsv = rgbToHsv(p);
    hs.push(hsv.h);
    ss.push(hsv.s);
    vs.push(hsv.v);
  }
  return { h: median(hs), s: median(ss), v: median(vs) };
};

// distance in HSV (circular hue)
export const hsvDist = (a: HSV, b: HSV) => {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180; // 0..1
  const ds = Math.abs(a.s - b.s);
  const dv = Math.abs(a.v - b.v);
  return 2 * dh + 1 * ds + 0.5 * dv; // tuned weights
};

export const classifyByCenters = (
  hsv: HSV,
  centers: { h: number; s: number; v: number; color: Color }[]
): Color => {
  let best: { c: Color; d: number } | null = null;
  for (const c of centers) {
    const d = hsvDist(hsv, c);
    if (!best || d < best.d) best = { c: c.color, d };
  }
  return best!.c;
};

