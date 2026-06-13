import { useMemo } from 'react'
import { Canvas, Group, Path, Skia, type SkPath } from '@shopify/react-native-skia'

import { flagPalette } from '@/theme/unistyles'

type Props = {
  width: number
}

const HEIGHT = 44
const FLAGS = 9

/**
 * A static papel picado garland — a gently dipping string with small
 * triangular flags — strung across the top of the screen for street ambiance.
 */
export function Garland({ width }: Props) {
  const { string, flags } = useMemo(() => {
    const dip = 16
    const string = Skia.PathBuilder.Make()
    string.moveTo(0, 6)
    string.quadTo(width / 2, 6 + dip, width, 6)

    const flags: { path: SkPath; color: string }[] = []
    const span = width / FLAGS
    const fw = span * 0.66
    const fh = 24
    for (let i = 0; i < FLAGS; i++) {
      const cx = span * (i + 0.5)
      // y on the quadratic string at cx
      const t = cx / width
      const top = 6 + dip * (1 - (2 * t - 1) * (2 * t - 1))
      const p = Skia.PathBuilder.Make()
      p.moveTo(cx - fw / 2, top)
      p.lineTo(cx + fw / 2, top)
      p.lineTo(cx, top + fh)
      p.close()
      flags.push({ path: p.build(), color: flagPalette[i % flagPalette.length]! })
    }
    return { string: string.build(), flags }
  }, [width])

  return (
    <Canvas style={{ width, height: HEIGHT }}>
      <Path
        path={string}
        style="stroke"
        strokeWidth={2}
        color="rgba(36,27,47,0.35)"
      />
      <Group>
        {flags.map((f, i) => (
          <Path key={i} path={f.path} color={f.color} opacity={0.92} />
        ))}
      </Group>
    </Canvas>
  )
}

export const GARLAND_HEIGHT = HEIGHT
