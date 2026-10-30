export const categories = ['All essentials', 'Home & living', 'On the go', 'Work & create'] as const
export type Category = (typeof categories)[number]

export interface Product {
  id: string
  name: string
  description: string
  category: Exclude<Category, 'All essentials'>
  price: number
  image: string
  color: string
  background: string
  badge?: string
  order: number
}

// Store prices in cents so cart arithmetic stays exact.
export const products: Product[] = [
  { id: 'arc-lamp', name: 'The Arc Table Lamp', description: 'A softer light for slower evenings.', category: 'Home & living', price: 8900, image: '/products/lamp.svg', color: 'Olive', background: '#e9ece5', badge: 'THE EVERYDAY FAVORITE', order: 0 },
  { id: 'morning-mug', name: 'The Morning Mug', description: 'A good day starts with a good cup.', category: 'Home & living', price: 2400, image: '/products/mug.svg', color: 'Oat', background: '#f0e8de', order: 1 },
  { id: 'everywhere-tote', name: 'The Everywhere Tote', description: 'Room for the little things. And more.', category: 'On the go', price: 3800, image: '/products/tote.svg', color: 'Natural', background: '#eae6de', badge: 'NEW TO THE EDIT', order: 2 },
  { id: 'daily-notebook', name: 'The Daily Notebook', description: 'A little space for your next big idea.', category: 'Work & create', price: 1800, image: '/products/notebook.svg', color: 'Forest', background: '#e6e9e3', order: 3 },
  { id: 'daybreak-bottle', name: 'The Daybreak Bottle', description: 'A small reminder to take a moment.', category: 'On the go', price: 3200, image: '/products/bottle.svg', color: 'Clay', background: '#f0e3dc', order: 4 },
  { id: 'still-vase', name: 'The Still Vase', description: 'Beautiful with flowers. Or without.', category: 'Home & living', price: 4200, image: '/products/vase.svg', color: 'Terracotta', background: '#eee4db', order: 5 },
  { id: 'quiet-clock', name: 'The Quiet Clock', description: 'Make time for what matters.', category: 'Work & create', price: 4800, image: '/products/clock.svg', color: 'Sand', background: '#e8e8df', order: 6 },
  { id: 'gather-bowl', name: 'The Gather Bowl', description: 'For everyday rituals around the table.', category: 'Home & living', price: 2800, image: '/products/bowl.svg', color: 'Sage', background: '#e4e9e3', order: 7 },
]

export const formatPrice = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
