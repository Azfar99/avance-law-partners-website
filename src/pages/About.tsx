import { approach, firmIntro } from "../lib/content"
import { useLawyers, useSiteSettings } from "../lib/hooks"
import AboutStatistics from "../components/AboutStatistics"
import { countPracticeEntries, yearsOfPractice } from "../lib/statistics"
import { Container, Eyebrow, InlineLink, Reveal } from "../components/ui"
import { ContentStatus, SectionHead } from "../components/parts"
import { useHeroTone } from "../lib/chrome"
import SEOHead from "../components/SEOHead"

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1641987273839-74f6c6f1b4b3?w=1000&h=1250&fit=crop&auto=format&q=80"

const ABOUT_IMG_SRCSET = [480, 768, 1120]
  .map((width) => `${ABOUT_IMG.replace(/w=\d+/, `w=${width}`)} ${width}w`)
  .join(", ")

export default function About() {
  useHeroTone("light")
  const { settings, loading: settingsLoading } = useSiteSettings()
  const { lawyers, loading: lawyersLoading, loadFailed, refresh } = useLawyers()
  const yearsPracticing = yearsOfPractice(settings.established || "1998")
  const practiceCount = countPracticeEntries(lawyers)

  return (
    <>
      <SEOHead
        title="About Us & Practice History"
        description="Established in 1998, Avance Law Partners combines sound legal expertise with practical, commercially focused advice in Dhaka, Bangladesh."
        canonicalPath="/about"
      />
      {/* Quieter ivory opening, with a large typographic "1998" watermark */}
      <section className="relative overflow-hidden bg-ivory">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 top-24 select-none font-serif text-[clamp(9rem,26vw,24rem)] leading-none text-obsidian/[0.035] lg:top-28"
        >
          1998
        </span>
        <Container className="relative pb-20 pt-32 lg:pb-28 lg:pt-44">
          <Eyebrow>About the firm</Eyebrow>
          <h1 className="mt-8 max-w-4xl text-obsidian display-hero">
            A practice built on clarity, since 1998.
          </h1>
          {loadFailed ? <ContentStatus message="Practice figures could not load. Please try again." retry={refresh} /> :
            <AboutStatistics years={yearsPracticing} practiceCount={practiceCount} ready={!settingsLoading && !lawyersLoading} />}
        </Container>
      </section>

      <section className="bg-ivory">
        <Container className="pb-24 lg:pb-32">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal>
              <p className="text-[20px] leading-relaxed text-charcoal">
                {firmIntro.primary}
              </p>
              <p className="mt-6 text-[18px] leading-relaxed text-charcoal/80">
                {firmIntro.secondary}
              </p>
              <p className="mt-6 text-[18px] leading-relaxed text-charcoal/80">
                {firmIntro.tertiary}
              </p>
            </Reveal>
            <Reveal style={{ animationDelay: "80ms" }}>
              <div className="overflow-hidden rounded-[6px] bg-charcoal">
                <img
                  src={ABOUT_IMG}
                  srcSet={ABOUT_IMG_SRCSET}
                  sizes="(min-width: 1024px) 500px, calc(100vw - 40px)"
                  alt="Warm daylight across stone and dark timber joinery in a contemporary interior, temporary illustrative image."
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 text-[12px] italic text-ink-60">
                Illustrative image, temporary, not the firm's office.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Approach statement */}
      <section className="border-y border-line-light bg-stone">
        <Container className="py-24 lg:py-32">
          <SectionHead
            eyebrow="Our approach"
            title="Responsive. Practical. Commercially sound."
          >
            {approach.statement}
          </SectionHead>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {approach.principles.map((p, i) => (
              <Reveal key={p.title} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="border-t border-charcoal/20 pt-6">
                  <h3 className="font-serif text-[24px] text-obsidian">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-charcoal/80">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12">
            <InlineLink to="/approach">More on how we work</InlineLink>
          </div>
        </Container>
      </section>

      {/* Lawyers intro */}
      <section className="bg-obsidian text-ivory">
        <Container className="py-24 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <Eyebrow tone="light">Our lawyers</Eyebrow>
              <h2 className="display-section mt-4 text-ivory">
                Experienced counsel, directly involved.
              </h2>
              <p className="mt-5 max-w-lg text-[18px] leading-relaxed text-ivory/75">
                Our lawyers work closely with clients from first conversation to
                resolution. Meet the people behind the practice.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <InlineLink to="/lawyers" tone="light">
                Meet our lawyers
              </InlineLink>
            </div>
          </div>
          <p className="mt-16 border-t border-line-dark pt-8 text-[15px] text-ivory/50">
            {settings.firm_name} · {settings.location}
          </p>
        </Container>
      </section>
    </>
  )
}
