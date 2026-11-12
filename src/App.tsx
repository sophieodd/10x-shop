import { Link, Route, Routes } from 'react-router'
import CartProvider from './CartProvider'
import { useCart } from './cart'
import AuthProvider from './AuthProvider'
import CartPage from './components/CartPage'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductCatalog from './components/ProductCatalog'
import ProductDetails from './components/ProductDetails'
import LoginPage from './components/LoginPage'
import CheckoutPage from './components/CheckoutPage'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

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

function CatalogPage() {
  return (
    <main>
      <ProductCatalog
        eyebrow="10X SHOP CASUALS"
        title="All your potential attachments."
        description="Browse, filter, overthink. Add to cart anyway."
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
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="*"
          element={
            <main className="min-h-screen bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)]">
              <h1 className="text-3xl font-bold">Page not found</h1>
              <p className="mt-3">
                The page you are looking for does not exist.
              </p>
              <Link
                to="/catalog"
                className="mt-5 inline-block text-[var(--color-blue)] underline"
              >
                Go to catalog
              </Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ShopLayout />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}