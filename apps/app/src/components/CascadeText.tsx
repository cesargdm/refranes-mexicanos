import { useMemo } from 'react'
import { type StyleProp, type TextStyle, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  text: string
  /** Bump to retrigger the cascade (via remount). */
  triggerKey: number
  reducedMotion: boolean
  style?: StyleProp<TextStyle>
}

const STAGGER = 45

/**
 * Renders a saying word-by-word, each word springing up into place with a
 * staggered delay so the line assembles with a sense of arrival. When reduced
 * motion is on, the whole line simply fades in.
 */
export function CascadeText({ text, triggerKey, reducedMotion, style }: Props) {
  const words = useMemo(() => text.split(' '), [text])

  if (reducedMotion) {
    return (
      <Animated.Text
        key={triggerKey}
        entering={FadeInDown.duration(220)}
        style={[styles.word, style]}
      >
        {text}
      </Animated.Text>
    )
  }

  return (
    <View key={triggerKey} style={styles.row}>
      {words.map((word, i) => (
        <Animated.Text
          key={`${triggerKey}-${i}`}
          entering={FadeInDown.delay(i * STAGGER)
            .duration(420)
            .springify()
            .damping(14)}
          style={[styles.word, style]}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </Animated.Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  word: {
    textAlign: 'center',
  },
}))
