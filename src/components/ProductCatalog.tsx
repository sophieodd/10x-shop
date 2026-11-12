import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { getDiscountedUnitPriceCents } from '../cartPricing'
import { useDebounce } from '../hooks/useDebounce'
import type { CatalogProduct } from './ProductCard'
import ProductGrid from './ProductGrid'

type ProductCatalogProps = {
  eyebrow: string
  title: string
  description: string
}

type ProductsResponse = {
  products: CatalogProduct[]
  total: number
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
  | { requestUrl: string; status: 'success'; data: ProductsResponse }
  | { requestUrl: string; status: 'error' }

type FilterOption = {
  value: string
  label: string
}

type SortOption = FilterOption & {
  sortBy?: 'price' | 'rating' | 'title'
  order?: 'asc' | 'desc'
}

const productsEndpoint = 'https://dummyjson.com/products'
const pageSize = 12
const defaultSort: SortOption = { value: '', label: 'Default sort' }

const sortOptions: SortOption[] = [
  defaultSort,
  { value: 'price-asc', label: 'Price: low to high', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Price: high to low', sortBy: 'price', order: 'desc' },
  { value: 'rating-desc', label: 'Rating: high to low', sortBy: 'rating', order: 'desc' },
  { value: 'title-asc', label: 'Name: A–Z', sortBy: 'title', order: 'asc' },
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

type FilterDropdownProps = {
  label: string
  selectedLabel: string
  value: string | null
  options: FilterOption[]
  onSelect: (value: string) => void
}

function FilterDropdown({
  label,
  selectedLabel,
  value,
  options,
  onSelect,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  function closeAndFocusTrigger() {
    const dropdown = dropdownRef.current
    if (!dropdown) return

    dropdown.open = false
    dropdown.querySelector('summary')?.focus()
  }

  useEffect(() => {
    function handleOutsidePointerDown(event: PointerEvent) {
      const dropdown = dropdownRef.current
      const target = event.target

      if (dropdown?.open && target instanceof Node && !dropdown.contains(target)) {
        dropdown.open = false
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown, true)
    }
  }, [])

  return (
    <details
      ref={dropdownRef}
      name="catalog-filters"
      className="relative w-fit max-w-full"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && event.currentTarget.open) {
          event.preventDefault()
          closeAndFocusTrigger()
        }
      }}
    >
      <summary
        aria-label={`${label}. Selected: ${selectedLabel}`}
        className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 focus-visible:outline-2 focus-visible:outline-[var(--color-blue)] [&::-webkit-details-marker]:hidden"
      >
        <span>{selectedLabel}</span>
        <span aria-hidden="true">▾</span>
      </summary>

      <ul className="absolute left-0 top-full z-20 mt-1 max-h-64 min-w-full overflow-y-auto border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        {options.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              aria-pressed={value === option.value}
              onClick={() => {
                onSelect(option.value)
                closeAndFocusTrigger()
              }}
              className="block min-h-11 w-full px-4 py-2 text-left [font:inherit] hover:bg-[var(--color-page)] aria-pressed:text-[var(--color-magenta)]"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}

function parsePriceCents(value: string | null): number | null {
  const price = value?.trim() ?? ''

  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(price)) {
    return null
  }

  const cents = Math.round(Number(price) * 100)
  return Number.isSafeInteger(cents) ? cents : null
}

type PriceFiltersProps = {
  minPrice: number | null
  maxPrice: number | null
  onApply: (minimum: number | null, maximum: number | null) => void
}

function PriceFilters({ minPrice, maxPrice, onApply }: PriceFiltersProps) {
  const [error, setError] = useState('')
  const hasPriceFilter = minPrice !== null || maxPrice !== null
  const fieldClass =
    'flex h-11 w-32 max-w-full items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[var(--color-blue)] sm:w-36'
  const inputClass = 'h-full min-w-0 flex-1 bg-transparent text-sm outline-none'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fields = new FormData(event.currentTarget)
    const min = String(fields.get('minPrice') ?? '').trim()
    const max = String(fields.get('maxPrice') ?? '').trim()
    const minimum = parsePriceCents(min)
    const maximum = parsePriceCents(max)

    if ((min !== '' && minimum === null) || (max !== '' && maximum === null)) {
      setError('Enter a valid price with up to two decimal places.')
      return
    }

    if (minimum !== null && maximum !== null && minimum > maximum) {
      setError('The maximum price must be at least the minimum price.')
      return
    }

    setError('')
    onApply(minimum, maximum)
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={() => setError('')}
      noValidate
      className="max-w-full"
    >
      <fieldset className="min-w-0">
        <legend className="sr-only">Price range</legend>

        <div className="flex flex-wrap items-center gap-2">
          <label className={fieldClass}>
            <span className="shrink-0 text-sm">Min $</span>
            <input
              type="text"
              name="minPrice"
              inputMode="decimal"
              defaultValue={minPrice === null ? '' : (minPrice / 100).toFixed(2)}
              className={inputClass}
            />
          </label>

          <label className={fieldClass}>
            <span className="shrink-0 text-sm">Max $</span>
            <input
              type="text"
              name="maxPrice"
              inputMode="decimal"
              defaultValue={maxPrice === null ? '' : (maxPrice / 100).toFixed(2)}
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            className="min-h-11 bg-[var(--color-blue)] px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
          >
            Apply
          </button>

          {hasPriceFilter && (
            <button
              type="button"
              onClick={() => onApply(null, null)}
              className="min-h-11 px-2 text-sm underline focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]"
            >
              Clear price
            </button>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </fieldset>
    </form>
  )
}

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const buttonClass =
    'min-h-11 min-w-11 border border-[var(--color-border)] px-3 text-sm focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]'

  return (
    <nav aria-label="Catalog pages" className="mt-8 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${buttonClass} disabled:opacity-40`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
            onClick={() => onPageChange(pageNumber)}
            className={`${buttonClass} ${
              pageNumber === page
                ? 'bg-[var(--color-magenta)] font-semibold text-white'
                : 'bg-[var(--color-surface)]'
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${buttonClass} disabled:opacity-40`}
      >
        Next
      </button>
    </nav>
  )
}

function CatalogSkeleton() {
  return (
    <>
      <p
        role="status"
        className="mt-8 font-[var(--font-tech)] text-sm font-semibold text-[var(--color-magenta)]"
      >
        Loading questionable attachments...
      </p>

      <div
        aria-hidden="true"
        className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: pageSize }, (_, index) => (
          <div key={index} className="bg-[var(--color-surface)] p-4">
            <div className="aspect-square bg-[var(--color-lavender)]" />
            <div className="mt-4 h-3 w-1/3 bg-[var(--color-blue)]/40" />
            <div className="mt-2 h-4 w-2/3 bg-[var(--color-lavender)]" />
            <div className="mt-2 h-4 w-1/5 bg-[var(--color-lavender)]" />
          </div>
        ))}
      </div>
    </>
  )
}

