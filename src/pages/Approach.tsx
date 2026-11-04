import { approach } from "../lib/content";
import { ButtonLink, Container, Eyebrow, Reveal } from "../components/ui";
import { Breadcrumb } from "../components/parts";
import SEOHead from "../components/SEOHead";
import { usePageContent } from "../lib/hooks";

export default function Approach() {
  const { content } = usePageContent("home");

  return (
    <>
      <SEOHead title="Our Approach" description="Our responsive, practical, and commercially sound approach to legal practice." />
      {/* Full-bleed typographic manifesto, the three principles ARE the hero */}
      <section className="relative overflow-hidden bg-obsidian text-ivory">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-line-dark lg:block"
        />
        <Container className="pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="[&_a]:text-ivory/55 [&_a:hover]:text-ivory [&_[aria-current]]:text-ivory/90 [&_span]:text-ivory/25">
            <Breadcrumb trail={[{ label: "Home", to: "/" }, { label: "Our approach" }]} />
          </div>
          <p className="eyebrow mt-10 text-gold">How we work</p>
          <h1 className="mt-8 font-serif text-[clamp(2.8rem,9vw,7.5rem)] font-medium leading-[0.98] tracking-[-0.02em]">
            <span className="block text-ivory">Responsive.</span>
            <span className="block text-gold">Practical.</span>
            <span className="block text-ivory/40">
              Commercially<span className="text-ivory"> sound.</span>
            </span>
          </h1>
          <p className="mt-12 max-w-xl text-[19px] leading-relaxed text-ivory/70 lg:ml-auto lg:text-right">
            {content.approach_statement || approach.statement}
          </p>
        </Container>
      </section>

      {/* Principles as a numbered ledger, alternating alignment */}
      <section className="bg-ivory">
        <Container className="py-24 lg:py-32">
          {approach.principles.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={p.title}>
                <div
                  className={`grid items-start gap-6 border-t border-line-light py-12 lg:grid-cols-12 lg:gap-10 lg:py-16 ${
                    flip ? "" : ""
                  }`}
                >
                  <div className={`lg:col-span-2 ${flip ? "lg:order-3" : ""}`}>
                    <span className="font-serif text-[clamp(3rem,6vw,5rem)] leading-none text-gold-deep/30">
                      0{i + 1}
                    </span>
                  </div>
                  <h2
                    className={`display-section text-obsidian lg:col-span-4 ${
                      flip ? "lg:order-2 lg:text-right" : ""
                    }`}
                  >
                    {p.title}
                  </h2>
                  <p
                    className={`max-w-xl text-[19px] leading-relaxed text-charcoal/85 lg:col-span-6 ${
                      flip ? "lg:order-1" : ""
                    }`}
                  >
                    {p.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </Container>
      </section>

      {/* Two-tone split CTA */}
      <section className="grid md:grid-cols-2">
        <div className="bg-obsidian px-6 py-16 text-ivory sm:px-10 lg:px-16 lg:py-24">
          <Eyebrow tone="light">Map it to your matter</Eyebrow>
          <h2 className="display-section mt-4 max-w-sm text-ivory">
            See which practice area fits.
          </h2>
          <div className="mt-8">
            <ButtonLink to="/services" variant="outline-light" size="lg" withArrow>
              View services
            </ButtonLink>
          </div>
        </div>
        <div className="bg-gold px-6 py-16 text-obsidian sm:px-10 lg:px-16 lg:py-24">
          <p className="eyebrow text-obsidian/70">Start a conversation</p>
          <h2 className="display-section mt-4 max-w-sm text-obsidian">
            Tell us what you are facing.
          </h2>
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
      </section>
    </>
  );
}
