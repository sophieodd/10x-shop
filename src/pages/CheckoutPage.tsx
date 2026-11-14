import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/auth'
import { useCart } from '../context/cart'
import { formatPrice, getCartTotals } from '../utils/cartPricing'

const fields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email', autoComplete: 'email' },
  { name: 'address', label: 'Address', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
] as const

type FieldName = (typeof fields)[number]['name']
type CheckoutValues = Record<FieldName, string>
type CheckoutErrors = Partial<Record<FieldName, string>>

type OrderConfirmation = {
  total: number
  shipping: CheckoutValues
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const {
    items,
    promoCode,
    clearCart,
    acknowledgedTaste,
    setAcknowledgedTaste,
  } = useCart()
  const [confirmation, setConfirmation] =
    useState<OrderConfirmation | null>(null)

  if (confirmation) {
    return (
      <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)]">
        <div className="mx-auto max-w-xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            Thank you! Your order has been placed.
          </h1>

          <p className="mt-4">
            Thank you, {confirmation.shipping.fullName}.
          </p>
          <p className="mt-2">
            Delivery to {confirmation.shipping.address},{' '}
            {confirmation.shipping.city}.
          </p>
          <p className="mt-3 font-semibold">
            Order total: {formatPrice(confirmation.total)}
          </p>

          <Link
            to="/catalog"
            className="mt-5 inline-block text-[var(--color-blue)] underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Back to the shop
          </Link>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: '/checkout' }}
      />
    )
  }

  if (items.length === 0) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{ checkoutMessage: 'Add an item before checking out.' }}
      />
    )
  }

  if (!acknowledgedTaste) {
    return (
      <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)]">
        <div className="mx-auto max-w-xl bg-[var(--color-surface)] p-6 sm:p-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            One quick acknowledgment
          </h1>

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={acknowledgedTaste}
              onChange={(event) =>
                setAcknowledgedTaste(event.target.checked)
              }
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-magenta)]"
            />
            <span>
              I acknowledge that I have questionable taste and wish to proceed.
            </span>
          </label>

          <Link
            to="/cart"
            className="mt-6 inline-block font-semibold text-[var(--color-blue)] underline"
          >
            Back to cart
          </Link>
        </div>
      </main>
    )
  }

  const totals = getCartTotals(items, promoCode)

  return (
    <CheckoutForm
      totals={totals}
      onPlaceOrder={(shipping) => {
        setConfirmation({ total: totals.total, shipping })
        clearCart()
      }}
    />
  )
}

type CheckoutFormProps = {
  totals: ReturnType<typeof getCartTotals>
  onPlaceOrder: (values: CheckoutValues) => void
}

function CheckoutForm({ totals, onPlaceOrder }: CheckoutFormProps) {
  const [values, setValues] = useState<CheckoutValues>({
    fullName: '',
    email: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittedRef = useRef(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittedRef.current) return

    const trimmedValues: CheckoutValues = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
    }
    const nextErrors: CheckoutErrors = {}

    if (trimmedValues.fullName.length < 3) {
      nextErrors.fullName = 'Full name must be at least 3 characters'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValues.email)) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (trimmedValues.address.length < 5) {
      nextErrors.address = 'Address must be at least 5 characters'
    }
    if (!trimmedValues.city) {
      nextErrors.city = 'City is required'
    }

    setErrors(nextErrors)

    const firstInvalidField = fields.find(({ name }) => nextErrors[name])
    if (firstInvalidField) {
      document.getElementById(`checkout-${firstInvalidField.name}`)?.focus()
      return
    }

    submittedRef.current = true
    setIsSubmitting(true)
    onPlaceOrder(trimmedValues)
  }

  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)]">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold">
          Checkout
        </h1>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-[2fr_1fr]">
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, autoComplete }) => (
              <div key={name}>
                <label
                  htmlFor={`checkout-${name}`}
                  className="text-sm font-semibold"
                >
                  {label}
                </label>

                <input
                  id={`checkout-${name}`}
                  name={name}
                  type={name === 'email' ? 'email' : 'text'}
                  autoComplete={autoComplete}
                  required
                  value={values[name]}
                  onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  aria-invalid={Boolean(errors[name])}
                  aria-describedby={
                    errors[name] ? `checkout-${name}-error` : undefined
                  }
                  className="mt-1 block w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]"
                />

                {errors[name] && (
                  <p
                    id={`checkout-${name}-error`}
                    role="alert"
                    className="mt-1 text-sm text-red-700 dark:text-red-300"
                  >
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-11 bg-[var(--color-magenta)] px-6 py-3 font-bold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)] disabled:cursor-wait disabled:opacity-50"
            >
              {isSubmitting ? 'Placing order…' : 'Place order'}
            </button>
          </form>

          <aside className="bg-[var(--color-surface)] p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3">
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between gap-4">
                  <dt>Discount</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <dt>Shipping</dt>
                <dd>
                  {totals.shipping === 0
                    ? 'Free'
                    : formatPrice(totals.shipping)}
                </dd>
              </div>

              <div className="flex justify-between gap-4 border-t border-[var(--color-border)] pt-3 font-bold">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  )
}