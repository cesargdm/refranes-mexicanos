import { useMemo } from 'react'
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia'
import { StyleSheet } from 'react-native'
import { useDerivedValue, type SharedValue } from 'react-native-reanimated'

import { flagPalette } from '@/theme/unistyles'
import { buildShreds, type ShredSpec } from './papelPicado'

const SHRED_COUNT = 16

type ShredProps = {
  spec: ShredSpec
  progress: SharedValue<number>
  centerX: number
  centerY: number
  flagW: number
  flagH: number
}

function Shred({ spec, progress, centerX, centerY, flagW, flagH }: ShredProps) {
  const path = useMemo(() => {
    const p = Skia.Path.Make()
    const s = spec.size
    if (spec.diamond) {
      p.moveTo(0, -s / 2)
      p.lineTo(s / 2, 0)
      p.lineTo(0, s / 2)
      p.lineTo(-s / 2, 0)
      p.close()
    } else {
      p.addRect(Skia.XYWHRect(-s / 2, -s / 2, s, s))
    }
    return p
  }, [spec])

  const baseX = centerX + (spec.startX - 0.5) * flagW
  const baseY = centerY + (spec.startY - 0.5) * flagH

  const transform = useDerivedValue(() => {
    const t = progress.value
    const ease = 1 - (1 - t) * (1 - t)
    const dx = Math.cos(spec.angle) * spec.distance * ease
    const dy = Math.sin(spec.angle) * spec.distance * ease + t * t * 280
    return [
      { translateX: baseX + dx },
      { translateY: baseY + dy },
      { rotate: spec.spin * t },
    ]
  })

  const opacity = useDerivedValue(() => {
    const t = progress.value
    if (t <= 0.001) return 0
    return Math.max(0, 1 - t * t)
  })

  return (
    <Group transform={transform} opacity={opacity}>
      <Path path={path} color={spec.color} />
    </Group>
  )
}

type Props = {
  progress: SharedValue<number>
  centerX: number
  centerY: number
  flagW: number
  flagH: number
}

/**
 * Full-screen Skia overlay that bursts paper shreds outward from the flag when
 * `progress` animates 0 → 1, then hides again at rest.
 */
export function TearShreds({ progress, centerX, centerY, flagW, flagH }: Props) {
  const shreds = useMemo(() => buildShreds(SHRED_COUNT, flagPalette), [])
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {shreds.map((spec, i) => (
        <Shred
          key={i}
          spec={spec}
          progress={progress}
          centerX={centerX}
          centerY={centerY}
          flagW={flagW}
          flagH={flagH}
        />
      ))}
    </Canvas>
  )
}
