import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useCart } from '../cart'
import { useDebounce } from '../hooks/useDebounce'

type ProductCatalogProps = {
  eyebrow: string
  title: string
  description: string
}

type Product = {
  id: number
  title: string
  category: string
  price: number
  thumbnail: string
  stock: number
}

type ProductsResponse = {
  products: Product[]
}

type Category = {
  slug: string
  name: string
}

type SearchDraft = {
  locationKey: string
  value: string
}

type ProductResults =
  | { requestUrl: string; status: 'success'; products: Product[] }
  | { requestUrl: string; status: 'error' }

const productsEndpoint = 'https://dummyjson.com/products'

const priceOptions = [
  { value: '', label: 'Sort by price' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const categoryMessages: Record<string, string> = {
  beauty: 'Good coverage. Questionable coping mechanisms.',
  fragrances: 'Smells like you have your life together.',
  furniture: 'Emotionally unavailable. Structurally sound.',
  groceries: 'You came here for one thing. Sure.',
  'home-decoration': 'Your apartment has entered its personality era.',
  'kitchen-accessories': 'For the recipes you save and never make.',
  laptops: 'For the 47 tabs you absolutely need open.',
  'mens-shirts': 'Business casual. Emotionally out of office.',
  'mens-shoes': 'Walk away from your problems in style.',
  'mens-watches': 'Be late with precision.',
  'mobile-accessories': 'Your phone has a better support system than you do.',
  motorcycle: 'Two wheels. Zero plans to settle down.',
  'skin-care': 'A new routine for someone with commitment issues.',
  smartphones: 'For texting back in three to five business days.',
  'sports-accessories': 'For the workout you’re starting on Monday.',
  sunglasses: 'Avoid eye contact. Look incredible.',
  tablets: 'A bigger screen for the same bad decisions.',
  tops: 'An outfit change counts as a fresh start.',
  vehicle: 'For leaving dramatically.',
  'womens-bags': 'Carry everything. Process it later.',
  'womens-dresses': 'Dress for the plot twist.',
  'womens-jewellery': 'Shiny objects. Briefly stable emotions.',
  'womens-shoes': 'These shoes support your decisions. We have questions.',
  'womens-watches': 'Time heals everything. Apparently.',
}

function closeDropdown(dropdown: HTMLDetailsElement | null) {
  if (!dropdown) return

  dropdown.open = false
  dropdown.querySelector('summary')?.focus()
}

function ProductCatalog({ eyebrow, title, description }: ProductCatalogProps) {
  const { items, addToCart } = useCart()
  const { key: locationKey, pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryDropdown = useRef<HTMLDetailsElement>(null)
  const priceDropdown = useRef<HTMLDetailsElement>(null)

  const query = searchParams.get('q')?.trim() ?? ''
  const category = query ? '' : (searchParams.get('category') ?? '')
  const sort = searchParams.get('sort')
  const priceSort = sort === 'price-asc' || sort === 'price-desc' ? sort : ''
  const priceLabel =
    priceOptions.find((option) => option.value === priceSort)?.label ??
    'Sort by price'

  const [searchDraft, setSearchDraft] = useState<SearchDraft | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryError, setCategoryError] = useState(false)
  const [results, setResults] = useState<ProductResults | null>(null)

  const activeDraft =
    searchDraft?.locationKey === locationKey ? searchDraft : null
  const searchValue = activeDraft?.value ?? query
  const debouncedDraft = useDebounce(activeDraft, 400)

  useEffect(() => {
    function handleOutsidePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return

      for (const dropdown of [categoryDropdown.current, priceDropdown.current]) {
        if (dropdown?.open && !dropdown.contains(target)) {
          dropdown.open = false
        }
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
    }
  }, [])

  useEffect(() => {
    if (!activeDraft || debouncedDraft !== activeDraft) return

    const nextQuery = activeDraft.value.trim()
    if (nextQuery === query) return

    const params = new URLSearchParams(search)

    if (nextQuery) {
      params.set('q', nextQuery)
      params.delete('category')
    } else {
      params.delete('q')
    }

    params.delete('page')
    const nextSearch = params.toString()

    void navigate(
      { pathname, search: nextSearch ? `?${nextSearch}` : '', hash },
      { replace: Boolean(query) },
    )
  }, [activeDraft, debouncedDraft, hash, navigate, pathname, query, search])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategories() {
      try {
        const response = await fetch(`${productsEndpoint}/categories`, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Could not load categories')

        const data: Category[] = await response.json()
        if (!controller.signal.aborted) setCategories(data)
      } catch {
        if (!controller.signal.aborted) setCategoryError(true)
      }
    }

    void loadCategories()
    return () => controller.abort()
  }, [])

  const requestParams = new URLSearchParams({ limit: '12', skip: '0' })
  let endpoint = productsEndpoint

  if (query) {
    endpoint += '/search'
    requestParams.set('q', query)
  } else if (category) {
    endpoint += `/category/${encodeURIComponent(category)}`
  }

  if (priceSort) {
    requestParams.set('sortBy', 'price')
    requestParams.set('order', priceSort === 'price-asc' ? 'asc' : 'desc')
  }

  const requestUrl = `${endpoint}?${requestParams.toString()}`

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal,
        })

        if (!response.ok) throw new Error('Could not load products')

        const data: ProductsResponse = await response.json()

        if (!controller.signal.aborted) {
          setResults({ requestUrl, status: 'success', products: data.products })
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults({ requestUrl, status: 'error' })
        }
      }
    }

    void loadProducts()
    return () => controller.abort()
  }, [requestUrl])

  const currentResults = results?.requestUrl === requestUrl ? results : null
  const products =
    currentResults?.status === 'success' ? currentResults.products : []

  const selectedCategory = categories.find((option) => option.slug === category)
  const categoryLabel =
    selectedCategory?.name ?? (category.replace(/-/g, ' ') || 'All categories')

  let bannerMessage = 'Just browsing. That’s how it starts.'

  if (query) {
    bannerMessage = `Searching for “${query}”. Very specific of you.`
  } else if (category) {
    bannerMessage =
      categoryMessages[category] ?? 'A very specific kind of bad decision.'
  }

  function updateCatalogParams(params: URLSearchParams) {
    params.delete('page')
    const nextSearch = params.toString()

    void navigate({
      pathname,
      search: nextSearch ? `?${nextSearch}` : '',
      hash,
    })
  }

  function selectCategory(slug: string) {
    setSearchDraft(null)
    if (slug === category && !query) return

    const params = new URLSearchParams(search)

    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }

    params.delete('q')
    updateCatalogParams(params)
  }

  function selectPriceSort(value: string) {
    if (value === priceSort) return

    const params = new URLSearchParams(search)

    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }

    updateCatalogParams(params)
  }

  return (
    <section
      id="catalog"
      className="scroll-mt-24 bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)] sm:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-[var(--font-tech)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-magenta)]">
          {eyebrow}
        </p>

        <h2 className="mt-4 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">
          {title}
        </h2>

        <p className="mt-3 text-[var(--color-ink)]/70">{description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 font-[var(--font-display)] text-sm">
          {(categories.length > 0 || category || query) && (
            <details
              ref={categoryDropdown}
              className="relative w-fit max-w-full"
              onToggle={(event) => {
                if (event.currentTarget.open && priceDropdown.current) {
                  priceDropdown.current.open = false
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && event.currentTarget.open) {
                  event.preventDefault()
                  closeDropdown(event.currentTarget)
                }
              }}
            >
              <summary
                aria-label={`Filter by category. Selected: ${categoryLabel}`}
                className="flex min-h-11 min-w-44 cursor-pointer list-none items-center justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 [&::-webkit-details-marker]:hidden"
              >
                <span>{categoryLabel}</span>
                <span aria-hidden="true">▾</span>
              </summary>

              <ul className="absolute left-0 top-full z-20 mt-1 max-h-64 min-w-full overflow-y-auto border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                {[{ slug: '', name: 'All categories' }, ...categories].map(
                  ({ slug, name }) => (
                    <li key={slug}>
                      <button
                        type="button"
                        aria-pressed={!query && category === slug}
                        onClick={() => {
                          selectCategory(slug)
                          closeDropdown(categoryDropdown.current)
                        }}
                        className="block min-h-11 w-full px-4 py-2 text-left [font:inherit] hover:bg-[var(--color-page)] aria-pressed:text-[var(--color-magenta)]"
                      >
                        {name}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </details>
          )}

          <details
            ref={priceDropdown}
            className="relative w-fit max-w-full"
            onToggle={(event) => {
              if (event.currentTarget.open && categoryDropdown.current) {
                categoryDropdown.current.open = false
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && event.currentTarget.open) {
                event.preventDefault()
                closeDropdown(event.currentTarget)
              }
            }}
          >
            <summary
              aria-label={`Sort products by price. Selected: ${priceLabel}`}
              className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 [&::-webkit-details-marker]:hidden"
            >
              <span>{priceLabel}</span>
              <span aria-hidden="true">▾</span>
            </summary>

            <ul className="absolute left-0 top-full z-20 mt-1 min-w-full whitespace-nowrap border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              {priceOptions.map(({ value, label }) => (
                <li key={value}>
                  <button
                    type="button"
                    aria-pressed={priceSort === value}
                    onClick={() => {
                      selectPriceSort(value)
                      closeDropdown(priceDropdown.current)
                    }}
                    className="block min-h-11 w-full px-4 py-2 text-left [font:inherit] hover:bg-[var(--color-page)] aria-pressed:text-[var(--color-magenta)]"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </details>

          <div className="w-full md:ml-auto md:w-80">
            <label htmlFor="catalog-search" className="sr-only">
              Search products
            </label>

            <input
              id="catalog-search"
              type="search"
              value={searchValue}
              onChange={(event) =>
                setSearchDraft({ locationKey, value: event.target.value })
              }
              placeholder="Find your next temporary attachment…"
              className="min-h-11 w-full scroll-mt-24 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 [font:inherit] focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]"
            />
          </div>
        </div>

        {categoryError && (
          <p role="status" className="mt-3 text-sm">
            Categories couldn’t load.
          </p>
        )}

        <p
          aria-live="polite"
          className="mt-4 bg-[var(--color-lavender)] px-4 py-3 font-[var(--font-display)] text-sm font-normal text-[var(--color-ink)] sm:text-base"
        >
          {bannerMessage}
        </p>

        {!currentResults && (
          <p role="status" className="mt-8 font-[var(--font-tech)] text-sm">
            Loading questionable attachments...
          </p>
        )}

        {currentResults?.status === 'error' && (
          <p role="alert" className="mt-8 font-[var(--font-tech)] text-sm">
            The product feed glitched. Try again in a moment.
          </p>
        )}

        {currentResults?.status === 'success' && products.length === 0 && (
          <p className="mt-8">
            {query ? `No products found for “${query}”.` : 'No attachments found.'}
          </p>
        )}

        {products.length > 0 && (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const quantityInCart =
                items.find((item) => item.id === product.id)?.quantity ?? 0

              const isAdded = quantityInCart > 0
              const canAddMore = quantityInCart < product.stock

              let buttonText = '+ Add to Cart'

              if (isAdded) {
                buttonText = canAddMore ? 'Added to Cart · +1' : 'Added to Cart'
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