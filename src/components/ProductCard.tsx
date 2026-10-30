import type { Product } from '../data/products'
import { formatPrice } from '../data/products'
import { Icon } from './Icon'
import { ProductImage } from './ProductImage'

export function ProductCard({ product, quantity, onAdd }: { product: Product; quantity: number; onAdd: () => void }) {
  return (
    <article className="product-card">
      <div className="product-image" style={{ background: product.background }}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <ProductImage className="product-photo" src={product.image} alt={`${product.name} in ${product.color}`} loading="lazy" width="400" height="400" />
        <span className="product-color"><span />{product.color}</span>
        <button className={`quick-add ${quantity ? 'has-items' : ''}`} onClick={onAdd} aria-label={`Add ${product.name} to bag${quantity ? `, ${quantity} already in bag` : ''}`}><Icon name={quantity ? 'check' : 'plus'} size={20} /></button>
      </div>
      <div className="product-meta"><span>{product.category}</span><span>{formatPrice(product.price)}</span></div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button className="text-add" onClick={onAdd}>Add to bag <Icon name="plus" size={14} /></button>
    </article>
  )
}
