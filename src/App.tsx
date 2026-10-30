import { useEffect, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { Icon } from './components/Icon'
import { ProductCard } from './components/ProductCard'
import { categories, products } from './data/products'
import type { Category } from './data/products'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('All essentials')
  const [sort, setSort] = useState('featured')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; productId: string; productName: string } | null>(null)
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const searchTerm = query.trim()
  const hasFilters = searchTerm.length > 0 || category !== 'All essentials'
  const visibleProducts = products
    .filter((product) => category === 'All essentials' || product.category === category)
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : a.order - b.order)

  useEffect(() => {
    if (!toast) return
    // Each addition restarts the timer, even when the product stays the same.
    const timeout = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  function addToCart(id: string) {
    const product = products.find((item) => item.id === id)
    if (!product) return
    setCart((previous) => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }))
    setToast((previous) => ({ id: (previous?.id ?? 0) + 1, productId: id, productName: product.name }))
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
    setCategory('All essentials')
  }

  return (
    <>
      <a className="skip-link" href="#collection">Skip to products</a>
      <div className="announcement-bar">A little less ordinary. A little more everyday.</div>
      <header className="site-header page-width">
        <a className="wordmark" href="#" aria-label="Form and Field home">form<span>&</span>field<sup>®</sup></a>
        <a className="header-link" href="#collection">The collection <Icon name="arrow" size={15} /></a>
        <div className="header-actions">
          <span className="currency">USD $</span>
          <button className="bag-button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${count} items`}>
            <Icon name="bag" /><span className="bag-label">Your bag</span><span className="bag-count">{count}</span>
          </button>
        </div>
      </header>
      <main className="page-width">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><span className="little-dot" /> THE EVERYDAY COLLECTION · VOL. 01</span>
            <h1 id="hero-title">Good things.<br />For <em>every day.</em></h1>
            <p>Thoughtfully chosen essentials for your space,<br className="desktop-break" /> your routine, and everything in between.</p>
            <a className="primary-button" href="#collection">Explore the collection <Icon name="arrow" size={18} /></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle" />
            <span className="art-caption">LESS, BUT BETTER.</span>
            <img className="hero-lamp" src="/products/lamp.svg" alt="" />
            <img className="hero-mug" src="/products/mug.svg" alt="" />
            <img className="hero-vase" src="/products/vase.svg" alt="" />
            <div className="art-platform" />
            <span className="art-edition">OBJECTS FOR A WELL-LIVED LIFE <span>↗</span></span>
          </div>
        </section>
        <div className="values-strip" aria-label="Our collection">
          <span><Icon name="spark" size={17} /> Selected with intention</span>
          <span><Icon name="leaf" size={17} /> Designed for the everyday</span>
          <span><Icon name="globe" size={17} /> A world of small discoveries</span>
        </div>
        <section id="collection" className="collection" aria-labelledby="collection-title">
          <div className="collection-heading">
            <div><span className="eyebrow muted">THE EDIT</span><h2 id="collection-title">Your next everyday favorite.</h2></div>
            <span className="collection-note">Small details. A better everyday.</span>
          </div>
          <div className="collection-toolbar">
            <div className="category-list" role="group" aria-label="Filter by category">
              {categories.map((item) => <button key={item} className={`category-button ${category === item ? 'selected' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <div className="search-field" role="search">
              <Icon name="search" size={18} />
              <label htmlFor="product-search" className="sr-only">Search products by name</label>
              <input id="product-search" type="search" placeholder="Search by product name…" aria-controls="product-results" value={query} onChange={(event) => setQuery(event.target.value)} />
              {query.length > 0 && <button className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
            </div>
          </div>
          {hasFilters && <div className="active-filters">
            <p>{searchTerm ? <>Results for <strong>“{searchTerm}”</strong></> : 'Browsing'}{category !== 'All essentials' ? <> in <strong>{category}</strong></> : ' across all categories'}</p>
            <button onClick={resetFilters}>Clear all filters <Icon name="close" size={13} /></button>
          </div>}
          <div className="results-bar">
            <span role="status" aria-atomic="true">Showing {visibleProducts.length} of {products.length} products</span>
            <label className="sort-control">Sort by <select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
          </div>
          <div id="product-results">
            {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} onAdd={() => addToCart(product.id)} />)}</div> : <div className="empty-results">
              <Icon name="search" size={32} />
              <h3>No products found.</h3>
              <p>No products {searchTerm ? <>match <strong>“{searchTerm}”</strong></> : 'are available'}{category !== 'All essentials' && <> in <strong>{category}</strong></>}.<br />Try another product name, switch category, or clear your filters.</p>
              <button className="primary-button" onClick={resetFilters}>Clear filters</button>
            </div>}
          </div>
        </section>
        <section className="closing-note"><span className="eyebrow">THE FORM & FIELD WAY</span><p>Fewer things.<br /><em>More meaning.</em></p><span>Useful objects, thoughtful details, and a little room to slow down.</span></section>
      </main>
      <footer className="site-footer page-width"><a className="wordmark" href="#">form<span>&</span>field<sup>®</sup></a><span>A considered collection for everyday living.</span><small>Demo store · All prices in USD · No real orders</small></footer>
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
        {toast && <div className="cart-toast" key={toast.id}>
          <span className="toast-check"><Icon name="check" size={18} /></span>
          <div><strong>Added to your bag</strong><p>{toast.productName} · {cart[toast.productId]} in your bag</p></div>
        </div>}
      </div>
      <CartDrawer open={cartOpen} cart={cart} onClose={() => setCartOpen(false)} onQuantityChange={changeQuantity} />
    </>
  )
}

export default App
