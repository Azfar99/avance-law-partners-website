import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

// Tracks whether the section sitting directly under the fixed header is dark
// or light, so the header can pick readable text/logo colors before the user
// scrolls. Pages whose top section is light call useHeroTone("light").

type Tone = "dark" | "light"

const ChromeContext = createContext<{
  heroTone: Tone
  setHeroTone: (t: Tone) => void
} | null>(null)

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [heroTone, setHeroTone] = useState<Tone>("dark")
  return (
    <ChromeContext.Provider value={{ heroTone, setHeroTone }}>
      {children}
    </ChromeContext.Provider>
  )
}

// Safe default so a missing provider (e.g. during hot-reload) degrades to the
// dark-hero default rather than crashing the header.
const NOOP_CHROME = { heroTone: "dark" as Tone, setHeroTone: () => {} }

export function useChrome() {
  return useContext(ChromeContext) ?? NOOP_CHROME
}

// Declarative helper for pages: sets the hero tone on mount, restores dark on
// unmount so the next route starts from the default.
export function useHeroTone(tone: Tone) {
  const { setHeroTone } = useChrome()
  useEffect(() => {
    setHeroTone(tone)
    return () => setHeroTone("dark")
  }, [tone, setHeroTone])
}
