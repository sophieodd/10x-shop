import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { useCart } from '../cart'
import { formatPrice, getDiscountedUnitPriceCents } from '../cartPricing'
import NotFoundPage from './NotFoundPage'

type ProductReview = {
  rating: number
  comment: string
  date: string
  reviewerName: string
}

type ProductDetailsData = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage?: number
  stock: number
  thumbnail: string
  images: string[]
  reviews?: ProductReview[]
}

type ProductResult =
  | { status: 'success'; product: ProductDetailsData }
  | { status: 'not-found' }
  | { status: 'error'; message: string }

const minimumLoadingTime = 500

function useCatalogReturnLink() {
  const { state } = useLocation()
  const catalogSearch: unknown = state?.catalogSearch

  return {
    pathname: '/catalog',
    search:
      typeof catalogSearch === 'string' && catalogSearch.startsWith('?')
        ? catalogSearch
        : '',
    hash: '',
  }
}

function ProductSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <p
          role="status"
          className="font-[var(--font-tech)] text-sm font-semibold text-[var(--color-magenta)]"
        >
          Loading your potential attachment...
        </p>

        <div aria-hidden="true" className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="aspect-square bg-[var(--color-lavender)]" />

          <div className="space-y-4">
            <div className="h-4 w-1/4 bg-[var(--color-lavender)]" />
            <div className="h-10 w-3/4 bg-[var(--color-lavender)]" />
            <div className="h-4 w-full bg-[var(--color-lavender)]" />
            <div className="h-4 w-2/3 bg-[var(--color-lavender)]" />
            <div className="mt-6 h-8 w-1/4 bg-[var(--color-lavender)]" />
          </div>
        </div>
      </div>
    </main>
  )
}

function ProductError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  const catalogReturnLink = useCatalogReturnLink()

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)]">
      <h1 className="text-3xl font-bold">Couldn’t load this product</h1>

      <p className="mt-3" role="alert">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 bg-[var(--color-magenta)] px-4 py-2 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
        >
          Retry
        </button>

        <Link
          to={catalogReturnLink}
          className="font-semibold text-[var(--color-blue)] underline"
        >
          ← Back to the catalog
        </Link>
      </div>
    </main>
  )
}

function CustomerReviews({ reviews }: { reviews: ProductReview[] }) {
  return (
    <section
      aria-labelledby="product-reviews-title"
      className="mt-12 border-t border-[var(--color-border)] pt-8"
    >
      <h2
        id="product-reviews-title"
        className="font-[var(--font-display)] text-3xl font-bold"
      >
        Customer reviews <span className="text-lg">({reviews.length})</span>
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-4">No reviews yet.</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li
              key={`${review.reviewerName}-${review.date}-${index}`}
              className="bg-[var(--color-surface)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{review.reviewerName}</p>
                <p className="text-sm font-semibold text-[var(--color-magenta)]">
                  <span aria-hidden="true">★ </span>
                  {review.rating} out of 5
                </p>
              </div>

              <p className="mt-2 text-sm text-[var(--color-ink)]/70">
                <time dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString()}
                </time>
              </p>

              <p className="mt-3">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ProductDetailsContent({ id }: { id: number }) {
  const catalogReturnLink = useCatalogReturnLink()
  const { items, addToCart } = useCart()
  const [result, setResult] = useState<ProductResult | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = performance.now()
    let displayTimer: number | undefined

    async function loadProduct() {
      let nextResult: ProductResult

      try {
        const response = await fetch(`https://dummyjson.com/products/${id}`, {
          signal: controller.signal,
        })

        if (response.status === 404) {
          nextResult = { status: 'not-found' }
        } else {
          if (!response.ok) throw new Error('Could not load this product')

          const product: ProductDetailsData = await response.json()
          nextResult = { status: 'success', product }
        }
      } catch {
        nextResult = {
          status: 'error',
          message: 'This product glitched out. Please try again.',
        }
      }

      if (controller.signal.aborted) return

      const remainingTime =
        minimumLoadingTime - (performance.now() - startedAt)

      if (remainingTime <= 0) {
        setResult(nextResult)
        return
      }

      displayTimer = window.setTimeout(() => {
        setResult(nextResult)
      }, remainingTime)
    }

    void loadProduct()

    return () => {
      controller.abort()
      window.clearTimeout(displayTimer)
    }
  }, [id, retryCount])

  if (!result) return <ProductSkeleton />

  if (result.status === 'not-found') {
    return (
      <NotFoundPage
        message="This product could not be found."
        catalogLink={catalogReturnLink}
      />
    )
  }

  if (result.status === 'error') {
    return (
      <ProductError
        message={result.message}
        onRetry={() => {
          setResult(null)
          setRetryCount((count) => count + 1)
        }}
      />
    )
  }

  const { product } = result
  const originalPrice = Math.round(product.price * 100)
  const salePrice = getDiscountedUnitPriceCents(
    product.price,
    product.discountPercentage,
  )
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const quantityInCart =
    items.find((item) => item.id === product.id)?.quantity ?? 0
  const remainingStock = Math.max(0, product.stock - quantityInCart)

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)] sm:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          to={catalogReturnLink}
          className="font-[var(--font-tech)] text-sm text-[var(--color-blue)]"
        >
          ← Back to the catalog
        </Link>

        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <div className="bg-[var(--color-surface)] p-6">
            <img
              src={images[selectedImageIndex] ?? product.thumbnail}
              alt={`${product.title}, view ${selectedImageIndex + 1}`}
              className="aspect-square w-full object-contain"
            />

            {images.length > 1 && (
              <ul aria-label="Product photos" className="mt-4 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <li key={`${image}-${index}`}>
                    <button
                      type="button"
                      aria-label={`Show photo ${index + 1} of ${product.title}`}
                      aria-pressed={selectedImageIndex === index}
                      onClick={() => setSelectedImageIndex(index)}
                      className="block h-16 w-16 border border-[var(--color-border)] p-1 aria-pressed:border-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]"
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
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

            <p className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold">{formatPrice(salePrice)}</span>

              {salePrice < originalPrice && (
                <s className="text-sm text-[var(--color-ink)]/60">
                  <span className="sr-only">Original price: </span>
                  {formatPrice(originalPrice)}
                </s>
              )}
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

        <CustomerReviews reviews={product.reviews ?? []} />
      </div>
    </main>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const catalogReturnLink = useCatalogReturnLink()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  const productId = Number(id)

  if (
    !id ||
    !/^\d+$/.test(id) ||
    !Number.isSafeInteger(productId) ||
    productId < 1
  ) {
    return (
      <NotFoundPage
        message="This product link has an invalid ID."
        catalogLink={catalogReturnLink}
      />
    )
  }

  return <ProductDetailsContent key={productId} id={productId} />
}