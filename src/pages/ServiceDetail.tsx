import { useService, useServices } from "../lib/hooks"
import { ButtonLink, Container, InlineLink } from "../components/ui"
import { Breadcrumb, ContentStatus } from "../components/parts"
import { NotFound } from "./NotFound"
import { useHeroTone } from "../lib/chrome"
import SEOHead from "../components/SEOHead"

export default function ServiceDetail({ slug }: { slug: string }) {
  useHeroTone("dark")
  const { service, loading, loadFailed, refresh } = useService(slug)
  const { services: allServices } = useServices()

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center bg-obsidian text-ivory">
        <p className="text-sm font-serif text-ivory/50">
          Loading practice area...
        </p>
      </section>
    )
  }

  if (loadFailed) return (
    <section className="min-h-[50vh] bg-ivory pt-32">
      <SEOHead title="Practice area temporarily unavailable" canonicalPath="/404" />
      <Container><ContentStatus message="This practice area could not load. Please try again." retry={refresh} /></Container>
    </section>
  )
  if (!service) return <NotFound />

  const others = allServices.filter((s) => s.slug !== slug).slice(0, 3)
  const indexNum = service.index_number || (service as any).index || "01"

  return (
    <>
      <SEOHead
        title={`${service.title} | Practice Area`}
        description={
          service.summary ||
          "Legal representation and advisory services in Dhaka, Bangladesh."
        }
        canonicalPath={`/services/${service.slug}`}
      />
      <section className="relative overflow-hidden bg-obsidian text-ivory arch-grid">
        <span
          aria-hidden
          className="absolute right-[6%] top-28 font-serif text-[clamp(10rem,26vw,25rem)] leading-none text-gold/[.07]"
        >
          {indexNum}
        </span>
        <Container className="relative pb-16 pt-32 lg:pb-24 lg:pt-44">
          <div className="[&_a]:text-ivory/60 [&_a:hover]:text-ivory [&_[aria-current]]:text-ivory [&_span]:text-ivory/30">
            <Breadcrumb
              trail={[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: service.title },
              ]}
            />
          </div>
          <p className="eyebrow mt-8 text-gold">Practice area · {indexNum}</p>
          <h1 className="display-hero mt-5 max-w-4xl text-ivory">
            {service.title}
          </h1>
          <p className="mt-7 max-w-2xl text-[19px] leading-relaxed text-ivory/75">
            {service.intro || service.summary}
          </p>
        </Container>
      </section>

      <section className="bg-ivory paper-grain">
        <Container className="py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div>
              <h2 className="eyebrow text-ink-60">
                {service.detail ? "Our approach" : "What this covers"}
              </h2>
              {service.detail && (
                <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-charcoal">
                  {service.detail}
                </p>
              )}
              {(service.items || []).length > 0 && (
                <ul className="mt-6 divide-y divide-line-light border-t border-line-light">
                  {(service.items || []).map((item) => (
                    <li
                      key={item}
                      className="flex gap-4 py-4 text-[17px] leading-relaxed text-charcoal"
                    >
                      <span
                        aria-hidden
                        className="mt-3 h-px w-5 shrink-0 bg-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border-y-2 border-obsidian bg-stone p-5 sm:p-7">
                <h2 className="font-serif text-[24px] leading-snug text-obsidian">
                  Discuss this matter
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-charcoal/80">
                  Start a conversation with the enquiry form, this practice
                  area will be preselected so your message is routed to the
                  relevant counsel.
                </p>
                <div className="mt-6">
                  <ButtonLink
                    to={`/contact?matter=${encodeURIComponent(service.title)}`}
                    variant="gold"
                    withArrow
                    className="w-full"
                  >
                    Enquire about this service
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>

          {/* Cross links */}
          {others.length > 0 && (
            <div className="mt-20 border-t border-line-light pt-12">
              <p className="eyebrow text-gold-deep">Other practice areas</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {others.map((o) => (
                  <a
                    key={o.slug}
                    href={`#/services/${o.slug}`}
                    className="group border-t-2 border-charcoal/30 pt-4 transition-colors hover:border-gold-deep"
                  >
                    <span className="font-serif text-[13px] text-gold-deep">
                      {o.index_number || (o as any).index}
                    </span>
                    <h3 className="mt-1 font-serif text-[20px] text-obsidian group-hover:text-gold-deep">
                      {o.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[14px] text-ink-60">
                      {o.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
