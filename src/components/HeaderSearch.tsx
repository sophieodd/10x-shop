import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type SearchProduct = {
  id: number
  title: string
  thumbnail: string
}

type SearchResult = {
  query: string
  products: SearchProduct[]
  error?: string
}

export default function HeaderSearch() {
  const [value, setValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const query = value.trim()

  useEffect(() => {
    if (!isOpen || query.length < 2) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query, limit: '5' })
        const response = await fetch(`https://dummyjson.com/products/search?${params}`, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Search failed')

        const { products }: { products: SearchProduct[] } = await response.json()
        if (!controller.signal.aborted) setResult({ query, products })
      } catch {
        if (!controller.signal.aborted) {
          setResult({ query, products: [], error: 'Search glitched. Try again.' })
        }
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [isOpen, query])

  const matches = result?.query === query ? result : null

  return (
    <div
      role="search"
      aria-label="Header product search"
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setIsOpen(false)
      }}
    >
      <input
        type="search"
        aria-label="Search products"
        placeholder="Search products"
        value={value}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setValue(event.target.value)
          setIsOpen(true)
        }}
        className="min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
      />

      {isOpen && query.length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {(!matches || matches.error || matches.products.length === 0) && (
            <p role="status" className="px-3 py-2 text-sm">
              {!matches ? 'Searching…' : matches.error ?? 'No products found.'}
            </p>
          )}

          {!!matches?.products.length && (
            <ul aria-label="Product matches">
              {matches.products.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    onClick={() => {
                      setIsOpen(false)
                      setValue('')
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-[var(--color-page)]"
                  >
                    <img src={product.thumbnail} alt="" className="size-8 object-contain" />
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}