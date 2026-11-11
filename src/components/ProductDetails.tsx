import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCart } from '../cart'

type ProductDetailsData = {
  id: number
  title: string
  description: string
  category: string
  price: number
  stock: number
  thumbnail: string
  images: string[]
}

function ProductDetails() {
  const { id } = useParams()
  const { items, addToCart } = useCart()

  const [product, setProduct] = useState<ProductDetailsData | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignoreResult = false

    async function loadProduct() {
      setIsLoading(true)
      setError(null)
      setProduct(null)
      setQuantity(1)

      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`)

        if (!response.ok) {
          throw new Error('Could not load this product')
        }

        const data: ProductDetailsData = await response.json()

        if (!ignoreResult) {
          setProduct(data)
        }
      } catch {
        if (!ignoreResult) {
          setError('This product glitched out or does not exist.')
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      void loadProduct()
    } else {
      setError('This product does not have a valid ID.')
      setIsLoading(false)
    }

    return () => {
      ignoreResult = true
    }
  }, [id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-page)] px-6 py-16">
        <p role="status">Loading product...</p>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[var(--color-page)] px-6 py-16">
        <p role="alert">{error ?? 'Product not found.'}</p>

        <Link
          to="/#catalog"
          className="mt-6 inline-block font-semibold text-[var(--color-blue)]"
        >
          ← Back to the catalog
        </Link>
      </main>
    )
  }

  const quantityInCart =
    items.find((item) => item.id === product.id)?.quantity ?? 0

  const remainingStock = Math.max(0, product.stock - quantityInCart)

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)] sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/#catalog"
          className="font-[var(--font-tech)] text-sm text-[var(--color-blue)]"
        >
          ← Back to the catalog
        </Link>

        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <div className="bg-[var(--color-surface)] p-6">
            <img
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              className="aspect-square w-full object-contain"
            />
          </div>

          <div>
            <p className="font-[var(--font-tech)] text-xs font-bold uppercase tracking-wider text-[var(--color-magenta)]">
              {product.category}
            </p>

            <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">
              {product.title}
            </h1>

            <p className="mt-5 leading-relaxed text-[var(--color-ink)]/70">
              {product.description}
            </p>

            <p className="mt-6 text-2xl font-bold">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-2 text-sm">
              {product.stock > 0
                ? `${product.stock} in stock`
                : 'Currently out of stock'}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="font-semibold">Quantity</span>

              <div className="flex items-center border border-[var(--color-border)]">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => current - 1)}
                  className="px-3 py-2 disabled:opacity-40"
                >
                  −
                </button>

                <span className="min-w-10 text-center" aria-live="polite">
                  {quantity}
                </span>

                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= remainingStock}
                  onClick={() => setQuantity((current) => current + 1)}
                  className="px-3 py-2 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={quantity > remainingStock}
              onClick={() => addToCart(product, quantity)}
              className="mt-4 bg-[var(--color-blue)] px-6 py-3 font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
            </button>

            {product.stock > 0 && quantity > remainingStock && (
              <p className="mt-2 text-sm">
                {remainingStock === 0
                  ? 'All available stock is already in your cart.'
                  : `You can add ${remainingStock} more. Choose a smaller quantity.`}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails