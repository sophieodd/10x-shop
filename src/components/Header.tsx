import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import AccountMenu from './AccountMenu'
import HeaderSearch from './HeaderSearch'
import MiniCart from './MiniCart'
import ThemeToggle from './ThemeToggle'

type HeaderProps = {
  cartCount: number
}

type OpenPanel = {
  name: 'navigation' | 'search'
  locationKey: string
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
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const [openPanel, setOpenPanel] = useState<OpenPanel | null>(null)

  const activePanel =
    openPanel?.locationKey === location.key ? openPanel.name : null

  const menuIsOpen = activePanel === 'navigation'
  const searchIsOpen = activePanel === 'search'

  useEffect(() => {
    if (!activePanel) return

    if (activePanel === 'search') {
      const searchInput =
        searchPanelRef.current?.querySelector<HTMLInputElement>(
          'input[type="search"]',
        )

      searchInput?.focus({ preventScroll: true })
    }

    function handleOutsideClick(event: PointerEvent) {
      if (!(event.target instanceof Node)) return

      const clickedInside =
        activePanel === 'search'
          ? searchPanelRef.current?.contains(event.target) ||
            searchButtonRef.current?.contains(event.target)
          : headerRef.current?.contains(event.target)

      if (!clickedInside) setOpenPanel(null)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      setOpenPanel(null)

      const trigger =
        activePanel === 'search' ? searchButtonRef : menuButtonRef

      trigger.current?.focus()
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [activePanel])

  function closePanel() {
    setOpenPanel(null)
  }

  function togglePanel(name: OpenPanel['name']) {
    setOpenPanel(
      activePanel === name ? null : { name, locationKey: location.key },
    )
  }

  return (
    <>
      <div className="bg-[var(--color-blue)] px-4 py-2 text-center font-[family-name:var(--font-tech)] text-[10px] font-bold uppercase tracking-[0.16em] text-white">
        Rebellious. Glitchy. Techy. Unapologetic.
      </div>

      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b-2 border-[var(--color-lavender)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 px-4 py-3 sm:px-5 sm:py-4">
          <Link
            to="/"
            onClick={closePanel}
            aria-label="Ctrl+Me home"
            className="inline-flex min-h-11 shrink-0 items-center font-[family-name:var(--font-display)] text-2xl font-bold tracking-[-0.08em] text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)]"
          >
            <span>
              CTRL<sup className="text-[0.55em]">+ME</sup>
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="ml-auto hidden items-center gap-6 md:flex"
          >
            <NavLink
              to="/"
              end
              onClick={closePanel}
              className={navigationClassName}
            >
              Shop
            </NavLink>

            <NavLink
              to="/catalog"
              onClick={closePanel}
              className={navigationClassName}
            >
              Catalog
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center md:ml-4 md:gap-2">
            <button
              ref={searchButtonRef}
              type="button"
              aria-label={searchIsOpen ? 'Close search' : 'Search products'}
              aria-expanded={searchIsOpen}
              aria-controls="header-search-panel"
              onClick={() => togglePanel('search')}
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
            </button>

            <AccountMenu />

            <div className="group relative">
              <Link
                to="/cart"
                onClick={closePanel}
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
              onClick={() => togglePanel('navigation')}
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

          <div
            id="mobile-navigation"
            className={`w-full border-t border-[var(--color-border)] pt-3 md:ml-2 md:flex md:w-auto md:items-center md:border-0 md:pt-0 ${
              menuIsOpen ? 'block' : 'hidden'
            }`}
          >
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 md:hidden"
            >
              <NavLink
                to="/"
                end
                onClick={closePanel}
                className={navigationClassName}
              >
                Shop
              </NavLink>

              <NavLink
                to="/catalog"
                onClick={closePanel}
                className={navigationClassName}
              >
                Catalog
              </NavLink>
            </nav>

            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] px-2 pt-3 md:mt-0 md:border-0 md:p-0">
              <span className="text-sm text-[var(--color-muted)] md:hidden">
                Appearance
              </span>

              <ThemeToggle />
            </div>
          </div>
        </div>

        <div
          ref={searchPanelRef}
          id="header-search-panel"
          hidden={!searchIsOpen}
          className="absolute inset-x-0 top-full border-b-2 border-[var(--color-lavender)] bg-[var(--color-surface)] px-4 py-3 shadow-lg"
        >
          <div className="mx-auto max-w-7xl">
            <div className="md:ml-auto md:max-w-md">
              {searchIsOpen && <HeaderSearch />}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}