import { type UIEvent, useEffect, useState } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import {
  approach as defaultApproach,
  firmIntro as defaultFirmIntro,
  services as defaultServices,
} from "../lib/content"
import { usePageContent, useServices, useSiteSettings } from "../lib/hooks"
import {
  ButtonLink,
  Container,
  Eyebrow,
  InlineLink,
  Reveal,
} from "../components/ui"
import { SectionHead } from "../components/parts"
import SEOHead from "../components/SEOHead"
import { useHeroTone } from "../lib/chrome"

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=85&w=1400",
    alt: "A traditional law library with rows of legal books",
  },
  {
    src: "https://images.unsplash.com/photo-1603644448048-28a7e5122f0a?auto=format&fit=crop&q=85&w=1400",
    alt: "A grand courthouse interior with stone columns",
  },
  {
    src: "https://images.unsplash.com/photo-1760166699654-5d0e10f51994?auto=format&fit=crop&q=85&w=1400",
    alt: "A modern law library with warm natural light",
  },
  {
    src: "https://images.unsplash.com/photo-1752697589029-0fd0ce96a395?auto=format&fit=crop&q=85&w=1400",
    alt: "Legal books arranged for careful research",
  },
]

const APPROACH_IMAGE =
  "https://images.unsplash.com/photo-1767786330387-5cef0327b6c1?auto=format&fit=crop&q=85&w=1200"

function responsiveImageSet(source: string) {
  return [480, 768, 1120]
    .map((width) => `${source.replace(/w=\d+/, `w=${width}`)} ${width}w`)
    .join(", ")
}

