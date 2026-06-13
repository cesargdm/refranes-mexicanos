import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { SymbolView } from 'expo-symbols'
import * as Haptics from 'expo-haptics'
import { StyleSheet } from 'react-native-unistyles'

import type { Refran } from '@refranes/data'
import { toggleFavorite, useIsFavorite } from '@/state/favorites'
import { flagPalette } from '@/theme/unistyles'

type Props = {
  refran: Refran
}

export function RefranRow({ refran }: Props) {
  const router = useRouter()
  const isFavorite = useIsFavorite(refran.id)

  return (
    <Pressable
      style={styles.row}
      onPress={() => router.navigate({ pathname: '/', params: { id: refran.id } })}
    >
      <View style={styles.body}>
        <Text style={styles.refran} numberOfLines={2}>
          {refran.refran}
        </Text>
        <Text style={styles.tipo}>{refran.tipo}</Text>
      </View>
      <Pressable
        hitSlop={10}
        onPress={() => {
          Haptics.selectionAsync()
          toggleFavorite(refran.id)
        }}
        style={styles.star}
      >
        <SymbolView
          name={isFavorite ? 'star.fill' : 'star'}
          tintColor={flagPalette[0]}
          size={20}
        />
      </Pressable>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space(3),
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    paddingVertical: theme.space(4),
    paddingHorizontal: theme.space(4),
    marginHorizontal: theme.space(4),
    marginVertical: theme.space(1.5),
  },
  body: {
    flex: 1,
    gap: theme.space(1.5),
  },
  refran: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  tipo: {
    color: theme.colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  star: {
    padding: theme.space(1),
  },
}))
