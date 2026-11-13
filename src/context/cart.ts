import { createContext, useContext } from 'react'

export type CartProduct = {
  id: number
  title: string
  price: number
  thumbnail: string
  stock: number
  discountPercentage?: number
}

export type CartItem = CartProduct & {
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addToCart: (product: CartProduct, quantity: number) => void
  setQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  promoCode: '10X10' | null
  setPromoCode: (code: '10X10' | null) => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const cart = useContext(CartContext)

  if (!cart) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return cart
}