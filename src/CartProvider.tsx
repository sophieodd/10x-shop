import { useEffect, useState, type ReactNode } from 'react'
import { CartContext, type CartItem, type CartProduct } from './cart'

const CART_STORAGE_KEY = 'ctrl-me-cart'

function loadCartItems(): CartItem[] {
  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return []

    const items = JSON.parse(savedCart) as CartItem[]
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

function getCartMessage(count: number): string {
  if (count === 1) return 'A reasonable decision.'
  if (count === 2) return 'Interesting development.'
  if (count === 3) return 'Are you okay?'
  if (count === 4) return 'WE NEED TO TALK..'
  if (count === 5) return 'Your bank has contacted us'
  return 'Okay stopppppppp - maybe ice cream and therapy?'
}

type CartProviderProps = {
  children: ReactNode
}

export default function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<{
    items: CartItem[]
    toast: { count: number } | null
  }>(() => ({
    items: loadCartItems(),
    toast: null,
  }))

  const { items, toast } = cart

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Keep the cart available in memory if browser storage is unavailable.
    }
  }, [items])

  useEffect(() => {
    if (!toast) return

    const timer = window.setTimeout(() => {
      setCart((current) =>
        current.toast === toast ? { ...current, toast: null } : current,
      )
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [toast])

  function addToCart(product: CartProduct, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1 || product.stock < 1) {
      return
    }

    setCart((current) => {
      const existing = current.items.find((item) => item.id === product.id)
      const previousQuantity = existing?.quantity ?? 0
      const nextQuantity = Math.min(previousQuantity + quantity, product.stock)

      if (nextQuantity <= previousQuantity) return current

      const updatedItem = { ...product, quantity: nextQuantity }
      const nextItems = existing
        ? current.items.map((item) =>
            item.id === product.id ? updatedItem : item,
          )
        : [...current.items, updatedItem]

      const count = nextItems.reduce((total, item) => total + item.quantity, 0)

      return { items: nextItems, toast: { count } }
    })
  }

  function setQuantity(id: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) return

    setCart((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item,
      ),
    }))
  }

  function removeItem(id: number) {
    setCart((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }))
  }

  function clearCart() {
    setCart({ items: [], toast: null })
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, setQuantity, removeItem, clearCart }}
    >
      {children}

      <div
        role="status"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-end"
      >
        {toast && (
          <div className="max-w-full bg-[var(--color-magenta)] px-5 py-3 text-white shadow-lg">
            <p className="font-[var(--font-tech)] text-xs uppercase">
              Added to cart · {toast.count} {toast.count === 1 ? 'item' : 'items'}
            </p>
            <p className="mt-1 font-[var(--font-display)] text-lg font-bold">
              {getCartMessage(toast.count)}
            </p>
          </div>
        )}
      </div>
    </CartContext.Provider>
  )
}