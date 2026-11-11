import { Route, Routes } from 'react-router'
import CartProvider from './CartProvider'
import { useCart } from './cart'
import CartPage from './components/CartPage'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductCatalog from './components/ProductCatalog'
import ProductDetails from './components/ProductDetails'
import AuthProvider from './AuthProvider'
import LoginPage from './components/LoginPage'
import CheckoutPage from './components/CheckoutPage'

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

function ShopLayout() {
  const { items } = useCart()
  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Header cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="*"
          element={
            <main className="min-h-screen bg-[var(--color-page)] px-6 py-16">
              <h1 className="text-3xl font-bold">404: Page not found.</h1>
            </main>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ShopLayout />
      </CartProvider>
    </AuthProvider>
  )
}