import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import AccountMenu from './AccountMenu'
import MiniCart from './MiniCart'

type HeaderProps = {
  cartCount: number
}

const controlClassName =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-ink)] hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]'

function navigationClassName({ isActive }: { isActive: boolean }) {
  return `inline-flex min-h-11 items-center px-2 text-sm hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)] ${
    isActive
      ? 'font-semibold text-[var(--color-magenta)]'
      : 'text-[var(--color-ink)]'
  }`
}

export default function Header({ cartCount }: HeaderProps) {
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [openLocationKey, setOpenLocationKey] = useState<string | null>(null)

  const menuIsOpen = openLocationKey === location.key

  useEffect(() => {
    if (!menuIsOpen) return

    function handleOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setOpenLocationKey(null)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenLocationKey(null)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuIsOpen])

  function closeMenu() {
    setOpenLocationKey(null)
  }

  return (
    <>
      <div className="bg-[var(--color-blue)] px-4 py-2 text-center font-[var(--font-tech)] text-[10px] font-bold uppercase tracking-[0.16em] text-white">
        Rebellious. Glitchy. Techy. Unapologetic.
      </div>

      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b-2 border-[var(--color-lavender)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-5 sm:py-4">
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="Ctrl+Me home"
            className="inline-flex min-h-11 shrink-0 items-center font-[var(--font-display)] text-2xl font-bold tracking-[-0.08em] text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]"
          >
            <span>
              CTRL<sup className="text-[0.55em]">+ME</sup>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="ml-auto hidden items-center gap-6 md:flex"
          >
            <NavLink to="/" end className={navigationClassName}>
              Shop
            </NavLink>
            <NavLink to="/catalog" className={navigationClassName}>
              Catalog
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-0 md:ml-4 md:gap-2">
            <Link
              to="/catalog#catalog-search"
              onClick={closeMenu}
              aria-label="Search products"
              className={controlClassName}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="10.8" cy="10.8" r="6.3" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </Link>

            <AccountMenu />

            <div className="group relative">
              <Link
                to="/cart"
                onClick={closeMenu}
                aria-label={`Cart, ${cartCount} ${
                  cartCount === 1 ? 'item' : 'items'
                }`}
                className={`relative ${controlClassName}`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M5 8h14l1 13H4L5 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>

                {cartCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-blue)] px-1 text-[9px] font-bold leading-none text-white"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <MiniCart />
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuIsOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={menuIsOpen}
              aria-controls="mobile-navigation"
              onClick={() =>
                setOpenLocationKey(menuIsOpen ? null : location.key)
              }
              className={`${controlClassName} md:hidden`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                {menuIsOpen ? (
                  <path d="m6 6 12 12M6 18 18 6" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          hidden={!menuIsOpen}
          className="absolute inset-x-0 top-full border-b-2 border-[var(--color-lavender)] bg-[var(--color-surface)] px-4 py-3 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={navigationClassName}
            >
              Shop
            </NavLink>
            <NavLink
              to="/catalog"
              onClick={closeMenu}
              className={navigationClassName}
            >
              Catalog
            </NavLink>
          </div>
        </nav>
      </header>
    </>
  )
}