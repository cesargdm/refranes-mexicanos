/** Lowercase + strip diacritics for accent-insensitive search and grouping. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** First letter (A–Z) of a saying, for section grouping. */
export function sectionLetter(refran: string): string {
  const n = normalize(refran).replace(/[^a-z]/g, '')
  return (n[0] ?? '#').toUpperCase()
}