export default function ProductCatalog({
  eyebrow,
  title,
  description,
}: ProductCatalogProps) {
  const { key: locationKey, pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const catalogRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const Heading = pathname === '/' ? 'h2' : 'h1'

  const query = searchParams.get('q')?.trim() ?? ''
  const category = query ? '' : (searchParams.get('category') ?? '')
  const sort = searchParams.get('sort') ?? ''
  const selectedSort =
    sortOptions.find((option) => option.value === sort) ?? defaultSort

  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0 &&
    Number.isSafeInteger((requestedPage - 1) * pageSize)
      ? requestedPage
      : 1
  const skip = (page - 1) * pageSize

  const minPrice = parsePriceCents(searchParams.get('minPrice'))
  const maxPrice = parsePriceCents(searchParams.get('maxPrice'))
  const hasPriceFilter = minPrice !== null || maxPrice !== null

  const [searchDraft, setSearchDraft] = useState<SearchDraft | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryError, setCategoryError] = useState(false)
  const [results, setResults] = useState<ProductResults | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const activeDraft =
    searchDraft?.locationKey === locationKey ? searchDraft : null
  const searchValue = activeDraft?.value ?? query
  const debouncedDraft = useDebounce(activeDraft, 400)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const searchInput = searchInputRef.current

      if (document.activeElement === searchInput) return

      if (hash === '#catalog-search') {
        searchInput?.focus({ preventScroll: true })
        searchInput?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        })
        return
      }

      if (pathname === '/' && !search && !hash) {
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }

      catalogRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'instant',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash, locationKey, pathname, search])

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

  const requestParams = new URLSearchParams({
    limit: hasPriceFilter ? '0' : String(pageSize),
    skip: hasPriceFilter ? '0' : String(skip),
  })
  let endpoint = productsEndpoint

  if (query) {
    endpoint += '/search'
    requestParams.set('q', query)
  } else if (category) {
    endpoint += `/category/${encodeURIComponent(category)}`
  }

  if (selectedSort.sortBy && selectedSort.order) {
    requestParams.set('sortBy', selectedSort.sortBy)
    requestParams.set('order', selectedSort.order)
  }

  const requestUrl = `${endpoint}?${requestParams.toString()}`

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = performance.now()
    let displayTimer: number | undefined

    async function loadProducts() {
      let nextResults: ProductResults

      try {
        const response = await fetch(requestUrl, { signal: controller.signal })

        if (!response.ok) throw new Error('Could not load products')

        const data: ProductsResponse = await response.json()
        nextResults = { requestUrl, status: 'success', data }
      } catch {
        nextResults = { requestUrl, status: 'error' }
      }

      if (controller.signal.aborted) return

      const remainingTime = 500 - (performance.now() - startedAt)

      if (remainingTime <= 0) {
        setResults(nextResults)
        return
      }

      displayTimer = window.setTimeout(() => {
        setResults(nextResults)
      }, remainingTime)
    }

    void loadProducts()

    return () => {
      controller.abort()
      window.clearTimeout(displayTimer)
    }
  }, [requestUrl, retryCount])

  const currentResults = results?.requestUrl === requestUrl ? results : null
  const data = currentResults?.status === 'success' ? currentResults.data : null
  const fetchedProducts = data?.products ?? []

  const matchingProducts = hasPriceFilter
    ? fetchedProducts.filter((product) => {
        const price = getDiscountedUnitPriceCents(
          product.price,
          product.discountPercentage,
        )

        return (
          (minPrice === null || price >= minPrice) &&
          (maxPrice === null || price <= maxPrice)
        )
      })
    : fetchedProducts

  const products = hasPriceFilter
    ? matchingProducts.slice(skip, skip + pageSize)
    : matchingProducts
  const total = hasPriceFilter ? matchingProducts.length : (data?.total ?? 0)
  const totalPages = Math.ceil(total / pageSize)
  const pageIsOutOfRange = data !== null && total > 0 && page > totalPages

  const categoryLabel =
    categories.find((option) => option.slug === category)?.name ??
    (category.replace(/-/g, ' ') || 'All categories')

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map(({ slug, name }) => ({ value: slug, label: name })),
  ]

  let bannerMessage = 'Just browsing. That’s how it starts.'

  if (query) {
    bannerMessage = `Searching for “${query}”. Very specific of you.`
  } else if (category) {
    bannerMessage =
      categoryMessages[category] ?? 'A very specific kind of bad decision.'
  }

  function navigateToParams(params: URLSearchParams) {
    const nextSearch = params.toString()

    void navigate({
      pathname,
      search: nextSearch ? `?${nextSearch}` : '',
      hash: pathname === '/' ? '#catalog' : '',
    })
  }

  function updatePriceFilters(minimum: number | null, maximum: number | null) {
    const params = new URLSearchParams(search)
    const pendingQuery = activeDraft?.value.trim() ?? query

    if (pendingQuery !== query) {
      if (pendingQuery) {
        params.set('q', pendingQuery)
        params.delete('category')
      } else {
        params.delete('q')
      }

      setSearchDraft(null)
    }

    for (const [name, cents] of [
      ['minPrice', minimum],
      ['maxPrice', maximum],
    ] as const) {
      if (cents === null) {
        params.delete(name)
      } else {
        params.set(name, (cents / 100).toFixed(2))
      }
    }

    params.delete('page')
    navigateToParams(params)
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
    params.delete('page')
    navigateToParams(params)
  }

  function selectSort(value: string) {
    if (value === selectedSort.value) return

    const params = new URLSearchParams(search)

    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }

    params.delete('page')
    navigateToParams(params)
  }

  function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return

    const params = new URLSearchParams(search)

    if (nextPage === 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }

    navigateToParams(params)
  }

  function clearFilters() {
    setSearchDraft(null)
    navigateToParams(new URLSearchParams())
  }

  function retryProducts() {
    setResults(null)
    setRetryCount((count) => count + 1)
  }

  return (
    <section
      ref={catalogRef}
      id="catalog"
      className="scroll-mt-24 bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)] sm:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="font-[var(--font-tech)] text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-magenta)]">
          {eyebrow}
        </p>

        <Heading className="mt-4 font-[var(--font-display)] text-4xl font-bold sm:text-5xl">
          {title}
        </Heading>

        <p className="mt-3 text-[var(--color-ink)]/70">{description}</p>

        <div className="mt-6 flex flex-wrap items-start gap-3 font-[var(--font-display)] text-sm">
          {(categories.length > 0 || category || query) && (
            <FilterDropdown
              label="Filter by category"
              selectedLabel={categoryLabel}
              value={query ? null : category}
              options={categoryOptions}
              onSelect={selectCategory}
            />
          )}

          <FilterDropdown
            label="Sort products"
            selectedLabel={selectedSort.label}
            value={selectedSort.value}
            options={sortOptions}
            onSelect={selectSort}
          />

          <PriceFilters
            key={`${minPrice}:${maxPrice}`}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={updatePriceFilters}
          />

          <div className="w-full xl:min-w-56 xl:flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Search products
            </label>

            <input
              ref={searchInputRef}
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

        {!currentResults && <CatalogSkeleton />}

        {currentResults?.status === 'error' && (
          <div className="mt-8">
            <p role="alert" className="font-[var(--font-tech)] text-sm">
              The product feed glitched.
            </p>

            <button
              type="button"
              onClick={retryProducts}
              className="mt-3 min-h-11 bg-[var(--color-blue)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
            >
              Retry
            </button>
          </div>
        )}

        {pageIsOutOfRange && (
          <div className="mt-8">
            <p>This page is outside the current results.</p>

            <button
              type="button"
              onClick={() => goToPage(1)}
              className="min-h-11 font-semibold text-[var(--color-blue)] underline"
            >
              Back to page 1
            </button>
          </div>
        )}

        {data && total === 0 && (
          <div className="mt-8">
            <p>
              {hasPriceFilter
                ? 'No products match that price range.'
                : query
                  ? `No products found for “${query}”.`
                  : 'No attachments found.'}
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 min-h-11 font-semibold text-[var(--color-blue)] underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
            >
              Clear filters
            </button>
          </div>
        )}

        {products.length > 0 && (
          <>
            <p role="status" className="mt-6 text-sm">
              Showing {skip + 1}–{skip + products.length} of {total}
            </p>

            <ProductGrid products={products} catalogSearch={search} />
          </>
        )}

        {totalPages > 1 && !pageIsOutOfRange && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>
    </section>
  )
}