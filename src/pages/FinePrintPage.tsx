import { useEffect } from 'react'

const rules = [
  {
    title: 'IF IT WORKS, DON’T TOUCH IT.',
    text: 'We don’t know why it works. We don’t intend to find out.',
  },
  {
    title: 'GOOGLE IT. YOU’RE THE DEVELOPER.',
    text: 'Questions? Google is your first point of contact. We are equally confused.',
  },
  {
    title: 'NEVER SAY “JUST ONE MORE CHANGE”.',
    text: 'There is no such thing. There is only another three hours of debugging.',
  },
  {
    title: 'IF IT BREAKS, IT WAS LIKE THAT BEFORE.',
    text: 'Responsibility is a management issue. Management is unavailable.',
  },
  {
    title: 'BACKUP FIRST. PANIC SECOND.',
    text: 'We believe in preparation. We also believe in having a dramatic reaction.',
  },
  {
    title: 'THE FOUNDING MOTHER HAS FINAL SAY.',
    text: 'Technical arguments are welcome. Changing her mind is a separate project.',
  },
  {
    title: 'THERE IS NO SUCH THING AS TOO MANY FEATURES.',
    text: 'Only insufficient time, budget and technical support.',
  },
  {
    title: 'CHAOS IS NOT AN EXCUSE.',
    text: 'It is our operating model.',
  },
]

export default function FinePrintPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <main className="text-[var(--color-ink)]">
      <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-10 sm:pb-20 sm:pt-24">
        <header className="border-t-4 border-[var(--color-magenta)] pb-8 pt-6 sm:pb-12">
          <p className="mb-4 max-w-xs font-[family-name:var(--font-tech)] text-xs font-bold leading-relaxed tracking-wider sm:max-w-none sm:text-sm">
            OFFICIAL RULES OF AN UNOFFICIAL EMPIRE.
          </p>

          <h1 className="font-[family-name:var(--font-display)] text-[clamp(3rem,10vw,9rem)] font-black leading-[0.85] tracking-[-0.075em]">
            THE FINE PRINT
          </h1>
        </header>

        <ol
          role="list"
          className="list-none divide-y divide-[var(--color-ink)]/20 border-y-2 border-[var(--color-ink)]"
        >
          {rules.map((rule, index) => (
            <li
              key={rule.title}
              className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5 sm:py-7 lg:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-8"
            >
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-tech)] text-sm font-bold tabular-nums text-[var(--color-magenta)] sm:text-base"
              >
                {String(index + 1).padStart(2, '0')}.
              </span>

              <h2 className="font-[family-name:var(--font-display)] text-xl font-black leading-tight tracking-tight sm:text-2xl">
                {rule.title}
              </h2>

              <p className="col-start-2 mt-2 max-w-prose leading-relaxed lg:col-start-3 lg:mt-0">
                {rule.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 border-l-4 border-[var(--color-magenta)] bg-black px-5 py-7 text-white sm:mt-14 sm:px-8 sm:py-9">
          <p className="font-[family-name:var(--font-display)] text-2xl font-black leading-tight tracking-tight sm:text-3xl">
            LEGAL DEPARTMENT: CURRENTLY GOOGLE-ING.
          </p>

          <p className="mt-4 font-[family-name:var(--font-tech)] text-xs font-bold leading-relaxed tracking-wide text-white/75">
            CTRL ME © 2026 - CHAOS, NOW WITH INFRASTRUCTURE.
          </p>
        </div>
      </div>
    </main>
  )
}