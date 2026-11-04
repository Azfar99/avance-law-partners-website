import { useState, type ReactNode } from "react";
import { lawyers, type Lawyer } from "../lib/content";
import type { DBLawyer } from "../lib/hooks";
import { AppLink, InlineLink } from "./ui";

export function ContentStatus({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="py-6 text-[16px] text-ink-60">
      <p role="status">{message}</p>
      {retry && (
        <button type="button" onClick={retry} className="mt-2 min-h-11 underline underline-offset-4">
          Try again
        </button>
      )}
    </div>
  );
}

/* ---------- Breadcrumb ---------- */

export function Breadcrumb({
  trail,
}: {
  trail: { label: string; to?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-ink-60">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.to ? (
              <AppLink
                to={item.to}
                className="transition-colors hover:text-charcoal"
              >
                {item.label}
              </AppLink>
            ) : (
              <span className="text-charcoal" aria-current="page">
                {item.label}
              </span>
            )}
            {i < trail.length - 1 && <span aria-hidden className="text-line-light">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Portrait placeholder (neutral, per brief) ---------- */

export function PortraitPlaceholder({
  lawyer,
  loading = "lazy",
}: {
  lawyer: Lawyer | DBLawyer
  loading?: "eager" | "lazy"
}) {
  const initials = "initials" in lawyer && lawyer.initials
    ? lawyer.initials
    : lawyer.name
      ? lawyer.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "AP";
  
  const photoUrl = "photo_url" in lawyer ? lawyer.photo_url : undefined;
  const [failedSource, setFailedSource] = useState("");
  const hasPhoto = photoUrl && failedSource !== photoUrl;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#d7cdb8] via-stone to-[#bbb09b]">
      <span aria-hidden className="absolute inset-[12px] border border-obsidian/10 z-10" />
      {hasPhoto ? (
        <img
          src={photoUrl}
          onError={() => setFailedSource(photoUrl)}
          alt={lawyer.name}
          loading={loading}
          decoding="async"
          fetchPriority={loading === "eager" ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[clamp(3rem,7vw,5rem)] text-charcoal/25">
            {initials}
          </span>
        </div>
      )}
      {/* Neutral placeholder marker until an approved photograph is supplied */}
      {!hasPhoto && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-obsidian/80 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-ivory/70 z-10">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          Portrait pending
        </div>
      )}
    </div>
  );
}

/* ---------- Lawyer card ---------- */

export function LawyerCard({
  lawyer,
  reviewMode = false,
}: {
  lawyer: Lawyer | DBLawyer;
  reviewMode?: boolean;
}) {
  const placeholderLabel = "placeholderLabel" in lawyer ? lawyer.placeholderLabel : "Draft Lawyer";
  const displayName = lawyer.published
    ? lawyer.name
    : reviewMode
      ? placeholderLabel
      : "";
  return (
    <article className="group flex flex-col">
      <div className="overflow-hidden rounded-[6px]">
        <div className="transition-transform duration-500 group-hover:scale-[1.02]">
          <PortraitPlaceholder lawyer={lawyer} />
        </div>
      </div>
      <div className="mt-5">
        {!lawyer.published && reviewMode && (
          <span className="mb-2 inline-block rounded-[4px] border border-gold/50 bg-gold/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-deep">
            Draft · unpublished
          </span>
        )}
        <h3 className="font-serif text-[26px] font-semibold leading-tight text-obsidian">
          {displayName || <span className="text-ink-60">Name to be confirmed</span>}
        </h3>
        {lawyer.designation ? (
          <p className="mt-2 text-[12px] font-semibold tracking-[0.06em] text-gold-deep">{lawyer.designation}</p>
        ) : null}
        {"professional_title" in lawyer && lawyer.professional_title ? (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-60">{lawyer.professional_title}</p>
        ) : null}
        <div className="mt-4">
          <InlineLink to={`/lawyers/${lawyer.slug}`}>View profile</InlineLink>
        </div>
      </div>
    </article>
  );
}

/* ---------- Public lawyer list (only published records render publicly) ---------- */

export function publishedLawyers() {
  return lawyers.filter((l) => l.published);
}

/* ---------- Section heading block ---------- */

export function SectionHead({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  const titleColor = tone === "light" ? "text-ivory" : "text-obsidian";
  const bodyColor = tone === "light" ? "text-ivory/70" : "text-charcoal/80";
  const eyebrowColor = tone === "light" ? "text-gold" : "text-gold-deep";
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow mb-4 ${eyebrowColor}`}>{eyebrow}</p>}
      <h2 className={`display-section ${titleColor}`}>{title}</h2>
      {children && (
        <div className={`mt-5 text-[17px] leading-relaxed ${bodyColor}`}>{children}</div>
      )}
    </div>
  );
}
