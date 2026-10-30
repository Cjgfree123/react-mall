export function formatPrice(cents: number, language: string) {
  return new Intl.NumberFormat(language, { style: 'currency', currency: 'USD' }).format(cents / 100)
}
