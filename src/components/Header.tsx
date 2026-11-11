type HeaderProps = {
  cartCount: number
}

function Header({ cartCount }: HeaderProps) {
  return (
    <>
      <div className="bg-[var(--color-blue)] px-4 py-2 text-center font-[var(--font-tech)] text-[10px] font-bold uppercase tracking-[0.16em] text-white">
        Rebellious. Glitchy. Techy. Unapologetic.
      </div>

      <header className="bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-5">
          <a
            href="#shop"
            aria-label="Ctrl+Me home"
            className="shrink-0 font-[var(--font-display)] text-2xl font-bold tracking-[-0.08em] text-[var(--color-magenta)]"
          >
            CTRL<sup className="text-[0.55em]">+ME</sup>
          </a>

          <div className="ml-auto flex items-center gap-8">
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-8 text-sm sm:flex"
            >
              <a href="#shop" className="font-semibold text-[var(--color-magenta)]">
                Shop
              </a>
              <a href="#catalog" className="text-[var(--color-ink)]">
                Catalog
              </a>
              <a href="#account" className="text-[var(--color-ink)]">
                Account
              </a>
            </nav>

            <a
              href="#cart"
              aria-label={`Bag, ${cartCount} items`}
              className="flex items-center gap-2 text-sm text-[var(--color-ink)]"
            >
              Bag
              <span className="min-w-5 rounded-sm bg-[var(--color-blue)] px-1.5 py-1 text-center text-[10px] font-bold leading-none text-white">
                {cartCount}
              </span>
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header