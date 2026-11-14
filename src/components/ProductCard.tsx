import { Link } from 'react-router'
import { useCart, type CartProduct } from '../context/cart'
import { formatPrice, getDiscountedUnitPriceCents } from '../utils/cartPricing'

export type CatalogProduct = CartProduct & {
  category: string
  brand?: string
  rating?: number
}

type ProductCardProps = {
  product: CatalogProduct
  catalogSearch: string
}

export default function ProductCard({
  product,
  catalogSearch,
}: ProductCardProps) {
  const { items, addToCart } = useCart()
  const quantityInCart =
    items.find((item) => item.id === product.id)?.quantity ?? 0

  const isAdded = quantityInCart > 0
  const canAddMore = quantityInCart < product.stock
  const discountPercentage = product.discountPercentage ?? 0
  const originalPrice = Math.round(product.price * 100)
  const salePrice = getDiscountedUnitPriceCents(
    product.price,
    discountPercentage,
  )
  const hasDiscount = salePrice < originalPrice

  let stockLabel = 'In stock'
  if (product.stock === 0) {
    stockLabel = 'Out of stock'
  } else if (product.stock <= 5) {
    stockLabel = `Only ${product.stock} left`
  }

  let buttonText = '+ Add to Cart'
  if (isAdded) {
    buttonText = canAddMore ? 'Added to Cart · +1' : 'Added to Cart'
  } else if (!canAddMore) {
    buttonText = 'Out of stock'
  }

  return (
    <li className="group relative">
      <Link
        to={`/products/${product.id}`}
        state={{ catalogSearch }}
        className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
      >
        <article className="h-full bg-[var(--color-surface)] p-4 transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02]">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="aspect-square w-full bg-[var(--color-page)] p-5 object-contain"
          />

          <p className="mt-4 font-[family-name:var(--font-tech)] text-[10px] uppercase tracking-wider text-[var(--color-magenta)]">
            {product.category}
            {product.brand && ` · ${product.brand}`}
          </p>

          <h3 className="mt-2 font-semibold">{product.title}</h3>

          {typeof product.rating === 'number' && (
            <p className="mt-1 text-sm font-semibold">
              <span aria-hidden="true" className="text-[var(--color-magenta)]">
                ★{' '}
              </span>
              {product.rating.toFixed(1)} out of 5
            </p>
          )}

          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
            <span className="font-bold">{formatPrice(salePrice)}</span>

            {hasDiscount && (
              <s className="text-[var(--color-ink)]/60">
                <span className="sr-only">Original price: </span>
                {formatPrice(originalPrice)}
              </s>
            )}

            {hasDiscount && discountPercentage >= 1 && (
              <span className="bg-[var(--color-lavender)] px-2 py-0.5 text-xs font-semibold">
                −{Math.round(discountPercentage)}%
              </span>
            )}
          </p>

          <p className="mt-2 text-sm font-medium text-[var(--color-ink)]/70">
            {stockLabel}
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
}