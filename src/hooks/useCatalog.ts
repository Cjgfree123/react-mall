import { useTranslation } from 'react-i18next'
import { products } from '../data/products'
import type { Product } from '../data/products'

export interface LocalizedProduct extends Product {
  name: string
  description: string
  color: string
  categoryLabel: string
  badgeLabel?: string
  searchNames: string[]
}

export function useCatalog(): LocalizedProduct[] {
  const { t } = useTranslation()
  return products.map((product) => {
    const name = t(`products.${product.id}.name`)
    return {
      ...product,
      name,
      description: t(`products.${product.id}.description`),
      color: t(`products.${product.id}.color`),
      categoryLabel: t(`categories.${product.category}`),
      badgeLabel: product.badge ? t(`product.badges.${product.badge}`) : undefined,
      // Keep English names searchable after changing language.
      searchNames: [name, t(`products.${product.id}.name`, { lng: 'en' })],
    }
  })
}
