const logoSrc = "/images/avance-law-partners-logo.webp"

// Compact header brand using the supplied Avance Law Partners artwork.
export function LogoLockupCompact({ onLight = false }: { onLight?: boolean }) {
  return (
    <span data-no-translate className="inline-flex min-w-0 items-center gap-2 max-[360px]:gap-1 sm:gap-3">
      <span className="block h-[52px] w-[52px] shrink-0 max-[360px]:h-10 max-[360px]:w-10 sm:h-[58px] sm:w-[58px] lg:h-[65px] lg:w-[65px]">
        <img
          src={logoSrc}
          alt=""
          width={320}
          height={320}
          aria-hidden
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={`whitespace-nowrap font-serif text-[16px] font-medium tracking-[0.02em] max-[360px]:text-[14px] sm:text-[19px] ${
            onLight ? "text-obsidian" : "text-ivory"
          }`}
        >
          Avance Law Partners
        </span>
        <span
          className={`mt-[3px] whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.22em] max-[360px]:text-[7px] sm:text-[10px] sm:tracking-[0.28em] ${
            onLight ? "text-ink-60" : "text-gold"
          }`}
        >
          Est. 1998 · Dhaka
        </span>
      </span>
    </span>
  )
}

// Full supplied lockup for the footer.
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoSrc}
      alt="Avance Law Partners"
      width={320}
      height={320}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-[168px] select-none ${className}`}
    />
  )
}
