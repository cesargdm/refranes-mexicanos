import { useIsFocused } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

import { BannerStage } from '@/components/BannerStage'
import { useRefranDeck } from '@/hooks/useRefranDeck'

export default function RefranesScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const deck = useRefranDeck(id)
  const focused = useIsFocused()

  // Keep the deck state alive across tab switches, but don't run the Skia
  // canvases / sway animation while another tab is in front.
  if (!focused) return <View style={{ flex: 1, backgroundColor: '#FFF7F0' }} />

  return <BannerStage deck={deck} />
}
