import { useLocalSearchParams } from 'expo-router'

import { BannerStage } from '@/components/BannerStage'
import { useRefranDeck } from '@/hooks/useRefranDeck'

export default function RefranesScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const deck = useRefranDeck(id)
  return <BannerStage deck={deck} />
}
