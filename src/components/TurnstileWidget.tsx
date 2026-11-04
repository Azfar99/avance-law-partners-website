import { useEffect, useRef, useState } from "react"
type WidgetApi = {
  render(element: HTMLElement, options: Record<string, unknown>): string
  remove(id: string): void
}
declare global {
  interface Window {
    turnstile?: WidgetApi
  }
}
let scriptPromise: Promise<WidgetApi> | undefined
function loadWidget() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<WidgetApi>((resolve, reject) => {
    const script = document.createElement("script")
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    const timeout = window.setTimeout(fail, 15000)
    function fail() {
      clearTimeout(timeout)
      script.remove()
      scriptPromise = undefined
      reject(new Error("Verification unavailable"))
    }
    script.onerror = fail
    script.onload = () => {
      clearTimeout(timeout)
      window.turnstile ? resolve(window.turnstile) : fail()
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}
export default function TurnstileWidget({
  siteKey,
  resetKey,
  onToken,
}: {
  siteKey: string
  resetKey: number
  onToken: (token: string) => void
}) {
  const container = useRef<HTMLDivElement>(null),
    callback = useRef(onToken)
  callback.current = onToken
  const [size, setSize] = useState<"compact" | "flexible">("compact")
  const [attempt, setAttempt] = useState(0),
    [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!container.current || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(([entry]) =>
      setSize(entry.contentRect.width < 300 ? "compact" : "flexible"),
    )
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    let cancelled = false,
      id: string | undefined,
      api: WidgetApi | undefined
    callback.current("")
    setFailed(false)
    loadWidget()
      .then((value) => {
        if (cancelled || !container.current) return
        api = value
        id = api.render(container.current, {
          sitekey: siteKey,
          action: "contact",
          theme: "light",
          size,
          callback: (token: string) => {
            if (!cancelled) {
              callback.current(token)
              setFailed(false)
            }
          },
          "expired-callback": () => {
            if (!cancelled) {
              callback.current("")
              setAttempt((n) => n + 1)
            }
          },
          "timeout-callback": () => {
            if (!cancelled) {
              callback.current("")
              setFailed(true)
            }
          },
          "error-callback": () => {
            if (!cancelled) {
              callback.current("")
              setFailed(true)
            }
          },
        })
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      callback.current("")
      if (api && id !== undefined) api.remove(id)
    }
  }, [siteKey, resetKey, size, attempt])
  return (
    <div className="min-w-0">
      <div ref={container} />
      {failed && (
        <p role="alert" className="mt-2 text-[13px] text-red-900">
          Verification could not load.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Retry verification
          </button>
        </p>
      )}
    </div>
  )
}
