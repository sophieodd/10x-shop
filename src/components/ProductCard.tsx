import { Link } from 'react-router'
import { useCart, type CartProduct } from '../cart'
import { formatPrice, getDiscountedUnitPriceCents } from '../cartPricing'

export type CatalogProduct = CartProduct & {
  category: string
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
  const originalPrice = Math.round(product.price * 100)
  const salePrice = getDiscountedUnitPriceCents(
    product.price,
    product.discountPercentage,
  )

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

          <p className="mt-4 font-[var(--font-tech)] text-[10px] uppercase tracking-wider text-[var(--color-magenta)]">
            {product.category}
          </p>

          <h3 className="mt-2 font-semibold">{product.title}</h3>

          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-bold">{formatPrice(salePrice)}</span>

            {salePrice < originalPrice && (
              <s className="text-[var(--color-ink)]/60">
                <span className="sr-only">Original price: </span>
                {formatPrice(originalPrice)}
              </s>
            )}
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