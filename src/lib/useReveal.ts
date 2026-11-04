import { useEffect, useRef } from "react"

// Adds `is-visible` once, when the element scrolls into view. Section entrance
// motion is capped and runs a single time; reduced-motion is handled in CSS.
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible")
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -24px 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}
