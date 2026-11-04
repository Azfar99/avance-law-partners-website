import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { useRouter } from "../lib/router"
import { useChrome } from "../lib/chrome"
import { AppLink, ButtonLink, Container } from "./ui"
import { LogoLockupCompact } from "./Logo"
import { LanguageSwitch } from "./LanguageSwitch"

const NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Lawyers", to: "/lawyers" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
]

function isActive(path: string, to: string) {
  if (to === "/") return path === "/"
  return path === to || path.startsWith(to + "/")
}

export function Header() {
  const { path } = useRouter()
  const { heroTone } = useChrome()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [path])

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1280px)")
    const onChange = () => { if (breakpoint.matches) setOpen(false) }
    breakpoint.addEventListener("change", onChange)
    return () => breakpoint.removeEventListener("change", onChange)
  }, [])

  // Retain modal focus handling while keeping the original menu presentation.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      if (window.matchMedia("(max-width: 1279px)").matches) triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  // Dark text/logo when the header sits on a light surface: either scrolled
  // (ivory bar) or unscrolled over a light-toned hero.
  const onLight = scrolled || heroTone === "light"

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-ivory/98 border-b border-line-light backdrop-blur-0"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <Container className="flex h-[76px] items-center justify-between gap-1 max-[360px]:gap-1 sm:h-[84px] sm:gap-6 xl:h-[92px]">
        <AppLink to="/" className="rounded-[5px]">
          <LogoLockupCompact onLight={onLight} />
        </AppLink>

        <nav aria-label="Primary" className="hidden items-center gap-9 xl:flex">
          {NAV.map((item) => {
            const active = isActive(path, item.to)
            return (
              <AppLink
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`group relative py-1 text-[15px] font-medium transition-colors ${
                  onLight
                    ? active
                      ? "text-obsidian"
                      : "text-charcoal/75 hover:text-obsidian"
                    : active
                      ? "text-ivory"
                      : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-200 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </AppLink>
            )
          })}
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <ButtonLink to="/contact" variant="gold" size="md">
            Make an enquiry
          </ButtonLink>
          <LanguageSwitch />
        </div>

        <div className="flex items-center gap-1 xl:hidden">
          <LanguageSwitch />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-[5px] max-[360px]:h-10 max-[360px]:w-10 ${
              onLight ? "text-obsidian" : "text-ivory"
            }`}
          >
            <Menu aria-hidden size={24} strokeWidth={1.5} />
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
        id="site-menu"
        inert={!open}
        aria-hidden={!open}
        onClickCapture={(event) => {
          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && (event.target as Element).closest("a[href]")) setOpen(false)
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return
          const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
          const first = items[0], last = items[items.length - 1]
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
        }}
      >
        <div
          className={`absolute inset-0 bg-obsidian transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`absolute inset-x-0 top-0 flex h-[100dvh] flex-col overflow-y-auto bg-obsidian px-5 pb-10 pt-6 transition-transform duration-200 ${
            open ? "translate-y-0" : "-translate-y-3 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <LogoLockupCompact />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-[5px] text-ivory"
            >
              <X aria-hidden size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex flex-col">
            {NAV.map((item) => (
              <AppLink
                key={item.to}
                to={item.to}
                onNavigate={() => setOpen(false)}
                className={`border-b border-line-dark py-5 font-serif text-[30px] transition-colors ${
                  isActive(path, item.to)
                    ? "text-gold"
                    : "text-ivory hover:text-gold"
                }`}
              >
                {item.label}
              </AppLink>
            ))}
          </nav>
          <div className="mt-10">
            <ButtonLink
              to="/contact"
              variant="gold"
              size="lg"
              className="w-full"
              withArrow
            >
              Make an enquiry
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  )
}
