import { Route, Routes } from 'react-router'
import CartProvider from './context/CartProvider'
import { useCart } from './context/cart'
import AuthProvider from './context/AuthProvider'
import CartPage from './pages/CartPage'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductCatalog from './components/ProductCatalog'
import LoginPage from './components/LoginPage'
import ProductDetails from './pages/ProductDetails'
import CheckoutPage from './pages/CheckoutPage'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import NotFoundPage from './pages/NotFoundPage'
import FinePrintPage from './pages/FinePrintPage'
import AboutPage from './pages/AboutPage'

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
        <Route path="/fine-print" element={<FinePrintPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
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