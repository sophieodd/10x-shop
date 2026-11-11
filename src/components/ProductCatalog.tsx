import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '../cart'

type ProductCatalogProps = {
  eyebrow: string
  title: string
  description: string
}

type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  thumbnail: string
  stock: number
}

type ProductsResponse = {
  products: Product[]
}

function ProductCatalog({
  eyebrow,
  title,
  description,
}: ProductCatalogProps) {
  const { items, addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('')

  useEffect(() => {
    let ignoreResult = false

    async function loadProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products?limit=12')

        if (!response.ok) {
          throw new Error('Could not load products')
        }

        const data: ProductsResponse = await response.json()

        if (!ignoreResult) {
          setProducts(data.products)
        }
      } catch {
        if (!ignoreResult) {
          setError('The product feed glitched. Try again in a moment.')
        }
      } finally {
        if (!ignoreResult) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => {
      ignoreResult = true
    }
  }, [])

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].sort()

  const visibleProducts = category
    ? products.filter((product) => product.category === category)
    : products

  return (
    <section
      id="catalog"
      className="bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)] sm:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-[var(--font-tech)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-magenta)]">
          {eyebrow}
        </p>

        <h2 className="mt-4 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">
          {title}
        </h2>

        <p className="mt-3 text-[var(--color-ink)]/70">{description}</p>

        {categories.length > 0 && (
          <details className="relative mt-6 w-fit text-sm font-[var(--font-display)]">
            <summary
              aria-label={`Filter by category. Selected: ${category.replace(/-/g, ' ') || 'All categories'}`}
              className="flex min-w-44 cursor-pointer list-none items-center justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 [&::-webkit-details-marker]:hidden"
            >
              <span>{category.replace(/-/g, ' ') || 'All categories'}</span>
              <span aria-hidden="true">▾</span>
            </summary>

            <ul className="absolute left-0 top-full z-20 mt-1 w-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              {['', ...categories].map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={category === name}
                    onClick={(event) => {
                      setCategory(name)
                      const dropdown = event.currentTarget.closest('details')
                      dropdown?.removeAttribute('open')
                      dropdown?.querySelector('summary')?.focus()
                    }}
                    className="block w-full px-4 py-2 text-left [font:inherit] hover:bg-[var(--color-page)] aria-pressed:text-[var(--color-magenta)]"
                  >
                    {name.replace(/-/g, ' ') || 'All categories'}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        )}

        {isLoading && (
          <p role="status" className="mt-8 font-[var(--font-tech)] text-sm">
            Loading questionable attachments...
          </p>
        )}

        {error && (
          <p role="alert" className="mt-8 font-[var(--font-tech)] text-sm">
            {error}
          </p>
        )}

        {!isLoading && !error && visibleProducts.length === 0 && (
          <p className="mt-8">No attachments found. Try again later.</p>
        )}

        {!isLoading && !error && visibleProducts.length > 0 && (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => {
              const quantityInCart =
                items.find((item) => item.id === product.id)?.quantity ?? 0

              const isAdded = quantityInCart > 0
              const canAddMore = quantityInCart < product.stock

              let buttonText = '+ Add to Cart'

              if (isAdded) {
                buttonText = canAddMore
                  ? 'Added to Cart · +1'
                  : 'Added to Cart'
              } else if (!canAddMore) {
                buttonText = 'Out of stock'
              }

              return (
                <li key={product.id} className="group relative">
                  <Link
                    to={`/products/${product.id}`}
                    className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
                  >
                    <article className="h-full bg-[var(--color-surface)] p-4 transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02]">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="aspect-square w-full bg-[var(--color-page)] p-5 object-contain"
                      />

                      <p className="mt-4 font-[var(--font-tech)] text-[10px] uppercase tracking-wider text-[var(--color-magenta)]">
                        {product.category}
                      </p>

                      <h3 className="mt-2 font-semibold">{product.title}</h3>

                      <p className="mt-2 text-sm font-bold">
                        ${product.price.toFixed(2)}
                      </p>
                    </article>
                  </Link>

                  <button
                    type="button"
                    disabled={!canAddMore}
                    onClick={() => addToCart(product, 1)}
                    className={`absolute right-6 top-6 z-10 px-3 py-2 text-sm font-semibold text-white transition-colors enabled:hover:brightness-110 disabled:cursor-default ${
                      isAdded
                        ? 'bg-[var(--color-magenta)]'
                        : 'bg-[var(--color-blue)] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100'
                    }`}
                  >
                    {buttonText}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

export default ProductCatalog