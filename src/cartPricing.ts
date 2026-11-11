import type { CartItem } from './cart'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(cents: number) {
  return usd.format(cents / 100)
}

export function getCartTotals(items: CartItem[], promoCode: '10X10' | null) {
  const subtotal = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  )

  const discount = promoCode === '10X10' ? Math.round(subtotal * 0.1) : 0
  const discountedSubtotal = subtotal - discount
  const shipping = items.length === 0 || discountedSubtotal >= 10_000 ? 0 : 1_000

  return {
    subtotal,
    discount,
    shipping,
    total: discountedSubtotal + shipping,
  }
}