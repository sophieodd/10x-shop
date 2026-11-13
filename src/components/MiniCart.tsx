import { Link, useLocation } from 'react-router'
import { useCart } from '../context/cart'
import {
  formatPrice,
  getCartTotals,
  getDiscountedUnitPriceCents,
} from '../utils/cartPricing'

export default function MiniCart() {
  const { items } = useCart()
  const { pathname } = useLocation()

  if (/^\/cart\/?$/i.test(pathname)) return null

  const { subtotal } = getCartTotals(items, null)

  return (
    <div className="invisible absolute right-0 top-full z-40 w-[min(18rem,calc(100vw-3rem))] pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <section
        aria-label="Cart preview"
        className="bg-[var(--color-surface)] p-4 text-[var(--color-ink)] shadow-xl"
      >
        <h2 className="font-[var(--font-display)] text-lg font-bold">
          Your cart
        </h2>

        {items.length === 0 ? (
          <p className="mt-3 text-sm">Your cart is empty.</p>
        ) : (
          <>
            <ul className="mt-3 max-h-60 space-y-3 overflow-y-auto">
              {items.map((item) => {
                const unitPrice = getDiscountedUnitPriceCents(
                  item.price,
                  item.discountPercentage,
                )

                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-12 w-12 shrink-0 object-contain"
                    />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">{item.title}</p>
                      <p>{item.quantity} × {formatPrice(unitPrice)}</p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 flex justify-between gap-3 text-sm font-bold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </>
        )}

        <Link
          to="/cart"
          className="mt-4 block bg-[var(--color-magenta)] px-4 py-2 text-center text-sm font-bold text-white hover:brightness-110"
        >
          View cart
        </Link>
      </section>
    </div>
  )
}