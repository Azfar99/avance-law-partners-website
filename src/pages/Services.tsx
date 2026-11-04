import { useState } from "react";
import { Plus } from "lucide-react";
import { useServices, type DBService } from "../lib/hooks";
import { Container, InlineLink, Reveal } from "../components/ui";
import { Breadcrumb, ContentStatus } from "../components/parts";
import { useHeroTone } from "../lib/chrome";
import SEOHead from "../components/SEOHead";

function ServiceRow({
  service,
  open,
  onToggle,
}: {
  service: DBService;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `svc-panel-${service.slug}`;
  const btnId = `svc-btn-${service.slug}`;
  return (
    <div
      className={`border-b border-line-light transition-colors ${
        open ? "bg-ivory" : ""
      }`}
    >
      <div className="flex items-start gap-4 py-6 sm:items-center sm:gap-6">
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="control-parent flex flex-1 cursor-pointer items-start gap-4 text-left sm:items-center sm:gap-6"
        >
          <span className="mt-1 font-serif text-[15px] text-gold-deep sm:mt-0">
            {service.index_number || (service as any).index}
          </span>
          <span className="flex-1">
            <span className="block font-serif text-[22px] leading-snug text-obsidian sm:text-[27px]">
              {service.title}
            </span>
            <span className="mt-1 block max-w-2xl text-[15px] leading-relaxed text-ink-60">
              {service.summary}
            </span>
          </span>
          <span
            aria-hidden
            className="action-mark mt-1 sm:mt-0"
          >
            <Plus aria-hidden size={18} strokeWidth={1.8} className={open ? "rotate-45" : ""} />
          </span>
        </button>
      </div>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open}>
        <div className="overflow-hidden pb-8 pl-0 sm:pl-11">
          {service.intro && (
            <p className="mb-4 max-w-2xl text-[16px] leading-relaxed text-charcoal/85">
              {service.intro}
            </p>
          )}
          <ul className="grid max-w-3xl gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {(service.items || []).map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[15px] leading-relaxed text-charcoal/85"
              >
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <InlineLink to={`/services/${service.slug}`}>View service</InlineLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  useHeroTone("light");
  const { services: displayServices, loading, loadFailed, refresh } = useServices();

  const [selectedSlug, setOpenSlug] = useState<string | null | undefined>(undefined);
  const openSlug = selectedSlug === undefined ? displayServices[0]?.slug : selectedSlug;

  return (
    <section className="bg-stone">
      <SEOHead
        title="Legal Practice Areas & Services"
        description="Comprehensive legal counsel covering corporate law, commercial transactions, arbitration, energy regulatory, and litigation in Dhaka, Bangladesh."
        canonicalPath="/services"
      />
      <Container className="pb-24 pt-32 lg:pb-32 lg:pt-40">
        <div className="[&_[aria-current]]:text-charcoal">
          <Breadcrumb trail={[{ label: "Home", to: "/" }, { label: "Services" }]} />
        </div>

        {/* Masthead: oversized count + intro on a warm stone canvas */}
        <div className="mt-10 grid items-end gap-8 border-b-2 border-obsidian pb-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-gold-deep">Practice areas</p>
            <h1 className="mt-4 max-w-2xl font-serif text-[clamp(2.2rem,5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.01em] text-obsidian">
              Legal services, focused on your objectives.
            </h1>
          </div>
          <div className="flex items-baseline gap-2 lg:flex-col lg:items-end lg:text-right">
            <span className="font-serif text-[clamp(4rem,10vw,7rem)] leading-none text-gold-deep">
              {loading || loadFailed ? "—" : String(displayServices.length).padStart(2, "0")}
            </span>
            <span className="text-[13px] uppercase tracking-[0.18em] text-ink-60">
              practice areas
            </span>
          </div>
        </div>

        {/* Editorial two-column: sticky guide + accordion ledger */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="max-w-xs text-[16px] leading-relaxed text-charcoal/80">
              Corporate and commercial matters, contracts, regulatory issues,
              litigation and dispute resolution, expand any area to see what it
              includes.
            </p>
            {displayServices.length > 0 && <p className="mt-6 text-[13px] uppercase tracking-[0.16em] text-ink-60">
              Index 01, {displayServices.length < 10 ? `0${displayServices.length}` : displayServices.length}
            </p>}
          </aside>

          <div className="border-t border-line-light">
            {loading ? <ContentStatus message="Loading practice areas…" /> :
              loadFailed ? <ContentStatus message="Practice areas could not be loaded." retry={refresh} /> :
              displayServices.length === 0 && <ContentStatus message="There are currently no published practice areas." />}
            {displayServices.map((s) => (
              <Reveal key={s.slug}>
                <ServiceRow
                  service={s}
                  open={openSlug === s.slug}
                  onToggle={() => setOpenSlug(openSlug === s.slug ? null : s.slug)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
