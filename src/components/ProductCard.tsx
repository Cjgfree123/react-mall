import { useTranslation } from 'react-i18next'
import type { LocalizedProduct } from '../hooks/useCatalog'
import { formatPrice } from '../utils/formatPrice'
import { Icon } from './Icon'
import { ProductImage } from './ProductImage'

export function ProductCard({ product, quantity, onAdd }: { product: LocalizedProduct; quantity: number; onAdd: () => void }) {
  const { t, i18n } = useTranslation()
  return <article className="product-card">
    <div className="product-image" style={{ background: product.background }}>
      {product.badgeLabel && <span className="product-badge">{product.badgeLabel}</span>}
      <ProductImage className="product-photo" src={product.image} alt={t('common.imageAlt', { name: product.name, color: product.color })} loading="lazy" width="400" height="400" />
      <span className="product-color"><span />{product.color}</span>
      <button className={`quick-add ${quantity ? 'has-items' : ''}`} onClick={onAdd} aria-label={t(quantity ? 'product.addLabelInBag' : 'product.addLabel', { name: product.name, count: quantity })}><Icon name={quantity ? 'check' : 'plus'} size={20} /></button>
    </div>
    <div className="product-meta"><span>{product.categoryLabel}</span><span>{formatPrice(product.price, i18n.resolvedLanguage ?? 'en')}</span></div>
    <h3>{product.name}</h3>
    <p>{product.description}</p>
    <button className="text-add" onClick={onAdd}>{t('product.add')}<Icon name="plus" size={14} /></button>
  </article>
}
