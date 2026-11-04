import { useEffect, useRef, useState } from "react"
import "./about-statistics.css"

export default function AboutStatistics({ years, practiceCount, ready }: { years: number; practiceCount: number; ready: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = container.current
    if (!element || !ready || visible) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ready, visible])

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0
    let start: number | undefined
    const finish = () => { cancelAnimationFrame(frame); setProgress(1) }
    const onMotionChange = () => { if (motion.matches) finish() }
    if (motion.matches) { finish(); return }
    if (!visible) return
    motion.addEventListener("change", onMotionChange)
    const tick = (now: number) => {
      start ??= now
      const elapsed = Math.min((now - start) / 900, 1)
      setProgress(1 - Math.pow(1 - elapsed, 3))
      if (elapsed < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); motion.removeEventListener("change", onMotionChange) }
  }, [visible])

  return (
    <div ref={container} aria-busy={!ready} className={`about-statistics mt-12 flex flex-wrap items-stretch gap-x-14 gap-y-8 border-t border-line-light pt-10 ${visible ? "about-statistics--active" : ""}`}>
      {[{ value: years, label: "Years of practice", id: "years" }, { value: practiceCount, label: "Practice areas", id: "practice-areas" }].map(stat => (
        <div key={stat.id} className="min-w-[120px]" title={stat.id === "practice-areas" ? "Combined practice-area entries across our published lawyers; shared areas are counted for each lawyer." : undefined}>
          <span className="sr-only">{ready ? stat.value : "Loading"} {stat.label}</span>
          <p aria-hidden="true" className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none text-gold-deep">
            <span data-count={stat.id} className="inline-block tabular-nums" style={{ minWidth: `${Math.max(2, String(stat.value).length)}ch` }}>
              {ready ? Math.round(stat.value * progress) : "—"}
            </span>
          </p>
          <p aria-hidden="true" className="mt-2 text-[13px] uppercase tracking-[0.16em] text-ink-60">{stat.label}</p>
        </div>
      ))}
      <div className="about-statistics__location min-w-[120px]">
        <p className="font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none text-gold-deep">Dhaka</p>
        <p className="mt-2 text-[13px] uppercase tracking-[0.16em] text-ink-60">Bangladesh</p>
      </div>
    </div>
  )
}
