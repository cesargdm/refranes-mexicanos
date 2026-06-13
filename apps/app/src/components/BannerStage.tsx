import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, Share, Text, useWindowDimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SymbolView } from 'expo-symbols'
import * as Haptics from 'expo-haptics'
import { StyleSheet } from 'react-native-unistyles'

import type { RefranDeck } from '@/hooks/useRefranDeck'
import { toggleFavorite, useIsFavorite } from '@/state/favorites'
import { flagPalette } from '@/theme/unistyles'
import { CascadeText } from './CascadeText'
import { Garland, GARLAND_HEIGHT } from './Garland'
import { MeaningScroll } from './MeaningScroll'
import { FLAG_PAD, PapelPicadoFlag } from './PapelPicadoFlag'
import { TearShreds } from './TearShreds'

const SWAY = 0.035 // radians (~2°)
const SWIPE_THRESHOLD = 90
const STRING_LEN = 22

type Props = {
  deck: RefranDeck
}

export function BannerStage({ deck }: Props) {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const isFavorite = useIsFavorite(deck.current.id)

  const flagW = Math.min(300, width * 0.74)
  const flagH = flagW * 0.82
  const flagColor = flagPalette[deck.step % flagPalette.length]!
  const flagCenterY =
    insets.top + GARLAND_HEIGHT + 18 + STRING_LEN + flagH / 2 + FLAG_PAD

  const sway = useSharedValue(0)
  const dragX = useSharedValue(0)
  const exitOpacity = useSharedValue(1)
  const exitY = useSharedValue(0)
  const exitRot = useSharedValue(0)
  const tear = useSharedValue(0)

  // Idle sway — paused while the meaning is open or reduced motion is on.
  useEffect(() => {
    if (reduced || open) {
      cancelAnimation(sway)
      sway.value = withTiming(0, { duration: 280 })
      return
    }
    sway.value = withRepeat(
      withSequence(
        withTiming(SWAY, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(-SWAY, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    )
    return () => cancelAnimation(sway)
  }, [open, reduced, sway])

  // Entrance swing whenever the deck advances.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    exitOpacity.value = 0
    exitOpacity.value = withTiming(1, { duration: 240 })
    if (reduced) return
    dragX.value = deck.direction * 44
    dragX.value = withSpring(0, { damping: 9, stiffness: 130 })
    exitRot.value = -deck.direction * 0.18
    exitRot.value = withSpring(0, { damping: 8, stiffness: 90 })
  }, [deck.step]) // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(
    (dir: 1 | -1) => {
      exitOpacity.value = 1
      exitY.value = 0
      exitRot.value = 0
      dragX.value = 0
      tear.value = 0
      if (dir === 1) deck.next()
      else deck.prev()
    },
    [deck], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const triggerSwipe = useCallback(
    (dir: 1 | -1) => {
      if (open) setOpen(false)
      if (reduced) {
        exitOpacity.value = withTiming(0, { duration: 150 }, (f) => {
          if (f) runOnJS(advance)(dir)
        })
        return
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      tear.value = withTiming(1, { duration: 460 })
      exitOpacity.value = withTiming(0, { duration: 320 })
      exitY.value = withTiming(80, { duration: 380 })
      exitRot.value = withTiming(dir * 0.25, { duration: 380 }, (f) => {
        if (f) runOnJS(advance)(dir)
      })
    },
    [open, reduced, advance], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      dragX.value = e.translationX * 0.4
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD || e.velocityX < -850) {
        runOnJS(triggerSwipe)(1)
      } else if (e.translationX > SWIPE_THRESHOLD || e.velocityX > 850) {
        runOnJS(triggerSwipe)(-1)
      } else {
        dragX.value = withSpring(0)
      }
    })

  const flagStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [
      { translateX: dragX.value },
      { translateY: exitY.value },
      { rotateZ: `${sway.value + exitRot.value}rad` },
    ],
  }))

  const onShare = useCallback(() => {
    Share.share({
      message: `«${deck.current.refran}» — ${deck.current.significado}`,
    })
  }, [deck])

  const onToggleFavorite = useCallback(() => {
    Haptics.selectionAsync()
    toggleFavorite(deck.current.id)
  }, [deck])

  const accent = flagPalette[0]

  return (
    <View style={styles.root}>
      <TearShreds
        progress={tear}
        centerX={width / 2}
        centerY={flagCenterY}
        flagW={flagW}
        flagH={flagH}
      />

      <View style={[styles.garland, { marginTop: insets.top }]}>
        <Garland width={width} />
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.stage}>
          <View style={[styles.string, { height: STRING_LEN }]} />
          <Animated.View style={[styles.flagWrap, flagStyle]}>
            <PapelPicadoFlag width={flagW} height={flagH} color={flagColor} />
            <View
              style={[
                styles.textOverlay,
                { width: flagW, height: flagH, top: FLAG_PAD, left: FLAG_PAD },
              ]}
              pointerEvents="none"
            >
              <CascadeText
                text={deck.current.refran}
                triggerKey={deck.step}
                reducedMotion={reduced}
                style={styles.refranText}
              />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>

      <View
        style={[styles.controls, { paddingBottom: insets.bottom + 100 }]}
      >
        {open ? (
          <MeaningScroll
            meaning={deck.current.significado}
            tipo={deck.current.tipo}
            reducedMotion={reduced}
          />
        ) : null}

        <View style={styles.actions}>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={12}
            style={styles.iconButton}
          >
            <SymbolView
              name={isFavorite ? 'star.fill' : 'star'}
              tintColor={accent}
              size={26}
            />
          </Pressable>

          <Pressable
            onPress={() => setOpen((v) => !v)}
            style={styles.meaningButton}
          >
            <Text style={styles.meaningButtonText}>
              {open ? 'Ocultar' : 'Significado'}
            </Text>
          </Pressable>

          <Pressable onPress={onShare} hitSlop={12} style={styles.iconButton}>
            <SymbolView
              name="square.and.arrow.up"
              tintColor={accent}
              size={26}
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  garland: {
    alignItems: 'center',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 18,
  },
  string: {
    width: 2,
    backgroundColor: 'rgba(36,27,47,0.4)',
  },
  flagWrap: {
    alignItems: 'center',
    transformOrigin: 'top',
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  refranText: {
    color: theme.colors.flagInk,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    textShadowColor: 'rgba(36,27,47,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controls: {
    paddingHorizontal: theme.space(5),
    gap: theme.space(4),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.space(4),
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningButton: {
    flex: 1,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.chip,
    paddingVertical: theme.space(3.5),
    alignItems: 'center',
  },
  meaningButtonText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
}))
