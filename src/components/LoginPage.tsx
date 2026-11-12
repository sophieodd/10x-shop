import { useId, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth'

type LoginPageProps = {
  onSuccess?: () => void
}

type LoginErrors = {
  username?: string
  password?: string
}

const inputClassName =
  'mt-2 block w-full border border-[var(--color-border)] bg-[var(--color-page)] px-3 py-3 focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]'

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const formId = useId()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  const Container = onSuccess ? 'div' : 'main'
  const Heading = onSuccess ? 'h2' : 'h1'
  const usernameId = `${formId}-username`
  const passwordId = `${formId}-password`

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: LoginErrors = {}

    if (!username.trim()) {
      nextErrors.username = 'Username is required.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)

    if (nextErrors.username || nextErrors.password) {
      const invalidFieldId = nextErrors.username ? usernameId : passwordId
      document.getElementById(invalidFieldId)?.focus()
      return
    }

    login(username.trim())
    setPassword('')

    if (onSuccess) {
      onSuccess()
      return
    }

    if (location.state?.from === '/checkout') {
      navigate('/checkout', {
        replace: true,
        state: {
          acknowledgedTaste: location.state?.acknowledgedTaste === true,
        },
      })
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <Container
      className={
        onSuccess
          ? 'text-[var(--color-ink)]'
          : 'min-h-screen bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)]'
      }
    >
      <div className="mx-auto max-w-md bg-[var(--color-surface)] p-6 sm:p-8">
        <Heading className="font-[var(--font-display)] text-4xl font-bold">
          Log in
        </Heading>

        <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor={usernameId} className="text-sm font-semibold">
              Username
            </label>

            <input
              id={usernameId}
              name="username"
              autoComplete="username"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username ? `${usernameId}-error` : undefined
              }
              className={inputClassName}
            />

            {errors.username && (
              <p
                id={`${usernameId}-error`}
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={passwordId} className="text-sm font-semibold">
              Password
            </label>

            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? `${passwordId}-error` : undefined
              }
              className={inputClassName}
            />

            {errors.password && (
              <p
                id={`${passwordId}-error`}
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="min-h-11 w-full bg-[var(--color-blue)] px-5 py-3 font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
          >
            Log in
          </button>
        </form>

        {!onSuccess && (
          <Link
            to="/#catalog"
            className="mt-5 inline-flex min-h-11 items-center text-sm text-[var(--color-blue)] underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
          >
            ← Back to catalog
          </Link>
        )}

        <button
          type="button"
          disabled
          className="mt-5 min-h-11 w-full cursor-not-allowed border-t border-[var(--color-border)] pt-4 text-sm font-semibold opacity-60"
        >
          Log in as administrator
        </button>
      </div>
    </Container>
  )
}