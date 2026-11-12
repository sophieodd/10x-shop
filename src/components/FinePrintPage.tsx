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
  return (
    <main className="bg-[var(--color-page)] text-[var(--color-ink)]">
      <div className="bg-[var(--color-blue)] px-6 py-14 text-white sm:px-10 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-[var(--font-display)] text-5xl font-black leading-none tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            THE FINE PRINT
          </h1>
          <p className="mt-5 font-[var(--font-tech)] text-sm font-semibold tracking-wide sm:text-base">
            OFFICIAL RULES OF AN UNOFFICIAL EMPIRE.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
        <ol
          role="list"
          className="grid list-none gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2"
        >
          {rules.map((rule, index) => (
            <li
              key={rule.title}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 bg-[var(--color-surface)] p-5 sm:p-7"
            >
              <span
                aria-hidden="true"
                className="bg-[var(--color-lavender)] px-2 py-1 font-[var(--font-tech)] text-sm font-bold tabular-nums text-[var(--color-ink)]"
              >
                {String(index + 1).padStart(2, '0')}.
              </span>

              <div>
                <h2 className="font-[var(--font-display)] text-xl font-extrabold leading-tight sm:text-2xl">
                  {rule.title}
                </h2>
                <p className="mt-2 leading-relaxed">{rule.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 border-l-4 border-[var(--color-magenta)] bg-[var(--color-surface)] px-5 py-5 font-[var(--font-tech)] text-sm">
          <p className="font-bold">
            CTRL ME © 2026 - CHAOS, NOW WITH INFRASTRUCTURE.
          </p>
          <p className="mt-2">LEGAL DEPARTMENT: CURRENTLY GOOGLE-ING.</p>
        </div>
      </div>
    </main>
  )
}