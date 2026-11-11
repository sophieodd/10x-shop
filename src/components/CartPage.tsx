import { Link } from 'react-router'
import { useCart } from '../cart'

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart } = useCart()
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)] sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-[var(--font-display)] text-4xl font-bold">
          Your cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-6">
            <p>Your cart is empty.</p>
            <Link
              to="/#catalog"
              className="mt-3 inline-block font-semibold text-[var(--color-blue)] underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 bg-[var(--color-surface)] p-4"
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
                    />

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.id}`}
                        className="font-semibold hover:underline"
                      >
                        {item.title}
                      </Link>

                      <p className="mt-1 text-sm">
                        ${item.price.toFixed(2)} each
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          disabled={item.quantity <= 1}
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="min-h-11 min-w-11 border border-[var(--color-border)] disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center" aria-live="polite">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          disabled={item.quantity >= item.stock}
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="min-h-11 min-w-11 border border-[var(--color-border)] disabled:opacity-40"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          aria-label={`Remove ${item.title} from cart`}
                          onClick={() => removeItem(item.id)}
                          className="min-h-11 px-2 text-sm underline hover:text-[var(--color-magenta)]"
                        >
                          Remove
                        </button>
                      </div>

                      <p className="mt-2 font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Clear all items from your cart?')) {
                    clearCart()
                  }
                }}
                className="mt-4 min-h-11 text-sm underline hover:text-[var(--color-magenta)]"
              >
                Clear cart
              </button>
            </div>

            <aside className="bg-[var(--color-surface)] p-5">
              <h2 className="font-[var(--font-display)] text-xl font-bold">
                Order summary
              </h2>

              <dl className="mt-4 space-y-3">
                <div className="flex justify-between gap-4">
                  <dt>Subtotal</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>

                <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-3 font-bold">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}