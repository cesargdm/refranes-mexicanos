import { Skia, type SkPath } from '@shopify/react-native-skia'

// Fraction of the flag height taken up by the zigzag fringe at the bottom.
const FRINGE = 0.13

/**
 * The outer silhouette of a papel picado flag: straight top and sides, with a
 * zigzag (picado) fringe along the bottom edge.
 */
export function buildFlagSilhouette(w: number, h: number): SkPath {
  const p = Skia.Path.Make()
  const notch = h * FRINGE
  const teeth = 6
  const tw = w / teeth

  p.moveTo(0, 0)
  p.lineTo(w, 0)
  p.lineTo(w, h - notch)
  for (let i = 0; i < teeth; i++) {
    const point = w - (i + 0.5) * tw
    const valley = w - (i + 1) * tw
    p.lineTo(point, h)
    p.lineTo(valley, h - notch)
  }
  p.close()
  return p
}

/**
 * The decorative holes punched out of the flag — a central diamond flanked by
 * circles, a row of dots near the top, and scallops along the fringe. Drawn
 * with blendMode="clear" inside a layer Group so the background shows through.
 */
export function buildCutouts(w: number, h: number): SkPath {
  const p = Skia.Path.Make()
  const cx = w / 2
  const cy = h * 0.46
  const d = Math.min(w, h) * 0.17

  // Central diamond
  p.moveTo(cx, cy - d)
  p.lineTo(cx + d, cy)
  p.lineTo(cx, cy + d)
  p.lineTo(cx - d, cy)
  p.close()

  // Flanking circles
  const r = d * 0.4
  p.addCircle(cx - d * 2.05, cy, r)
  p.addCircle(cx + d * 2.05, cy, r)

  // Dot row near the top
  const dots = 5
  for (let i = 0; i < dots; i++) {
    const x = (w / (dots + 1)) * (i + 1)
    p.addCircle(x, h * 0.18, r * 0.5)
  }

  // Scallop holes sitting just above each fringe valley
  const teeth = 6
  const tw = w / teeth
  for (let i = 0; i < teeth; i++) {
    const x = (i + 0.5) * tw
    p.addCircle(x, h * (1 - FRINGE) - r * 0.6, r * 0.42)
  }

  return p
}

export type ShredSpec = {
  startX: number
  startY: number
  angle: number
  distance: number
  spin: number
  size: number
  color: string
  diamond: boolean
}

/**
 * Deterministic burst of paper shreds for the tear animation. Seeded by index
 * so it is stable across renders without Math.random in the render path.
 */
export function buildShreds(count: number, colors: readonly string[]): ShredSpec[] {
  const shreds: ShredSpec[] = []
  for (let i = 0; i < count; i++) {
    // Cheap deterministic pseudo-randomness from the index.
    const a = Math.sin(i * 12.9898) * 43758.5453
    const b = Math.sin(i * 78.233) * 24634.6345
    const ra = a - Math.floor(a)
    const rb = b - Math.floor(b)
    shreds.push({
      startX: 0.5 + (ra - 0.5) * 0.5,
      startY: 0.4 + (rb - 0.5) * 0.4,
      angle: -Math.PI / 2 + (ra - 0.5) * 2.4,
      distance: 160 + rb * 220,
      spin: (ra - 0.5) * 8,
      size: 9 + rb * 12,
      color: colors[i % colors.length]!,
      diamond: i % 2 === 0,
    })
  }
  return shreds
}
