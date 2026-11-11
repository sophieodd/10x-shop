import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth'
import { useCart } from '../cart'
import { formatPrice, getCartTotals } from '../cartPricing'

const fields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'email', label: 'Email', autoComplete: 'email' },
  { name: 'address', label: 'Address', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
] as const

type FieldName = (typeof fields)[number]['name']
type CheckoutErrors = Partial<Record<FieldName, string>>

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items, promoCode, clearCart } = useCart()
  const { state } = useLocation()
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null)

  if (confirmedTotal !== null) {
    return (
      <main className="mx-auto max-w-xl px-6 py-12">
        <h1 className="font-[var(--font-display)] text-3xl font-bold">
          Thank you! Your order has been placed.
        </h1>
        <p className="mt-3">Order total: {formatPrice(confirmedTotal)}</p>
        <Link to="/#catalog" className="mt-5 inline-block underline">
          Back to the shop
        </Link>
      </main>
    )
  }

  if (items.length === 0 || state?.acknowledgedTaste !== true) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{
          checkoutMessage: items.length === 0
            ? 'Add an item before checking out.'
            : 'Check the acknowledgment box to continue.',
        }}
      />
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: '/checkout', acknowledgedTaste: true }}
      />
    )
  }

  const totals = getCartTotals(items, promoCode)

  return (
    <CheckoutForm
      totals={totals}
      onPlaceOrder={() => {
        setConfirmedTotal(totals.total)
        clearCart()
      }}
    />
  )
}

type CheckoutFormProps = {
  totals: ReturnType<typeof getCartTotals>
  onPlaceOrder: () => void
}

function CheckoutForm({ totals, onPlaceOrder }: CheckoutFormProps) {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState<CheckoutErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: CheckoutErrors = {}

    if (values.fullName.trim().length < 3) {
      nextErrors.fullName = 'Full name must be at least 3 characters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (values.address.trim().length < 5) {
      nextErrors.address = 'Address must be at least 5 characters.'
    }
    if (!values.city.trim()) {
      nextErrors.city = 'City is required.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      onPlaceOrder()
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-[var(--color-ink)]">
      <h1 className="font-[var(--font-display)] text-4xl font-bold">
        Checkout
      </h1>

      <div className="mt-6 grid items-start gap-6 md:grid-cols-[2fr_1fr]">
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, autoComplete }) => (
            <div key={name}>
              <label htmlFor={`checkout-${name}`} className="text-sm font-bold">
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
                  setValues({ ...values, [name]: event.target.value })
                }
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
                className="mt-1 block w-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
              />
              {errors[name] && (
                <p id={`checkout-${name}-error`} role="alert" className="mt-1 text-sm text-red-700">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="bg-[var(--color-magenta)] px-6 py-3 font-bold text-white hover:brightness-110"
          >
            Place order
          </button>
        </form>

        <aside className="space-y-2 bg-[var(--color-surface)] p-5">
          <h2 className="text-xl font-bold">Order summary</h2>
          <p>Subtotal: {formatPrice(totals.subtotal)}</p>
          {totals.discount > 0 && (
            <p>Discount: −{formatPrice(totals.discount)}</p>
          )}
          <p>Shipping: {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</p>
          <p className="font-bold">Total: {formatPrice(totals.total)}</p>
        </aside>
      </div>
    </main>
  )
}