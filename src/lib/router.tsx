import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

type RouterValue = {
  path: string
  // Optional query params, used for preselecting the contact legal-matter field.
  query: URLSearchParams
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue | null>(null)

function readLocation() {
  const hash = window.location.hash.replace(/^#/, "")
  const raw = hash || "/"
  const queryIndex = raw.indexOf("?")
  const path = queryIndex < 0 ? raw : raw.slice(0, queryIndex)
  const search = queryIndex < 0 ? "" : raw.slice(queryIndex + 1)
  return {
    path: path.replace(/\/+$/, "") || "/",
    query: new URLSearchParams(search),
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [loc, setLoc] = useState(readLocation)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    const frame = requestAnimationFrame(() =>
      document.getElementById("main-content")?.focus({ preventScroll: true }),
    )
    return () => cancelAnimationFrame(frame)
  }, [loc.path])

  useEffect(() => {
    const onHash = () => setLoc(readLocation())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to.slice(1) : to
    window.location.hash = target
    // Move focus and scroll to top for a fresh page context.
    window.scrollTo({ top: 0, behavior: "instant" })
    const main = document.getElementById("main-content")
    if (main) main.focus({ preventScroll: true })
  }, [])

  return (
    <RouterContext.Provider
      value={{ path: loc.path, query: loc.query, navigate }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error("useRouter must be used within RouterProvider")
  return ctx
}
