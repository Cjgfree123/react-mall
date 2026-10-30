export const categories = ['all', 'home', 'travel', 'work'] as const
export type Category = (typeof categories)[number]

export interface Product {
  id: string
  category: Exclude<Category, 'all'>
  price: number
  image: string
  background: string
  badge?: 'favorite' | 'new'
  order: number
}

// Stable IDs are independent of translated names; prices are stored in cents.
export const products: Product[] = [
  { id: 'arc-lamp', category: 'home', price: 8900, image: '/products/lamp.svg', background: '#e9ece5', badge: 'favorite', order: 0 },
  { id: 'morning-mug', category: 'home', price: 2400, image: '/products/mug.svg', background: '#f0e8de', order: 1 },
  { id: 'everywhere-tote', category: 'travel', price: 3800, image: '/products/tote.svg', background: '#eae6de', badge: 'new', order: 2 },
  { id: 'daily-notebook', category: 'work', price: 1800, image: '/products/notebook.svg', background: '#e6e9e3', order: 3 },
  { id: 'daybreak-bottle', category: 'travel', price: 3200, image: '/products/bottle.svg', background: '#f0e3dc', order: 4 },
  { id: 'still-vase', category: 'home', price: 4200, image: '/products/vase.svg', background: '#eee4db', order: 5 },
  { id: 'quiet-clock', category: 'work', price: 4800, image: '/products/clock.svg', background: '#e8e8df', order: 6 },
  { id: 'gather-bowl', category: 'home', price: 2800, image: '/products/bowl.svg', background: '#e4e9e3', order: 7 },
]
