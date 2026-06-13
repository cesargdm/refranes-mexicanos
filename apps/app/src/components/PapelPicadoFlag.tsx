import { useMemo } from 'react'
import { Canvas, Group, Path, Shadow } from '@shopify/react-native-skia'

import { buildCutouts, buildFlagSilhouette } from './papelPicado'

type Props = {
  width: number
  height: number
  color: string
}

/**
 * A single papel picado flag drawn in Skia: a colored paper rectangle with a
 * zigzag fringe and decorative holes punched clean through (the background
 * shows through the cut-outs via blendMode="clear" inside a layer group).
 */
export function PapelPicadoFlag({ width, height, color }: Props) {
  const silhouette = useMemo(
    () => buildFlagSilhouette(width, height),
    [width, height],
  )
  const cutouts = useMemo(() => buildCutouts(width, height), [width, height])

  // Pad the canvas so the drop shadow isn't clipped.
  const pad = 14

  return (
    <Canvas style={{ width: width + pad * 2, height: height + pad * 2 }}>
      <Group transform={[{ translateX: pad }, { translateY: pad }]}>
        <Group layer>
          <Path path={silhouette} color={color}>
            <Shadow dx={0} dy={6} blur={12} color="rgba(36,27,47,0.18)" />
          </Path>
          <Group blendMode="clear">
            <Path path={cutouts} color="black" />
          </Group>
        </Group>
      </Group>
    </Canvas>
  )
}

export const FLAG_PAD = 14
