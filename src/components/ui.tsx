import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react"
import { ArrowRight } from "lucide-react"
import { useRouter } from "../lib/router"
import { useReveal } from "../lib/useReveal"
import { Button as ShadcnButton } from "./ui/button"

/* ---------- Navigation-aware link ---------- */

export function AppLink({
  to,
  children,
  className = "",
  onNavigate,
  ...rest
}: {
  to: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { navigate } = useRouter()
  return (
    <a
      {...rest}
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        // Allow modified clicks to behave normally.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
          return
        e.preventDefault()
        navigate(to)
        onNavigate?.()
      }}
    >
      {children}
    </a>
  )
}

/* ---------- Buttons ---------- */

type ButtonBase = {
  children: ReactNode
  variant?: "gold" | "outline-dark" | "outline-light" | "ghost"
  size?: "md" | "lg" | "icon"
  className?: string
  withArrow?: boolean
}

function ButtonInner({
  children,
  withArrow,
}: {
  children: ReactNode
  withArrow?: boolean
}) {
  return (
    <span className="firm-button__content">
      <span className="firm-button__label">{children}</span>
      {withArrow && (
        <span aria-hidden className="firm-button__seal">
          <ArrowRight size={17} strokeWidth={2} />
        </span>
      )}
    </span>
  )
}

export function ButtonLink({
  to,
  variant = "gold",
  size = "md",
  className = "",
  withArrow,
  children,
}: ButtonBase & { to: string }) {
  const { navigate } = useRouter()
  return (
    <ShadcnButton
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <a
        href={`#${to}`}
        onClick={(e) => {
          if (
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey ||
            e.button !== 0
          )
            return
          e.preventDefault()
          navigate(to)
        }}
      >
        <ButtonInner withArrow={withArrow}>{children}</ButtonInner>
      </a>
    </ShadcnButton>
  )
}

export function Button({
  variant = "gold",
  size = "md",
  className = "",
  withArrow,
  children,
  ...rest
}: ButtonBase & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ShadcnButton
      {...rest}
      variant={variant}
      size={size}
      className={className}
    >
      <ButtonInner withArrow={withArrow}>{children}</ButtonInner>
    </ShadcnButton>
  )
}

/* ---------- Inline text link with animated underline ---------- */

export function InlineLink({
  to,
  children,
  tone = "dark",
}: {
  to: string
  children: ReactNode
  tone?: "dark" | "gold" | "light"
}) {
  const toneCls =
    tone === "gold"
      ? "text-copper"
      : tone === "light"
        ? "text-ivory"
        : "text-charcoal"
  return (
    <AppLink
      to={to}
      className={`text-action ${toneCls}`}
    >
      {children}
      <span
        aria-hidden
        className={`action-mark ${tone === "light" ? "action-mark--dark" : ""}`}
      >
        <ArrowRight size={14} strokeWidth={1.8} />
      </span>
    </AppLink>
  )
}

/* ---------- Layout container ---------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-16 ${className}`}
    >
      {children}
    </div>
  )
}

/* ---------- Eyebrow label ---------- */

export function Eyebrow({
  children,
  tone = "gold",
}: {
  children: ReactNode
  tone?: "gold" | "muted" | "light"
}) {
  const c =
    tone === "gold"
      ? "text-gold-deep"
      : tone === "light"
        ? "text-ivory/70"
        : "text-ink-60"
  return <p className={`eyebrow ${c}`}>{children}</p>
}

/* ---------- Reveal-on-scroll wrapper ---------- */

export function Reveal({
  children,
  className = "",
  as: As = "div",
  style,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "li" | "article"
  style?: React.CSSProperties
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    // @ts-expect-error dynamic element
    <As ref={ref} className={`reveal-on-view ${className}`} style={style}>
      {children}
    </As>
  )
}
