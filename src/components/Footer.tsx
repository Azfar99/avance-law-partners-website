import { ArrowRight } from "lucide-react"
import { useSiteSettings } from "../lib/hooks"
import { AppLink, ButtonLink, Container } from "./ui"
import { LogoFull } from "./Logo"
import { lawyers } from "../lib/content"

const existingContact = lawyers.find((lawyer) => lawyer.slug === "lawyer-one")

const NAV = [
  { label: "About the firm", to: "/about" },
  { label: "Our approach", to: "/approach" },
  { label: "Our lawyers", to: "/lawyers" },
  { label: "Contact", to: "/contact" },
]

const PRACTICE_AREAS = [
  { label: "Corporate & Company Law", to: "/services/corporate-company-law" },
  {
    label: "Commercial Advisory",
    to: "/services/commercial-business-advisory",
  },
  { label: "Arbitration & ADR", to: "/services/arbitration-adr" },
  {
    label: "Litigation & Dispute Resolution",
    to: "/services/litigation-and-dispute-resolution",
  },
]

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Legal Disclaimer", to: "/disclaimer" },
  { label: "Terms of Use", to: "/terms" },
]

export function Footer() {
  const { settings } = useSiteSettings()

  return (
    <footer className="bg-obsidian text-ivory">
      <div className="border-b border-line-dark">
        <Container className="flex flex-col gap-8 py-12 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold">Avance Law Partners</p>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] tracking-[-.015em] text-ivory">
              A clearer path starts with a conversation.
            </h2>
          </div>
          <ButtonLink
            to="/contact"
            variant="gold"
            size="lg"
            withArrow
            className="w-full sm:w-fit"
          >
            For urgent consultancy
          </ButtonLink>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-12 sm:py-14 lg:grid-cols-[1.25fr_.75fr_1fr_.9fr] lg:gap-10 lg:py-20">
        <div className="max-w-xs">
          <LogoFull className="w-[150px] sm:w-[168px]" />
          <p className="mt-6 font-serif text-[19px] leading-snug text-ivory/85">
            {settings.tagline || "Legal excellence. Practical solutions."}
          </p>
          <p className="mt-4 text-[14px] leading-relaxed text-ivory/55">
            Trusted legal counsel for companies, institutions and individuals
            since {settings.established || "1998"}.
          </p>
        </div>

        <nav aria-label="Explore" className="flex flex-col gap-3">
          <p className="eyebrow mb-2 text-gold">Explore</p>
          {NAV.map((item) => (
            <AppLink
              key={item.to}
              to={item.to}
              className="w-fit text-[14px] text-ivory/70 transition-colors hover:text-gold"
            >
              {item.label}
            </AppLink>
          ))}
        </nav>

        <nav aria-label="Practice areas" className="flex flex-col gap-3">
          <p className="eyebrow mb-2 text-gold">Practice areas</p>
          {PRACTICE_AREAS.map((item) => (
            <AppLink
              key={item.to}
              to={item.to}
              className="w-fit text-[14px] text-ivory/70 transition-colors hover:text-gold"
            >
              {item.label}
            </AppLink>
          ))}
          <AppLink
            to="/services"
            className="mt-2 inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-ivory transition-colors hover:text-gold"
          >
            <span>All practice areas</span>
            <ArrowRight aria-hidden size={15} strokeWidth={1.7} />
          </AppLink>
        </nav>

        <div>
          <p className="eyebrow mb-4 text-gold">Office</p>
          <address className="not-italic text-[14px] leading-relaxed text-ivory/70">
            <span className="block">{settings.address_line_1}</span>
            <span className="block">{settings.address_line_2}</span>
            <span className="block">{settings.address_line_3}</span>
          </address>
          <div className="mt-4 flex flex-col items-start gap-2 text-[14px] text-ivory/70">
            {existingContact?.phone && <a href={`tel:${existingContact.phone.replace(/[^+\d]/g, "")}`} className="break-words transition-colors hover:text-gold">{existingContact.phone}</a>}
            {existingContact?.email && <a href={`mailto:${existingContact.email}`} className="break-all transition-colors hover:text-gold">{existingContact.email}</a>}
          </div>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[.14em] text-ivory/45">
            Dhaka, Bangladesh
          </p>
        </div>
      </Container>

      <div className="border-t border-line-dark">
        <Container className="flex flex-col gap-4 py-6 text-[12px] text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {settings.footer_text ||
              "© Avance Law Partners. All rights reserved."}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((item) => (
              <AppLink
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-ivory"
              >
                {item.label}
              </AppLink>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  )
}