function Hero() {
  const { settings } = useSiteSettings()
  const { content } = usePageContent("home")
  const [activeImage, setActiveImage] = useState(0)
  const eyebrow =
    content.hero_eyebrow || `${settings.firm_name} · ${settings.location}`
  const subtitle =
    content.hero_subtitle ||
    "Clear legal judgment for businesses, institutions and individuals navigating consequential decisions."

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="bg-obsidian px-3 pb-10 pt-3 text-ivory sm:px-6 sm:pb-12 sm:pt-5 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-obsidian sm:rounded-[28px]">
        <Container className="grid gap-6 px-5 pb-6 pt-[5.5rem] sm:gap-10 sm:px-10 sm:pb-10 sm:pt-28 xl:grid-cols-[.92fr_1.08fr] xl:items-center xl:gap-20 xl:pb-16 xl:pt-36">
          <div className="min-w-0 max-w-xl">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-gold sm:text-[0.72rem] sm:tracking-[0.22em]">
              {eyebrow}
            </p>
            <h1 className="display-hero mt-3 text-[2.25rem] leading-[1.02] text-ivory sm:mt-5 sm:text-[clamp(2.35rem,6.4vw,5.1rem)] sm:leading-[1.06]">
              Clarity for the <span className="text-gold">next move.</span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-[1.55] text-ivory/70 sm:mt-6 sm:text-[19px] sm:leading-relaxed">
              {subtitle}
            </p>
            <div className="hero-actions mt-5 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
              <ButtonLink
                to="/contact"
                variant="gold"
                size="lg"
                withArrow
              >
                Speak with counsel
              </ButtonLink>
              <ButtonLink
                to="/services"
                variant="outline-light"
                size="lg"
                withArrow
              >
                Our practice areas
              </ButtonLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[570px]">
            <div className="absolute -left-2 -top-2 h-full w-full rounded-[16px] border border-gold/35 sm:-left-3 sm:-top-3 sm:rounded-[22px]" />
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] sm:aspect-[3/2] sm:rounded-[22px] xl:aspect-[4/3] 2xl:aspect-[4/4.3]">
              {HERO_IMAGES.map((image, index) => (
                <img
                  key={image.src}
                  src={image.src}
                  srcSet={responsiveImageSet(image.src)}
                  sizes="(min-width: 1280px) 570px, (min-width: 640px) calc(100vw - 128px), calc(100vw - 64px)"
                  alt={image.alt}
                  aria-hidden={index !== activeImage}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                    index === activeImage ? "opacity-100" : "opacity-0"
                  }`}
                  decoding="async"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                />
              ))}
            </div>
            <div className="absolute bottom-3 left-3 border border-ivory/25 bg-obsidian/90 px-3 py-2 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:px-4 sm:py-3">
              <span className="block font-serif text-[20px] leading-none text-gold sm:text-[24px]">
                {settings.established || "1998"}
              </span>
              <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[.13em] text-ivory/65 sm:text-[10px] sm:tracking-[.16em]">
                Established in Dhaka
              </span>
            </div>
          </div>
        </Container>
        <div className="border-t border-ivory/15">
          <Container className="px-5 sm:px-10">
            <button
              type="button"
              onClick={() => {
                document
                  .getElementById("who-we-support")
                  ?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })
              }}
              className="control-parent flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-3 text-left sm:py-6"
              aria-label="Explore Avance Law Partners"
            >
              <span className="text-[13px] font-semibold tracking-[.02em] text-ivory/85 sm:text-[15px]">
                Explore Avance Law Partners
              </span>
              <span className="action-mark action-mark--dark">
                <ArrowDown aria-hidden size={17} strokeWidth={1.5} />
              </span>
            </button>
          </Container>
        </div>
      </div>
    </section>
  )
}

const CLIENT_NEEDS = [
  {
    title: "Growing businesses",
    body: "Commercial advice, contracts and governance for decisions that shape the next stage.",
  },
  {
    title: "Established companies",
    body: "Ongoing counsel for operational legal questions, risk and regulatory change.",
  },
  {
    title: "Institutions",
    body: "Careful, accountable legal support where process and public interest matter.",
  },
  {
    title: "Individuals",
    body: "Clear representation and practical direction when a personal legal matter needs attention.",
  },
]

function ClientNeeds() {
  return (
    <section
      id="who-we-support"
      className="bg-obsidian pb-24 text-ivory lg:pb-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <div className="min-w-0">
            <Eyebrow tone="light">Who we support</Eyebrow>
            <h2 className="display-section mt-4 max-w-sm text-ivory">
              Counsel for work that{" "}
              <span className="text-gold">cannot wait.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ivory/60">
              The right legal response depends on what is at stake, who is
              affected and what happens next.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
            {CLIENT_NEEDS.map((need, index) => (
              <article
                key={need.title}
                className="min-h-[190px] min-w-0 rounded-[10px] border border-ivory/20 p-4 transition-colors hover:border-gold/70 sm:min-h-[170px] sm:rounded-[12px] sm:p-6"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-obsidian sm:h-8 sm:w-8 sm:text-[12px]">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-serif text-[18px] leading-[1.05] text-ivory sm:mt-5 sm:text-[24px] sm:leading-tight">
                  {need.title}
                </h3>
                <p className="mt-2 text-[11px] leading-[1.45] text-ivory/60 sm:text-[14px] sm:leading-relaxed">
                  {need.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function Introduction() {
  const { content } = usePageContent("home")
  const heading =
    content.intro_heading ||
    "Advice that gives the next decision a sound legal footing."
  const primary = content.intro_primary || defaultFirmIntro.primary
  const secondary = content.intro_secondary || defaultFirmIntro.secondary

  return (
    <section className="bg-ivory">
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:gap-24 lg:py-32">
        <Reveal>
          <Eyebrow>Avance Law Partners</Eyebrow>
          <h2 className="display-section mt-4 max-w-xl text-obsidian">
            {heading}
          </h2>
        </Reveal>
        <Reveal
          className="border-l border-line-light pl-6 sm:pl-10"
          style={{ animationDelay: "80ms" }}
        >
          <p className="max-w-2xl text-[20px] leading-relaxed text-charcoal">
            {primary}
          </p>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-60">
            {secondary}
          </p>
          <div className="mt-8">
            <InlineLink to="/about">Learn about the firm</InlineLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

function ServicesPreview() {
  const { services } = useServices()
  const practiceAreas = services
  const [scrollProgress, setScrollProgress] = useState(0)

  function updateScrollProgress(event: UIEvent<HTMLDivElement>) {
    const { clientWidth, scrollLeft, scrollWidth } = event.currentTarget
    const scrollableDistance = scrollWidth - clientWidth
    setScrollProgress(
      scrollableDistance > 0 ? scrollLeft / scrollableDistance : 0,
    )
  }

  return (
    <section className="border-y border-line-light bg-stone">
      <Container className="py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHead
            eyebrow="Practice areas"
            title="Find the right starting point."
          >
            Focused legal capability, arranged around the issues that demand a
            clear course of action.
          </SectionHead>
          <div className="hidden sm:block">
            <InlineLink to="/services">View all practice areas</InlineLink>
          </div>
        </div>

        <div
          className="mt-10 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto border-l border-t border-line-light px-5 pb-3 pr-10 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mt-14 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-0 sm:overflow-visible sm:px-0 sm:pb-0 sm:pr-0 sm:[scrollbar-width:auto] lg:grid-cols-4"
          role="region"
          aria-label="Practice areas. Swipe horizontally to view every practice area."
          onScroll={updateScrollProgress}
        >
          {practiceAreas.map((service, index) => (
            <Reveal
              key={service.slug}
              className="group w-[78vw] shrink-0 snap-start border-b border-r border-line-light sm:w-auto"
              style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
            >
              <a
                href={`#/services/${service.slug}`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.button !== 0)
                    return
                  event.preventDefault()
                  window.location.hash = `/services/${service.slug}`
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="control-parent flex min-h-[210px] min-w-0 flex-col justify-between p-5 transition-colors duration-200 hover:bg-ivory sm:min-h-[230px] sm:p-7"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="text-[11px] font-semibold tracking-[0.16em] text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="action-mark"
                  >
                    <ArrowUpRight size={18} strokeWidth={1.6} />
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-[25px] leading-[1.08] text-obsidian">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-60">
                    {service.summary}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-3 sm:hidden" aria-hidden>
          <div className="h-1.5 overflow-hidden rounded-full bg-gold-deep/15 shadow-inner">
            <span
              className="block h-full w-[38%] rounded-full bg-gradient-to-r from-gold-deep via-gold to-[#ead078] shadow-[0_0_12px_rgb(201_162_39_/_0.35)] transition-[transform] duration-150"
              style={{ transform: `translateX(${scrollProgress * 163}%)` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-60">
            <span>Swipe to explore</span>
            <span>{String(practiceAreas.length).padStart(2, "0")} areas</span>
          </div>
        </div>
        <div className="mt-10 sm:hidden">
          <InlineLink to="/services">View all practice areas</InlineLink>
        </div>
      </Container>
    </section>
  )
}

function Approach() {
  const { content } = usePageContent("home")
  const statement = content.approach_statement || defaultApproach.statement

  return (
    <section className="bg-obsidian text-ivory">
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-20 lg:py-32">
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-[16px] border border-gold/40" />
          <img
            src={APPROACH_IMAGE}
            srcSet={responsiveImageSet(APPROACH_IMAGE)}
            sizes="(min-width: 1024px) 480px, calc(100vw - 40px)"
            alt="A quiet professional office with bookshelves and a consultation desk"
            className="relative aspect-[4/5] w-full rounded-[16px] object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div>
          <Reveal>
            <Eyebrow tone="light">How we work</Eyebrow>
            <h2 className="display-section mt-4 max-w-md text-ivory">
              Measured advice.{" "}
              <span className="text-gold">Meaningful progress.</span>
            </h2>
            <p className="mt-7 max-w-lg text-[18px] leading-relaxed text-ivory/70">
              {statement}
            </p>
            <div className="mt-8">
              <InlineLink to="/approach" tone="light">
                Our approach
              </InlineLink>
            </div>
          </Reveal>
          <div className="mt-12 border-t border-line-dark">
            {defaultApproach.principles.map((principle, index) => (
              <Reveal
                key={principle.title}
                className="grid gap-4 border-b border-line-dark py-6 sm:grid-cols-[4rem_1fr] sm:gap-7"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="font-serif text-[22px] text-gold">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-[25px] leading-none text-ivory">
                    {principle.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ivory/65">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function ContactInvite() {
  const { settings } = useSiteSettings()
  const { content } = usePageContent("home")
  const heading = content.contact_heading || "Start with the matter at hand."
  const subtitle =
    content.contact_subtitle ||
    "Tell us a little about the issue. We will help identify the right counsel and the next sensible step."

  return (
    <section className="bg-ivory">
      <Container className="py-16 sm:py-24 lg:py-32">
        <div className="relative overflow-hidden bg-gold p-6 sm:p-12 lg:p-16">
          <div
            aria-hidden
            className="absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full border border-obsidian/20"
          />
          <div
            aria-hidden
            className="absolute bottom-[-3rem] right-[9rem] h-48 w-48 rounded-full border border-obsidian/15"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <Eyebrow tone="muted">Contact</Eyebrow>
              <h2 className="display-section mt-4 max-w-2xl text-obsidian">
                {heading}
              </h2>
              <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-charcoal/80">
                {subtitle}
              </p>
              <div className="mt-8">
                <ButtonLink
                  to="/contact"
                  variant="outline-dark"
                  size="lg"
                  withArrow
                >
                  Make an enquiry
                </ButtonLink>
              </div>
            </div>
            <address className="border-t border-obsidian/25 pt-6 not-italic lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <p className="eyebrow text-charcoal/70">Office</p>
              <p className="mt-4 max-w-xs text-[17px] leading-relaxed text-charcoal">
                <span className="block">{settings.address_line_1}</span>
                <span className="block">{settings.address_line_2}</span>
                <span className="block">{settings.address_line_3}</span>
              </p>
            </address>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default function Home() {
  useHeroTone("dark")
  return (
    <>
      <SEOHead
        title="Avance Law Partners | Legal Excellence Since 1998 | Dhaka, Bangladesh"
        description="Comprehensive corporate, commercial, regulatory, and dispute resolution legal counsel in Dhaka, Bangladesh."
        canonicalPath="/"
      />
      <Hero />
      <ClientNeeds />
      <Introduction />
      <ServicesPreview />
      <Approach />
      <ContactInvite />
    </>
  )
}
