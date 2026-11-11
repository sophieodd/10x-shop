import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { useCart } from '../cart'
import { formatPrice, getCartTotals } from '../cartPricing'

const quantityButtonClass =
  'min-h-11 min-w-11 border border-[var(--color-border)] disabled:opacity-40'

const checkoutButtonClass =
  'mt-4 block w-full bg-[var(--color-magenta)] px-4 py-3 text-center font-bold text-white'

export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart, promoCode, setPromoCode } =
    useCart()
  const { state } = useLocation()

  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)

  const { subtotal, discount, shipping, total } = getCartTotals(items, promoCode)
  const checkoutMessage =
    typeof state?.checkoutMessage === 'string' ? state.checkoutMessage : null

  function applyPromo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (promoInput.trim().toUpperCase() !== '10X10') {
      setPromoError('Invalid promo code')
      return
    }

    setPromoCode('10X10')
    setPromoInput('')
    setPromoError('')
  }

  function handleRemove(id: number) {
    if (items.length === 1) setAcknowledged(false)
    removeItem(id)
  }

  function handleClear() {
    if (!window.confirm('Clear all items from your cart?')) return

    clearCart()
    setAcknowledged(false)
    setPromoInput('')
    setPromoError('')
  }

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)] sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-[var(--font-display)] text-4xl font-bold">
          Your cart
        </h1>

        {checkoutMessage && (
          <p role="status" className="mt-3 text-sm font-semibold">
            {checkoutMessage}
          </p>
        )}

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
                {items.map((item) => {
                  const unitPrice = Math.round(item.price * 100)

                  return (
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
                          {formatPrice(unitPrice)} each
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.title}`}
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              setQuantity(item.id, item.quantity - 1)
                            }
                            className={quantityButtonClass}
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
                            onClick={() =>
                              setQuantity(item.id, item.quantity + 1)
                            }
                            className={quantityButtonClass}
                          >
                            +
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            aria-label={`Remove ${item.title} from cart`}
                            className="min-h-11 px-2 text-sm underline hover:text-[var(--color-magenta)]"
                          >
                            Remove
                          </button>
                        </div>

                        <p className="mt-2 font-bold">
                          {formatPrice(unitPrice * item.quantity)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                onClick={handleClear}
                className="mt-4 min-h-11 text-sm underline hover:text-[var(--color-magenta)]"
              >
                Clear cart
              </button>
            </div>

            <aside className="bg-[var(--color-surface)] p-5">
              <h2 className="font-[var(--font-display)] text-xl font-bold">
                Order summary
              </h2>

              {promoCode ? (
                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <p role="status">Promo applied: {promoCode}</p>
                  <button
                    type="button"
                    onClick={() => setPromoCode(null)}
                    className="min-h-11 underline"
                  >
                    Remove promo
                  </button>
                </div>
              ) : (
                <form onSubmit={applyPromo} className="mt-4">
                  <label htmlFor="cart-promo" className="text-sm font-semibold">
                    Promo code
                  </label>

                  <div className="mt-2 flex gap-2">
                    <input
                      id="cart-promo"
                      value={promoInput}
                      onChange={(event) => {
                        setPromoInput(event.target.value)
                        setPromoError('')
                      }}
                      aria-invalid={Boolean(promoError)}
                      aria-describedby={promoError ? 'cart-promo-error' : undefined}
                      className="min-w-0 flex-1 border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-2"
                    />

                    <button
                      type="submit"
                      className="min-h-11 bg-[var(--color-blue)] px-4 text-sm font-semibold text-white"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <p
                      id="cart-promo-error"
                      role="alert"
                      className="mt-2 text-sm text-red-700"
                    >
                      {promoError}
                    </p>
                  )}
                </form>
              )}

              <dl className="mt-5 space-y-3">
                <div className="flex justify-between gap-4">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>

                {promoCode && (
                  <div className="flex justify-between gap-4">
                    <dt>Discount ({promoCode} −10%)</dt>
                    <dd>−{formatPrice(discount)}</dd>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
                </div>

                <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-3 font-bold">
                  <dt>Total</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => setAcknowledged(event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-magenta)]"
                />
                <span>
                  I acknowledge that I have questionable taste and wish to proceed.
                </span>
              </label>

              {acknowledged ? (
                <Link
                  to="/checkout"
                  state={{ acknowledgedTaste: true }}
                  className={`${checkoutButtonClass} hover:brightness-110`}
                >
                  Proceed to checkout
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`${checkoutButtonClass} cursor-not-allowed opacity-50`}
                >
                  Proceed to checkout
                </button>
              )}
            </aside>
          </div>
        )}

        <section
          aria-labelledby="cart-banner-title"
          className="mt-12 bg-[var(--color-magenta)] px-6 py-10 text-center text-white sm:px-10 sm:py-14"
        >
          <h2
            id="cart-banner-title"
            className="font-[var(--font-display)] text-4xl font-black leading-none tracking-tight sm:text-6xl"
          >
            WE TAKE IT TOO PERSONALLY.
          </h2>

          <p className="mt-4 text-lg font-bold sm:text-2xl">
            Do not leave us with an abandoned cart.
          </p>

          <p className="mt-3 font-[var(--font-tech)] text-xs sm:text-sm">
            we've already named your shopping basket.
          </p>
        </section>
      </div>
    </main>
  )
}