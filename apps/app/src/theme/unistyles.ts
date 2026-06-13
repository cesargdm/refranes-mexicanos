import { StyleSheet } from 'react-native-unistyles'

// Rosa mexicano — modernized identity of the 2015 app.
const palette = {
  magenta: '#EB00AF',
  teal: '#1FA6A6',
  gold: '#F5B722',
  violet: '#7A3BD7',
  scarlet: '#E8453C',
  ink: '#241B2F',
  inkSoft: '#5B5168',
  paper: '#FFF7F0',
  paperDeep: '#FBE8DA',
  white: '#FFFFFF',
}

// Colors the papel picado banners cycle through.
export const flagPalette = [
  palette.magenta,
  palette.teal,
  palette.gold,
  palette.violet,
  palette.scarlet,
] as const

const lightTheme = {
  colors: {
    ...palette,
    background: palette.paper,
    surface: palette.white,
    text: palette.ink,
    textSoft: palette.inkSoft,
    accent: palette.magenta,
    flagInk: palette.white,
  },
  flagPalette,
  space: (n: number) => n * 4,
  radius: {
    sm: 10,
    chip: 999,
    card: 24,
    sheet: 36,
  },
  font: {
    body: 17,
    title: 28,
    display: 34,
  },
} as const

const breakpoints = {
  xs: 0,
  sm: 380,
  md: 600,
  lg: 900,
} as const

type AppThemes = { light: typeof lightTheme }
type AppBreakpoints = typeof breakpoints

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes: { light: lightTheme },
  breakpoints,
  settings: { initialTheme: 'light' },
})
