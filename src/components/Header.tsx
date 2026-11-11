import { Link } from 'react-router'
import MiniCart from './MiniCart'

type HeaderProps = {
  cartCount: number
}

function Header({ cartCount }: HeaderProps) {
  return (
    <>
      <div className="bg-[var(--color-blue)] px-4 py-2 text-center font-[var(--font-tech)] text-[10px] font-bold uppercase tracking-[0.16em] text-white">
        Rebellious. Glitchy. Techy. Unapologetic.
      </div>

      <header className="sticky top-0 z-50 border-b-2 border-[var(--color-lavender)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-5">
          <Link
            to="/"
            aria-label="Ctrl+Me home"
            className="shrink-0 font-[var(--font-display)] text-2xl font-bold tracking-[-0.08em] text-[var(--color-magenta)]"
          >
            CTRL<sup className="text-[0.55em]">+ME</sup>
          </Link>

          <div className="ml-auto flex items-center gap-8">
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-8 text-sm sm:flex"
            >
              <Link to="/" className="font-semibold text-[var(--color-magenta)]">
                Shop
              </Link>
              <Link to="/#catalog" className="text-[var(--color-ink)]">
                Catalog
              </Link>
            </nav>

            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label="Search products"
                title="Search will work when we add the catalog"
                className="text-[var(--color-ink)] hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
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

              <a
                href="#account"
                aria-label="Account"
                className="text-[var(--color-ink)] hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
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
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 20c.4-3.5 3.1-5.5 7-5.5s6.6 2 7 5.5" />
                </svg>
              </a>

              <div className="group relative">
                <Link
                  to="/cart"
                  aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                  className="relative block text-[var(--color-ink)] hover:text-[var(--color-magenta)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
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

                  <span
                    aria-hidden="true"
                    className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--color-blue)] px-1 text-[9px] font-bold leading-none text-white"
                  >
                    {cartCount}
                  </span>
                </Link>

                <MiniCart />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header