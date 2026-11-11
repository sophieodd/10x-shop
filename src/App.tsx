import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { CartContext, type CartItem, type CartProduct } from './cart'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductCatalog from './components/ProductCatalog'
import ProductDetails from './components/ProductDetails'

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
  if (count <= 5) return 'Your bank has contacted us'
  return 'Okay stopppppppp - maybe ice cream and therapy?'
}

function HomePage() {
  return (
    <main id="shop">
      <Hero />
      <ProductCatalog
        eyebrow="ERROR 404: COMMITMENT NOT FOUND"
        title="For the ones with commitment issues."
        description="Couches, gadgets and other temporary attachments."
      />
    </main>
  )
}

export default function App() {
  const [cart, setCart] = useState<{
    items: CartItem[]
    toast: { count: number } | null
  }>(() => ({
    items: loadCartItems(),
    toast: null,
  }))

  const { items, toast } = cart
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // The cart still works for this visit if browser storage is unavailable.
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

  return (
    <CartContext.Provider value={{ items, addToCart }}>
      <Header cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="*"
          element={
            <main className="min-h-screen bg-[var(--color-page)] px-6 py-16">
              <h1 className="text-3xl font-bold">404: Page not found.</h1>
            </main>
          }
        />
      </Routes>

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