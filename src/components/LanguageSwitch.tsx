import { useLanguage } from "../lib/i18n"

export function LanguageSwitch({
  className = "",
}: {
  className?: string
}) {
  const { language, setLanguage } = useLanguage()
  const nextLanguage = language === "en" ? "bn" : "en"

  return (
    <button
      data-no-translate
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-pressed={language === "bn"}
      aria-label={
        language === "en"
          ? "Switch website language to Bengali"
          : "Switch website language to English"
      }
      className={`inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-full border border-gold/55 bg-gold px-2 text-[11px] font-semibold tracking-[0.04em] text-obsidian shadow-[0_0_0_1px_rgba(201,164,58,0.08)] transition-colors hover:bg-[#d5ad25] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${className}`}
    >
      {language === "en" ? "EN" : "বাংলা"}
    </button>
  )
}
