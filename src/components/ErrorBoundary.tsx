import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Shop render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[var(--color-page)] px-6 py-12 text-[var(--color-ink)]">
          <div className="text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold">
              Something went wrong.
            </h1>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 min-h-11 bg-[var(--color-magenta)] px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-blue)]"
            >
              Reload
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}