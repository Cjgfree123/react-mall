import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CartDrawer } from '../../components/CartDrawer'
import { HeroCarousel } from '../../components/HeroCarousel'
import { Icon } from '../../components/Icon'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import { ProductCard } from '../../components/ProductCard'
import { categories } from '../../data/products'
import type { Category } from '../../data/products'
import { useCatalog } from '../../hooks/useCatalog'
import './index.less'

export default function ShopPage() {
  const { t } = useTranslation()
  const products = useCatalog()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; productId: string } | null>(null)
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const searchTerm = query.trim()
  const hasFilters = searchTerm.length > 0 || category !== 'all'
  const categoryLabel = t(`categories.${category}`)
  const visibleProducts = products
    .filter((product) => category === 'all' || product.category === category)
    .filter((product) => product.searchNames.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase())))
    .sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : a.order - b.order)
  const filterDescription = searchTerm
    ? t(category === 'all' ? 'catalog.filterSearchAll' : 'catalog.filterSearchCategory', { query: searchTerm, category: categoryLabel })
    : t('catalog.filterCategory', { category: categoryLabel })
  const emptyDescription = searchTerm
    ? t(category === 'all' ? 'catalog.emptySearchAll' : 'catalog.emptySearchCategory', { query: searchTerm, category: categoryLabel })
    : t('catalog.emptyCategory', { category: categoryLabel })

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function addToCart(id: string) {
    if (!products.some((product) => product.id === id)) return
    setCart((previous) => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }))
    setToast((previous) => ({ id: (previous?.id ?? 0) + 1, productId: id }))
  }

  function changeQuantity(id: string, quantity: number) {
    setCart((previous) => {
      const next = { ...previous }
      if (quantity <= 0) delete next[id]
      else next[id] = quantity
      return next
    })
  }

  function resetFilters() {
    setQuery('')
    setCategory('all')
  }

  return <>
    <a className="skip-link" href="#collection">{t('catalog.skip')}</a>
    <div className="announcement-bar">{t('header.announcement')}</div>
    <header className="site-header page-width">
      <a className="wordmark" href="#" aria-label={t('brand.home')}>{t('brand.first')}<span>{t('brand.second')}</span></a>
      <div className="header-actions">
        <LanguageSwitcher />
        <span className="currency">{t('header.currency')}</span>
        <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={t('cart.open', { count })}>
          <Icon name="bag" /><span className="bag-label">{t('cart.title')}</span><span className="bag-count">{count}</span>
        </button>
      </div>
    </header>
    <main className="page-width">
      <HeroCarousel />
      <div className="values-strip" aria-label={t('catalog.valuesLabel')}>
        <span><Icon name="spark" size={17} />{t('catalog.valueSelected')}</span>
        <span><Icon name="leaf" size={17} />{t('catalog.valueEveryday')}</span>
        <span><Icon name="globe" size={17} />{t('catalog.valueWorld')}</span>
      </div>
      <section id="collection" className="collection" aria-labelledby="collection-title">
        <div className="collection-heading">
          <div><span className="eyebrow muted">{t('catalog.eyebrow')}</span><h2 id="collection-title">{t('catalog.title')}</h2></div>
          <span className="collection-note">{t('catalog.note')}</span>
        </div>
        <div className="collection-toolbar">
          <div className="category-list" role="group" aria-label={t('catalog.categoriesLabel')}>
            {categories.map((item) => <button key={item} className={`category-button ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{t(`categories.${item}`)}</button>)}
          </div>
          <div className="search-field" role="search">
            <Icon name="search" size={18} />
            <label htmlFor="product-search" className="sr-only">{t('catalog.searchLabel')}</label>
            <input id="product-search" type="search" placeholder={t('catalog.searchPlaceholder')} aria-controls="product-results" value={query} onChange={(event) => setQuery(event.target.value)} />
            {query.length > 0 && <button className="clear-search" aria-label={t('catalog.clearSearch')} onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
          </div>
        </div>
        {hasFilters && <div className="active-filters">
          <p>{filterDescription}</p>
          <button onClick={resetFilters}>{t('catalog.clearAll')}<Icon name="close" size={13} /></button>
        </div>}
        <div className="results-bar">
          <span role="status" aria-atomic="true">{t('catalog.results', { count: visibleProducts.length, total: products.length })}</span>
          <label className="sort-control">{t('catalog.sortBy')}
            <select aria-label={t('catalog.sortLabel')} value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">{t('catalog.sortFeatured')}</option>
              <option value="price-low">{t('catalog.sortLow')}</option>
              <option value="price-high">{t('catalog.sortHigh')}</option>
            </select>
          </label>
        </div>
        <div id="product-results">
          {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} onAdd={() => addToCart(product.id)} />)}</div> : <div className="empty-results">
            <Icon name="search" size={32} />
            <h3>{t('catalog.emptyTitle')}</h3>
            <p>{emptyDescription}<br />{t('catalog.emptyHelp')}</p>
            <button className="primary-button" onClick={resetFilters}>{t('catalog.clearFilters')}</button>
          </div>}
        </div>
      </section>
      <section className="closing-note"><span className="eyebrow">{t('closing.eyebrow')}</span><p>{t('closing.line1')}<br /><em>{t('closing.line2')}</em></p><span>{t('closing.description')}</span></section>
    </main>
    <footer className="site-footer page-width"><a className="wordmark" href="#">{t('brand.first')}<span>{t('brand.second')}</span></a><span>{t('footer.description')}</span><small>{t('footer.note')}</small></footer>
    <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
      {toast && <div className="cart-toast" key={toast.id}>
        <span className="toast-check"><Icon name="check" size={18} /></span>
        <div><strong>{t('toast.added')}</strong><p>{t('toast.inBag', { name: t(`products.${toast.productId}.name`), count: cart[toast.productId] ?? 0 })}</p></div>
      </div>}
    </div>
    <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onQuantityChange={changeQuantity} />
  </>
}
