import { useMemo } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SymbolView } from 'expo-symbols'
import { StyleSheet } from 'react-native-unistyles'

import { getRefranById } from '@refranes/data'
import { RefranRow } from '@/components/RefranRow'
import { useFavoriteIds } from '@/state/favorites'
import { flagPalette } from '@/theme/unistyles'

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets()
  const favoriteIds = useFavoriteIds()

  const favorites = useMemo(
    () => favoriteIds.map(getRefranById).filter((r) => r !== undefined),
    [favoriteIds],
  )

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.heading}>Favoritos</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RefranRow refran={item} />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <View style={styles.empty}>
            <SymbolView
              name="star"
              tintColor={flagPalette[0]}
              size={40}
            />
            <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
            <Text style={styles.emptyBody}>
              Toca la estrella en cualquier refrán para guardarlo aquí.
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.space(4),
    paddingBottom: theme.space(2),
  },
  heading: {
    color: theme.colors.text,
    fontSize: theme.font.display,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    gap: theme.space(3),
    marginTop: theme.space(20),
    paddingHorizontal: theme.space(10),
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: theme.colors.textSoft,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
  },
}))
