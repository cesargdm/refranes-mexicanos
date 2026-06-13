import { useSyncExternalStore } from 'react'
import { createMMKV, type MMKV } from 'react-native-mmkv'

const KEY = 'favorite-ids'

// MMKV is synchronous, which makes it a clean backing store for
// useSyncExternalStore. If native init ever fails we fall back to an
// in-memory set so favorites still work for the session.
let storage: MMKV | null = null
try {
  storage = createMMKV({ id: 'refranes-favorites' })
} catch {
  storage = null
}

function load(): Set<string> {
  try {
    const raw = storage?.getString(KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {
    // ignore malformed payload
  }
  return new Set()
}

let ids = load()
let snapshot: string[] = [...ids]
const listeners = new Set<() => void>()

function persist() {
  try {
    storage?.set(KEY, JSON.stringify([...ids]))
  } catch {
    // in-memory fallback: nothing to persist
  }
}

function emit() {
  snapshot = [...ids]
  for (const listener of listeners) listener()
}

export function toggleFavorite(id: string) {
  if (ids.has(id)) ids.delete(id)
  else ids.add(id)
  persist()
  emit()
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot() {
  return snapshot
}

/** Ordered list of favorited refrán ids. Re-renders when it changes. */
export function useFavoriteIds(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** Whether a single id is favorited. Re-renders only this consumer. */
export function useIsFavorite(id: string): boolean {
  const favorites = useFavoriteIds()
  return favorites.includes(id)
}
