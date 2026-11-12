import { Link } from 'react-router'

const linkClass =
  'inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

const contactEmail = ''

const socialIcons = [
  {
    name: 'Instagram',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'TikTok',
    icon: (
      <path d="M14 3v13a4 4 0 1 1-4-4m4-9c.5 3.5 2.5 5.5 6 6" />
    ),
  },
  {
    name: 'Facebook',
    icon: (
      <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8" />
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--color-blue)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <Link
              to="/"
              aria-label="Ctrl+Me home"
              className={`${linkClass} font-[var(--font-display)] text-2xl font-bold tracking-[-0.08em]`}
            >
              CTRL<sup className="ml-0.5 text-[0.55em]">+ME</sup>
            </Link>

            <ul aria-label="Social media" className="mt-3 flex gap-3">
              {socialIcons.map(({ name, icon }) => (
                <li key={name}>
                  <svg
                    role="img"
                    aria-label={name}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {icon}
                  </svg>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex gap-5 font-[var(--font-tech)] text-sm"
          >
            <Link to="/#catalog" className={linkClass}>
              Catalog
            </Link>
            <Link to="/cart" className={linkClass}>
              Cart
            </Link>
          </nav>

          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="font-[var(--font-display)] font-semibold"
            >
              Contact
            </h2>

            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className={`${linkClass} text-sm`}>
                {contactEmail}
              </a>
            ) : (
              <p className="mt-2 text-sm">Email coming soon.</p>
            )}
          </section>
        </div>

        <p className="mt-7 border-t border-white/35 pt-4 font-[var(--font-tech)] text-xs">
          © {new Date().getFullYear()} Ctrl+Me. All rights reserved.
        </p>
      </div>
    </footer>
  )
}