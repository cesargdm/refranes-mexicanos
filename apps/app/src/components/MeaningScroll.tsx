import { Text, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

import type { RefranTipo } from '@refranes/data'

type Props = {
  meaning: string
  tipo: RefranTipo
  reducedMotion: boolean
}

/**
 * The unrolled paper scroll holding a saying's meaning, revealed below the
 * banner. Slides/springs down on open and lifts away on close.
 */
export function MeaningScroll({ meaning, tipo, reducedMotion }: Props) {
  return (
    <Animated.View
      entering={
        reducedMotion
          ? FadeIn.duration(180)
          : FadeInDown.duration(380).springify().damping(16)
      }
      exiting={reducedMotion ? FadeOut.duration(120) : FadeOutUp.duration(200)}
      style={styles.card}
    >
      <View style={styles.chip}>
        <Text style={styles.chipText}>{tipo}</Text>
      </View>
      <Text style={styles.meaning}>{meaning}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sheet,
    paddingVertical: theme.space(6),
    paddingHorizontal: theme.space(6),
    gap: theme.space(3),
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.paperDeep,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.space(3),
    paddingVertical: theme.space(1.5),
  },
  chipText: {
    color: theme.colors.accent,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.4,
    textTransform: 'capitalize',
  },
  meaning: {
    color: theme.colors.text,
    fontSize: theme.font.body,
    lineHeight: theme.font.body * 1.45,
  },
}))
