import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCatalog } from '../hooks/useCatalog'
import { formatPrice } from '../utils/formatPrice'
import { Icon } from './Icon'
import { ProductImage } from './ProductImage'

interface Props {
  open: boolean
  cart: Record<string, number>
  onClose: () => void
  onQuantityChange: (id: string, quantity: number) => void
}

export function CartDrawer({ open, cart, onClose, onQuantityChange }: Props) {
  const { t, i18n } = useTranslation()
  const products = useCatalog()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointerStartedOnBackdrop = useRef(false)
  const items = products.filter((product) => cart[product.id] > 0)
  const count = items.reduce((sum, product) => sum + cart[product.id], 0)
  const subtotal = items.reduce((sum, product) => sum + product.price * cart[product.id], 0)
  const language = i18n.resolvedLanguage ?? 'en'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    // Native dialog traps keyboard focus and restores it on close.
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return <dialog ref={dialogRef} className="cart-drawer" aria-labelledby="cart-title"
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onPointerDown={(event) => { pointerStartedOnBackdrop.current = event.target === event.currentTarget }}
    onClick={(event) => { if (event.target === event.currentTarget && pointerStartedOnBackdrop.current) onClose() }}>
    <div className="cart-panel">
      <div className="cart-heading">
        <div><span className="eyebrow muted">{t('cart.eyebrow')}</span><h2 id="cart-title">{t('cart.title')} <span>({count})</span></h2></div>
        <button className="icon-button" onClick={onClose} aria-label={t('cart.close')}><Icon name="close" /></button>
      </div>
      {items.length ? <>
        <div className="cart-items">{items.map((product) => <article className="cart-item" key={product.id}>
          <ProductImage className="cart-item-image" src={product.image} alt={product.name} style={{ background: product.background }} width="90" height="110" />
          <div className="cart-item-details">
            <h3>{product.name}</h3>
            <p>{t('cart.each', { color: product.color, price: formatPrice(product.price, language) })}</p>
            <div className="cart-item-actions">
              <div className="quantity-control">
                <button onClick={() => onQuantityChange(product.id, cart[product.id] - 1)} aria-label={t('cart.decrease', { name: product.name })}><Icon name="minus" size={15} /></button>
                <span aria-label={t('cart.quantity', { count: cart[product.id] })}>{cart[product.id]}</span>
                <button onClick={() => onQuantityChange(product.id, cart[product.id] + 1)} aria-label={t('cart.increase', { name: product.name })}><Icon name="plus" size={15} /></button>
              </div>
              <button className="remove-button" onClick={() => onQuantityChange(product.id, 0)} aria-label={t('cart.removeLabel', { name: product.name })}>{t('cart.remove')}</button>
            </div>
            <strong>{formatPrice(product.price * cart[product.id], language)}</strong>
          </div>
        </article>)}</div>
        <div className="cart-summary">
          <div><span>{t('cart.subtotal')}</span><strong>{formatPrice(subtotal, language)} <small>{t('cart.currency')}</small></strong></div>
          <p>{t('cart.shipping')}<br />{t('cart.noPayment')}</p>
          <button className="primary-button" onClick={onClose}>{t('cart.continue')}<Icon name="arrow" size={18} /></button>
        </div>
      </> : <div className="empty-cart">
        <Icon name="bag" size={48} /><h3>{t('cart.emptyTitle')}</h3><p>{t('cart.emptyDescription')}</p>
        <button className="primary-button" onClick={onClose}>{t('cart.explore')}<Icon name="arrow" size={18} /></button>
      </div>}
    </div>
  </dialog>
}
