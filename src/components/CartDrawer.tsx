import { useEffect, useRef } from 'react'
import { products, formatPrice } from '../data/products'
import { Icon } from './Icon'

interface Props {
  open: boolean
  cart: Record<string, number>
  onClose: () => void
  onQuantityChange: (id: string, quantity: number) => void
}

export function CartDrawer({ open, cart, onClose, onQuantityChange }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const items = products.filter((product) => cart[product.id] > 0)
  const count = items.reduce((sum, product) => sum + cart[product.id], 0)
  const subtotal = items.reduce((sum, product) => sum + product.price * cart[product.id], 0)

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

  return (
    <dialog ref={dialogRef} className="cart-drawer" aria-labelledby="cart-title" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="cart-panel">
        <div className="cart-heading"><div><span className="eyebrow muted">GOOD CHOICES, ALL HERE.</span><h2 id="cart-title">Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close shopping bag"><Icon name="close" /></button></div>
        {items.length ? <>
          <div className="cart-items">{items.map((product) => <article className="cart-item" key={product.id}>
            <img src={product.image} alt={product.name} style={{ background: product.background }} width="100" height="110" />
            <div className="cart-item-details"><h3>{product.name}</h3><p>{product.color} · {formatPrice(product.price)} each</p><div className="cart-item-actions"><div className="quantity-control"><button onClick={() => onQuantityChange(product.id, cart[product.id] - 1)} aria-label={`Decrease quantity of ${product.name}`}><Icon name="minus" size={15} /></button><span aria-label={`Quantity: ${cart[product.id]}`}>{cart[product.id]}</span><button onClick={() => onQuantityChange(product.id, cart[product.id] + 1)} aria-label={`Increase quantity of ${product.name}`}><Icon name="plus" size={15} /></button></div><button className="remove-button" onClick={() => onQuantityChange(product.id, 0)} aria-label={`Remove ${product.name} from bag`}>Remove</button></div><strong>{formatPrice(product.price * cart[product.id])}</strong></div>
          </article>)}</div>
          <div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)} <small>USD</small></strong></div><p>Shipping and taxes are not included.<br />This is a demo store. No payment will be collected.</p><button className="primary-button" onClick={onClose}>Continue exploring <Icon name="arrow" size={18} /></button></div>
        </> : <div className="empty-cart"><Icon name="bag" size={48} /><h3>A little room for good things.</h3><p>Your bag is empty. Find your everyday favorite.</p><button className="primary-button" onClick={onClose}>Explore the collection <Icon name="arrow" size={18} /></button></div>}
      </div>
    </dialog>
  )
}
