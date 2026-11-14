import { useEffect, useState, type ReactNode } from 'react'
import { CartContext, type CartItem, type CartProduct } from './cart'

const CART_STORAGE_KEY = 'ctrl-me-cart'
const PROMO_STORAGE_KEY = 'ctrl-me-promo'

type PromoCode = '10X10' | null

type CartState = {
  items: CartItem[]
  promoCode: PromoCode
  acknowledgedTaste: boolean
  toast: { count: number } | null
}

type CartProviderProps = {
  children: ReactNode
}

function loadCart(): CartState {
  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    const parsedItems: unknown = savedCart ? JSON.parse(savedCart) : []
    const items = Array.isArray(parsedItems) ? (parsedItems as CartItem[]) : []

    const promoCode =
      items.length > 0 &&
      window.localStorage.getItem(PROMO_STORAGE_KEY) === '10X10'
        ? '10X10'
        : null

    return {
      items,
      promoCode,
      acknowledgedTaste: false,
      toast: null,
    }
  } catch {
    return {
      items: [],
      promoCode: null,
      acknowledgedTaste: false,
      toast: null,
    }
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

export default function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>(loadCart)
  const { items, promoCode, acknowledgedTaste, toast } = cart

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))

      if (promoCode) {
        window.localStorage.setItem(PROMO_STORAGE_KEY, promoCode)
      } else {
        window.localStorage.removeItem(PROMO_STORAGE_KEY)
      }
    } catch {
      // The cart still works in memory if browser storage is unavailable.
    }
  }, [items, promoCode])

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

      return { ...current, items: nextItems, toast: { count } }
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
    setCart((current) => {
      const nextItems = current.items.filter((item) => item.id !== id)

      if (nextItems.length === 0) {
        return {
          items: [],
          promoCode: null,
          acknowledgedTaste: false,
          toast: null,
        }
      }

      return { ...current, items: nextItems, toast: null }
    })
  }

  function clearCart() {
    setCart({
      items: [],
      promoCode: null,
      acknowledgedTaste: false,
      toast: null,
    })
  }

  function setPromoCode(code: PromoCode) {
    setCart((current) => ({
      ...current,
      promoCode: current.items.length > 0 ? code : null,
    }))
  }

  function setAcknowledgedTaste(acknowledgedTaste: boolean) {
    setCart((current) => ({ ...current, acknowledgedTaste }))
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        setQuantity,
        removeItem,
        clearCart,
        promoCode,
        setPromoCode,
        acknowledgedTaste,
        setAcknowledgedTaste,
      }}
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