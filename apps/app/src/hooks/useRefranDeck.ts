import { useCallback, useEffect, useRef, useState } from 'react'
import { refranes, type Refran } from '@refranes/data'

function shuffle(source: readonly Refran[]): Refran[] {
  const out = source.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export type RefranDeck = {
  current: Refran
  /** Monotonic counter — bump it to retrigger entrance animations. */
  step: number
  /** Direction of the last transition: 1 = forward, -1 = back. */
  direction: 1 | -1
  next: () => void
  prev: () => void
  jumpTo: (id: string) => void
}

/**
 * Holds a shuffled order over the full dictionary plus the current position.
 * `initialId` (from a Buscar/Favoritos tap) opens that saying first.
 */
export function useRefranDeck(initialId?: string): RefranDeck {
  const orderRef = useRef<Refran[]>(shuffle(refranes))
  const order = orderRef.current

  const indexFor = useCallback(
    (id?: string) => {
      if (!id) return 0
      const i = order.findIndex((r) => r.id === id)
      return i >= 0 ? i : 0
    },
    [order],
  )

  const [index, setIndex] = useState(() => indexFor(initialId))
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Jump when navigated to with a new id.
  const lastInitial = useRef(initialId)
  useEffect(() => {
    if (initialId && initialId !== lastInitial.current) {
      lastInitial.current = initialId
      setDirection(1)
      setIndex(indexFor(initialId))
      setStep((s) => s + 1)
    }
  }, [initialId, indexFor])

  const next = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % order.length)
    setStep((s) => s + 1)
  }, [order.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + order.length) % order.length)
    setStep((s) => s + 1)
  }, [order.length])

  const jumpTo = useCallback(
    (id: string) => {
      setDirection(1)
      setIndex(indexFor(id))
      setStep((s) => s + 1)
    },
    [indexFor],
  )

  return { current: order[index]!, step, direction, next, prev, jumpTo }
}
