import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { useLawyer } from "../lib/hooks";
import { ButtonLink, Container, InlineLink } from "../components/ui";
import { Breadcrumb, ContentStatus, PortraitPlaceholder } from "../components/parts";
import { NotFound } from "./NotFound";
import { useHeroTone } from "../lib/chrome";
import SEOHead from "../components/SEOHead";

export default function LawyerProfile({ slug }: { slug: string }) {
  useHeroTone("light");
  const { lawyer, loading, loadFailed, refresh } = useLawyer(slug);

  if (loading) {
    return (
      <section className="min-h-[50vh] flex items-center justify-center bg-ivory">
        <p className="text-sm font-serif text-charcoal/50">Loading profile...</p>
      </section>
    );
  }

  if (loadFailed) return (
    <section className="min-h-[50vh] bg-ivory pt-32">
      <SEOHead title="Profile temporarily unavailable" canonicalPath="/404" />
      <Container><ContentStatus message="This profile could not load. Please try again." retry={refresh} /></Container>
    </section>
  );
  if (!lawyer) return <NotFound />;

  const displayName = lawyer.name || "Advocate";
  const initials = lawyer.name ? lawyer.name.charAt(0) : "A";

  return (
    <section className="relative overflow-hidden bg-ivory paper-grain">
      <SEOHead
        title={`${displayName} | Legal Counsel`}
        description={`${displayName}${lawyer.designation ? ` - ${lawyer.designation}` : ""} at Avance Law Partners, Dhaka, Bangladesh.`}
        canonicalPath={`/lawyers/${lawyer.slug}`}
      />
      <span
        aria-hidden
        className="absolute -right-8 top-24 font-serif text-[clamp(12rem,33vw,32rem)] leading-none text-obsidian/[.035]"
      >
        {initials}
      </span>
      <Container className="pb-24 pt-32 lg:pb-32 lg:pt-40">
        <Breadcrumb
          trail={[
            { label: "Home", to: "/" },
            { label: "Lawyers", to: "/lawyers" },
            { label: displayName },
          ]}
        />

        <div className="relative mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="aspect-[4/5] overflow-hidden rounded border border-line-light bg-stone">
              <PortraitPlaceholder lawyer={lawyer} loading="eager" />
            </div>
          </div>

          <div className="border-t-2 border-obsidian pt-7">
            {!lawyer.published && (
              <span className="mb-4 inline-block border-y border-gold/50 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                Draft · unpublished record
              </span>
            )}
            <h1 className="display-hero text-obsidian">{displayName}</h1>
            {lawyer.designation && (
              <p className="mt-4 text-[13px] font-semibold tracking-[0.08em] text-gold-deep">{lawyer.designation}</p>
            )}
            {lawyer.professional_title && (
              <p className="mt-2 max-w-2xl text-[16px] font-medium leading-relaxed text-ink-60">{lawyer.professional_title}</p>
            )}

            {/* Biography */}
            <div className="mt-8 max-w-xl border-t border-line-light pt-8 text-[17px] leading-relaxed text-charcoal/80 space-y-4">
              {lawyer.biography ? (
                <p className="whitespace-pre-line">{lawyer.biography}</p>
              ) : (
                <p className="italic text-ink-60">
                  Detailed professional background and case highlights are maintained directly through chamber administration.
                </p>
              )}
            </div>

            {/* Qualifications & Memberships */}
            {((lawyer.education && lawyer.education.length > 0) ||
              (lawyer.qualifications && lawyer.qualifications.length > 0) ||
              (lawyer.practice_areas && lawyer.practice_areas.length > 0) ||
              lawyer.chamber_address ||
              (lawyer.court_memberships && lawyer.court_memberships.length > 0) ||
              (lawyer.bar_memberships && lawyer.bar_memberships.length > 0)) && (
              <div className="mt-10 border-t border-line-light pt-8 space-y-6">
                {lawyer.education && lawyer.education.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Education</h2>
                    <ul className="space-y-1">
                      {lawyer.education.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-charcoal">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lawyer.qualifications && lawyer.qualifications.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Professional Credentials</h2>
                    <ul className="space-y-1">
                      {lawyer.qualifications.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-charcoal">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lawyer.practice_areas && lawyer.practice_areas.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Practice Areas</h2>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {lawyer.practice_areas.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 rounded-[4px] border border-line-light bg-white/45 px-3 py-2.5 text-sm font-medium leading-relaxed text-charcoal"
                        >
                          <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lawyer.chamber_address && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Office</h2>
                    <p className="max-w-xl text-sm font-medium leading-relaxed text-charcoal">{lawyer.chamber_address}</p>
                  </div>
                )}

                {lawyer.court_memberships && lawyer.court_memberships.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Court Memberships</h2>
                    <ul className="space-y-1">
                      {lawyer.court_memberships.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-charcoal">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lawyer.bar_memberships && lawyer.bar_memberships.length > 0 && (
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">Bar Memberships</h2>
                    <ul className="space-y-1">
                      {lawyer.bar_memberships.map((item, idx) => (
                        <li key={idx} className="text-sm font-medium text-charcoal">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Direct Contact Links */}
            {(lawyer.email || lawyer.phone || lawyer.linkedin) && (
              <div className="mt-8 border-t border-line-light pt-6 flex flex-wrap gap-4 text-xs">
                {lawyer.email && (
                  <a href={`mailto:${lawyer.email}`} className="inline-flex items-center gap-2 font-semibold text-charcoal hover:text-gold-deep">
                    <Mail aria-hidden size={15} strokeWidth={1.7} /> {lawyer.email}
                  </a>
                )}
                {lawyer.phone && (
                  <a href={`tel:${lawyer.phone.split(/[,;/]/)[0].trim().replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 font-semibold text-charcoal hover:text-gold-deep">
                    <Phone aria-hidden size={15} strokeWidth={1.7} /> {lawyer.phone}
                  </a>
                )}
                {lawyer.linkedin && (
                  <a href={lawyer.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-gold-deep hover:underline">
                    LinkedIn Profile <ArrowUpRight aria-hidden size={14} strokeWidth={1.7} />
                  </a>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink to="/contact" variant="gold" withArrow>
                Make an enquiry
              </ButtonLink>
              <InlineLink to="/lawyers">Back to all lawyers</InlineLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
