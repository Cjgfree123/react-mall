import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import ShopPage from '../pages/ShopPage'
import NotFoundPage from '../pages/NotFoundPage'

// Add future pages here, for example /products/:productId.
export const routes: RouteObject[] = [
  { path: '/', Component: ShopPage },
  { path: '*', Component: NotFoundPage },
]

export const router = createBrowserRouter(routes)
