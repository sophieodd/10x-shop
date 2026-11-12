import type { CartItem } from './cart'

export const FREE_SHIPPING_THRESHOLD_CENTS = 10_000
const SHIPPING_COST_CENTS = 1_000

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatPrice(cents: number): string {
  return usd.format(cents / 100)
}

export function getDiscountedUnitPriceCents(
  price: number,
  discountPercentage = 0,
): number {
  return Math.round(price * (1 - discountPercentage / 100) * 100)
}

export function getCartTotals(items: CartItem[], promoCode: '10X10' | null) {
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = getDiscountedUnitPriceCents(
      item.price,
      item.discountPercentage,
    )

    return sum + unitPrice * item.quantity
  }, 0)

  const discount = promoCode === '10X10' ? Math.round(subtotal * 0.1) : 0
  const discountedSubtotal = subtotal - discount
  const qualifiesForFreeShipping =
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD_CENTS

  const shipping =
    items.length === 0 || qualifiesForFreeShipping ? 0 : SHIPPING_COST_CENTS

  return {
    subtotal,
    discount,
    shipping,
    total: discountedSubtotal + shipping,
  }
}