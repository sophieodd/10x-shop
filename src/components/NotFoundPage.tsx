import { Link, type To } from 'react-router'

type NotFoundPageProps = {
  message?: string
  catalogLink?: To
}

export default function NotFoundPage({
  message = 'The page you are looking for does not exist.',
  catalogLink = '/catalog',
}: NotFoundPageProps) {
  return (
    <main className="min-h-screen bg-[var(--color-page)] px-6 py-16 text-[var(--color-ink)]">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3">{message}</p>

      <Link
        to={catalogLink}
        className="mt-5 inline-block text-[var(--color-blue)] underline"
      >
        Go to catalog
      </Link>
    </main>
  )
}