import { Component, type ReactNode } from "react"
import { Button } from "./ui"

export default class AppErrorBoundary extends Component<{
  children: ReactNode
}, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="flex min-h-screen items-center bg-ivory px-6 py-16 text-charcoal">
        <div className="mx-auto w-full max-w-xl">
          <p className="eyebrow text-copper">Avance Law Partners</p>
          <h1 className="display-section mt-4">We could not load this page.</h1>
          <p className="mt-5">
            Please refresh the page. If the problem continues, try again in a
            moment.
          </p>
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7"
          >
            Refresh page
          </Button>
        </div>
      </main>
    )
  }
}
