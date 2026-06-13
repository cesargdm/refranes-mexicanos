import { useMemo, useState } from 'react'
import { SectionList, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { refranes, type Refran, type RefranTipo } from '@refranes/data'
import { RefranRow } from '@/components/RefranRow'
import { normalize, sectionLetter } from '@/lib/text'

type Filter = 'todos' | RefranTipo

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'refrán', label: 'Refranes' },
  { key: 'dicho', label: 'Dichos' },
]

export default function BuscarScreen() {
  const insets = useSafeAreaInsets()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('todos')

  const sections = useMemo(() => {
    const q = normalize(query.trim())
    const matched = refranes.filter((r) => {
      if (filter !== 'todos' && r.tipo !== filter) return false
      if (!q) return true
      return (
        normalize(r.refran).includes(q) || normalize(r.significado).includes(q)
      )
    })

    const groups = new Map<string, Refran[]>()
    for (const r of matched) {
      const letter = sectionLetter(r.refran)
      const list = groups.get(letter) ?? []
      list.push(r)
      groups.set(letter, list)
    }

    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({
        title,
        data: data.sort((a, b) => a.refran.localeCompare(b.refran)),
      }))
  }, [query, filter])

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.heading}>Buscar</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Busca un refrán o su significado"
          placeholderTextColor="rgba(91,81,104,0.6)"
          style={styles.input}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <Text
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                {f.label}
              </Text>
            )
          })}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RefranRow refran={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>Sin resultados para «{query}».</Text>
        }
        stickySectionHeadersEnabled={false}
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
    paddingBottom: theme.space(3),
    gap: theme.space(3),
  },
  heading: {
    color: theme.colors.text,
    fontSize: theme.font.display,
    fontWeight: '800',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.space(4),
    paddingVertical: theme.space(3.5),
    fontSize: 16,
    color: theme.colors.text,
  },
  filters: {
    flexDirection: 'row',
    gap: theme.space(2),
  },
  chip: {
    overflow: 'hidden',
    color: theme.colors.textSoft,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.chip,
    paddingHorizontal: theme.space(3.5),
    paddingVertical: theme.space(2),
    fontSize: 14,
    fontWeight: '700',
  },
  chipActive: {
    color: theme.colors.white,
    backgroundColor: theme.colors.accent,
  },
  sectionHeader: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: theme.space(6),
    paddingTop: theme.space(4),
    paddingBottom: theme.space(1),
  },
  empty: {
    color: theme.colors.textSoft,
    textAlign: 'center',
    marginTop: theme.space(10),
    fontSize: 15,
  },
}))
