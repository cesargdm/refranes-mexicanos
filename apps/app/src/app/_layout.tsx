import '@/theme/unistyles'

import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Refranes</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'quote.bubble', selected: 'quote.bubble.fill' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="buscar">
          <NativeTabs.Trigger.Label>Buscar</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="favoritos">
          <NativeTabs.Trigger.Label>Favoritos</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'star', selected: 'star.fill' }}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </GestureHandlerRootView>
  )
}
