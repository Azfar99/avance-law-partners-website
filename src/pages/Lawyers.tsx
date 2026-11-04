import { ArrowRight } from "lucide-react"
import { useLawyers, type DBLawyer } from "../lib/hooks"
import { AppLink, Container, Reveal } from "../components/ui"
import { Breadcrumb, ContentStatus, PortraitPlaceholder } from "../components/parts"
import { useHeroTone } from "../lib/chrome"
import SEOHead from "../components/SEOHead"
import "./lawyers.css"

function LawyerEntry({
  lawyer,
  n,
  offset,
}: {
  lawyer: DBLawyer
  n: number
  offset?: boolean
}) {
  return (
    <article
      className={`lawyer-entry h-full rounded-[10px] border border-obsidian/10 bg-white/45 p-3 shadow-[0_12px_36px_rgba(24,21,16,0.07)] transition-colors duration-300 hover:border-gold-deep/40 sm:p-4 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none md:hover:border-transparent ${offset ? "lg:mt-24" : ""}`}
    >
      <AppLink
        to={`/lawyers/${lawyer.slug}`}
        className="control-parent group block h-full rounded-sm focus-visible:outline-offset-4"
      >
        <div className="relative overflow-hidden rounded-[5px] border border-obsidian/10 bg-stone">
          <span className="lawyer-entry__index absolute left-3 top-3 z-10 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-gold/40 bg-obsidian/85 px-2 font-sans text-[11px] font-semibold tracking-[0.08em] text-gold shadow-sm">
            0{n}
          </span>
          <div className="transition-transform duration-500 group-hover:scale-[1.02]">
            <PortraitPlaceholder
              lawyer={lawyer}
              loading={n === 1 ? "eager" : "lazy"}
            />
          </div>
        </div>
        <div className="lawyer-entry__details mt-4 border-t border-obsidian/75 pt-4 md:mt-5 md:border-obsidian md:pt-4">
          {!lawyer.published && (
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-deep">
              Draft · unpublished
            </span>
          )}
          <h2 className="font-serif text-[clamp(1.35rem,6vw,1.75rem)] font-semibold leading-[1.12] tracking-[-0.01em] text-obsidian md:text-[28px]">
            {lawyer.name || (
              <span className="text-ink-60">Name to be confirmed</span>
            )}
          </h2>
          {lawyer.designation && (
            <p className="lawyer-entry__designation mt-2 text-[12px] font-semibold leading-relaxed tracking-[0.06em] text-gold-deep">{lawyer.designation}</p>
          )}
          {lawyer.professional_title && (
            <p className="lawyer-entry__professional mt-1 text-[13px] leading-relaxed text-ink-60">{lawyer.professional_title}</p>
          )}
          <p className="lawyer-entry__biography mt-3 min-h-11 line-clamp-2 text-[14px] leading-relaxed text-charcoal/75">
            {lawyer.biography ||
              "View the full professional profile and practice details."}
          </p>
          <span className="profile-action">
            <span className="md:hidden">View profile</span>
            <span className="hidden md:inline">View full profile</span>
            <ArrowRight aria-hidden className="ml-3 shrink-0" size={15} strokeWidth={1.7} />
          </span>
        </div>
      </AppLink>
    </article>
  )
}

export default function Lawyers() {
  useHeroTone("light")
  const { lawyers, loading, loadFailed, refresh } = useLawyers()
  const displayList = lawyers

  return (
    <section className="lawyer-directory bg-ivory">
      <SEOHead
        title="Our Lawyers & Legal Counsel"
        description="Direct access to experienced advocates and legal counsel at Avance Law Partners in Dhaka, Bangladesh."
        canonicalPath="/lawyers"
      />
      <Container className="lawyer-directory__container pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div className="[&_[aria-current]]:text-charcoal">
          <Breadcrumb
            trail={[{ label: "Home", to: "/" }, { label: "Lawyers" }]}
          />
        </div>

        {/* Editorial masthead with a rule and running head */}
        <div className="lawyer-directory__masthead mt-10">
          <div className="flex items-baseline justify-between border-b border-obsidian pb-4">
            <p className="eyebrow text-gold-deep">Our lawyers</p>
            <p className="text-[13px] uppercase tracking-[0.16em] text-ink-60">
              {!loading && !loadFailed && <>{displayList.length} profiles</>}
            </p>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-obsidian">
            The people behind the practice.
          </h1>
          <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-charcoal/80">
            Direct access to experienced counsel who stay close to your matter,
            from the first conversation through to resolution.
          </p>
        </div>

        {/* Two compact columns on mobile; existing editorial grid on desktop. */}
        {loading ? <ContentStatus message="Loading lawyer profiles…" /> :
          loadFailed ? <ContentStatus message="Lawyer profiles could not be loaded." retry={refresh} /> :
          displayList.length === 0 && <ContentStatus message="There are currently no published lawyer profiles." />}
        <div
          className="lawyer-grid mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-5 md:mt-16 md:gap-x-10 md:gap-y-14 lg:grid-cols-3"
          role="region"
          aria-label="Lawyer profiles"
        >
          {displayList.map((l, i) => (
            <Reveal
              key={l.slug}
              className="min-w-0"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <LawyerEntry lawyer={l} n={i + 1} offset={i === 1} />
            </Reveal>
          ))}
        </div>

        <p className="mt-20 max-w-2xl border-t border-line-light pt-8 text-[14px] leading-relaxed text-ink-60">
          Additional profiles, designations, and approved credentials can be
          updated directly by the firm administrator without technical
          modification.
        </p>
      </Container>
    </section>
  )
}
