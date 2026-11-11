import { createContext, useContext } from 'react'

export type CartProduct = {
  id: number
  title: string
  price: number
  thumbnail: string
  stock: number
}

export type CartItem = CartProduct & {
  quantity: number
}

export const CartContext = createContext<{
  items: CartItem[]
  addToCart: (product: CartProduct, quantity: number) => void
} | null>(null)

export function useCart() {
  const cart = useContext(CartContext)

  if (!cart) {
    throw new Error('useCart must be used inside CartContext.Provider')
  }

  return cart
}