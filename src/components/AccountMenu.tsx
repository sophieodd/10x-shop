import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/auth'
import LoginPage from './LoginPage'

export default function AccountMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dialog = useRef<HTMLDialogElement>(null)
  const [loginFormKey, setLoginFormKey] = useState(0)

  function closeDialog() {
    dialog.current?.close()
  }

  function handleLogout() {
    closeDialog()
    logout()
    navigate('/')
  }

  return (
    <>
      <button
        type="button"
        aria-label={user ? 'Open account menu' : 'Log in'}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className={`grid h-11 w-11 shrink-0 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)] ${
          user
            ? 'text-[var(--color-magenta)]'
            : 'text-[var(--color-ink)] hover:text-[var(--color-magenta)]'
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill={user ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c.4-3.5 3.1-5.5 7-5.5s6.6 2 7 5.5H5Z" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-label={user ? 'Your account' : 'Log in'}
        onClose={() => setLoginFormKey((current) => current + 1)}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%_-_2rem)] max-w-sm overflow-y-auto bg-[var(--color-surface)] p-0 text-[var(--color-ink)] shadow-xl backdrop:bg-black/40"
      >
        <button
          type="button"
          aria-label="Close account dialog"
          onClick={closeDialog}
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center text-2xl hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-[var(--color-blue)]"
        >
          ×
        </button>

        {user ? (
          <div className="p-6 pr-14">
            <h2 className="font-[var(--font-display)] text-2xl font-bold">
              Your account
            </h2>

            <p className="mt-2 break-words">
              Signed in as {user.username}
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 min-h-11 font-semibold text-[var(--color-magenta)] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]"
            >
              Log out
            </button>
          </div>
        ) : (
          <LoginPage key={loginFormKey} onSuccess={closeDialog} />
        )}
      </dialog>
    </>
  )
}