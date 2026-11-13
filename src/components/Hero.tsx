import { Link } from 'react-router'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#111116] px-6 py-16 text-white sm:px-10 lg:min-h-[540px] lg:py-20">
      <p className="absolute bottom-8 left-6 hidden rotate-180 font-[var(--font-tech)] text-[9px] uppercase tracking-widest text-white/40 [writing-mode:vertical-rl] lg:block">
        Independent state of mind — est. 1991
      </p>

      <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-3 font-[var(--font-tech)] text-xs font-bold uppercase tracking-[0.18em]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-magenta)]" />
            Your settings. Your rules.
          </p>

          <h1 className="mt-8 font-[var(--font-display)] text-6xl font-light leading-[0.85] tracking-[-0.07em] sm:text-7xl lg:text-[6.7rem]">
            YOU CAN'T
            <br />
            <span className="font-medium text-[var(--color-magenta)]">
              CTRL
            </span>{' '}
            ME.
          </h1>

          <p className="mt-8 leading-relaxed text-white/75">
            Objects for the beautifully unfiltered.
            <br />
            Find your own frequency.
          </p>

          <Link
            to="/catalog"
            className="mt-7 inline-flex items-center gap-8 bg-[var(--color-blue)] px-5 py-4 font-[var(--font-tech)] text-sm font-bold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-lavender)]"
          >
            Explore the drop <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <p className="absolute -right-20 top-0 hidden font-[var(--font-tech)] text-[10px] font-bold leading-tight text-[var(--color-blue)] lg:block">
            CTRL
            <br />
            YOUR
            <br />
            REALITY
          </p>

          <div className="relative mt-4">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-2 translate-y-2 bg-[var(--color-magenta)]"
            />

            <div className="relative -rotate-2 border border-[var(--color-blue)] bg-[#111116]">
              <div className="flex items-center justify-between border-b border-[var(--color-blue)] px-4 py-3 font-[var(--font-tech)] text-xs text-white/70">
                <span>CTRL_ME.exe</span>
                <span className="text-lg text-[var(--color-blue)]">×</span>
              </div>

              <div className="relative grid min-h-64 place-items-center">
                <span className="absolute left-5 top-4 text-2xl text-[var(--color-lavender)]">
                  ✳
                </span>
                <span className="absolute right-5 top-4 text-2xl text-[var(--color-blue)]">
                  +
                </span>

                <h2 className="text-center font-[var(--font-display)] text-5xl font-black leading-[0.9] tracking-tight text-[var(--color-magenta)] sm:text-6xl">
                  DON'T
                  <br />
                  BLEND
                  <br />
                  IN<span className="text-[var(--color-blue)]">_</span>
                </h2>
              </div>

              <Link
                to="/about"
                aria-label="You weren’t supposed to click this. Read the CTRL ME story."
                className="group flex items-center justify-between gap-3 border-t border-[var(--color-blue)] px-4 py-2 font-[var(--font-tech)] text-[10px] font-bold tracking-wider text-white/80 transition-colors hover:text-[var(--color-lavender)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--color-lavender)]"
              >
                <span className="underline decoration-white/40 underline-offset-4">
                  YOU WEREN’T SUPPOSED TO CLICK THIS
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-base leading-none motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/uQm5kMGApayCddvv7"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View this Batumi Beach location on Google Maps"
            className="mt-4 block text-right font-[var(--font-tech)] text-[9px] leading-relaxed text-white/40 hover:text-[var(--color-blue)]"
          >
            41°39′24″ N
            <br />
            41°38′21″ E
          </a>
        </div>
      </div>
    </section>
  )
}