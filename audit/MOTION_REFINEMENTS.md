# Branded intro and About statistics — local verification

Scope: branded opening and existing About statistics. Production deployment is not authorized. A separate, existing client-preview Site can be updated. The user's latest request replaces readiness-driven loading with a deliberate one-second document opening.

## Implementation

- `index.html`: immediate pure-black opening, original transparent gold logo and responsive 480/960 WebP sources. ALP/AVANCE fade in over 220ms; the original LAW PARTNERS/dashes slide upward 8px over 420ms after a 180ms lead. Full logo settles before the 200ms exit at 800ms. The normal website now displays this one-second sequence on every document load/reload, independently of React/data readiness. Internal route navigation does not replay it.
- `scripts/brand-opening-controller.js`: shared inline controller starts before React, waits at most 450ms for logo decoding, and caps all opening activity at 1500ms. Slow/missing images, reduced motion, tab hiding, Escape, Tab or tapping the opening skip it safely. Underlying app renders in parallel and is inert only while the opening is active; all exit paths restore interaction. CSS expiration and noscript provide additional fallbacks.
- `src/App.tsx`: removed the AppShell readiness dismissal. The obsolete `src/brandIntro.ts` module was deleted. The opening is no longer a loading-status indicator.
- `scripts/generate-brand-assets.py`: deterministic intro sizes from the original 1254px RGBA brand asset, without cropping or recoloring. New WebP assets are 75,364 and 223,664 bytes. The footer logo is unchanged.
- `scripts/generate-intro-preview.mjs`, `public/brand-intro-preview.html`: build injects the shared inline controller into index.html and generates a noindex Replay page with the exact same one-second sequence. No separate 1.7s demonstration delay remains. The main website URL is sufficient to review the opening by reloading.
- `src/pages/About.tsx`, `src/components/AboutStatistics.tsx`, `src/components/about-statistics.css`, `src/lib/statistics.ts`: use the same `useLawyers` published-data hook as the Lawyers page; wait for lawyer/settings loading to settle. Viewport-triggered 900ms ease-out counters run once per mount. Final values are provided to screen readers, intermediate numerals are hidden from them, and reduced motion displays final values immediately. Dhaka has a restrained 4px fade/reveal.
- `tests/statistics.test.mjs`: regression coverage for repeated entries, shipped lawyer counts, empty data and establishment-year calculation.

## Content calculation

- Establishment year: 1998. At verification in 2026: 2026 − 1998 = 28 years.
- Shipped published lawyer content: Israt 14 + Farzana 14 + Fakhrul 15 = **43 practice-area entries**. Entries repeated across lawyers are counted separately. This is not the number of unique services. Actual successful backend results remain authoritative through the existing hook; a genuinely empty published list displays 0.

## Verification

- `pnpm.cmd typecheck`, `pnpm.cmd test` (10 passing tests), `pnpm.cmd build`.
- Isolated local Chromium checks at widths 320, 360, 390, 768, 1024 and 1440; no horizontal overflow.
- DPR3 mobile selects the 960px logo; pure black verified. Latest logo-only revision verified at 320, 390, 768 and 1440px, including aligned final layers, hidden initial signature, replay, reduced motion, image failure and JavaScript-disabled fallback. No separate divider or brand-name text remains.
- Earlier statistics checks covered viewport count progression, stable values after scrolling away/back and empty published-lawyer responses. Latest opening checks cover timing, normal reload replay, internal-navigation non-replay, slow application JS, image failure/timeout, keyboard/tap skip, reduced motion, disabled JavaScript and controller-failure CSS fallback.
- Browser QA intercepts all external requests, with backend responses mocked. No Supabase requests were sent. This verifies local UI behavior, not live database contents, email delivery or field Core Web Vitals.
- Machine-readable details: `audit/opening-checks.json` (current opening); `audit/motion-local-checks.json` and `audit/intro-signature-checks.json` retain historical checks of previous versions.

## Timing rationale

There is no universal mandatory branded-intro duration. The selected 1000ms playback is a design choice following the user's request; it includes the exit rather than adding a second delay. Nielsen Norman Group identifies roughly one second as a threshold for preserving thought flow and advises considering animation frequency. This is not a claim that it recommends an intro screen for every website. Hard asset/deadline limits and internal-navigation non-replay keep the interruption bounded.

- https://www.nngroup.com/articles/response-times-3-important-limits/
- https://www.nngroup.com/articles/animation-usability/

No changes are required to routing, authentication, contact submission, Supabase configuration, environment files, DNS or the separate new-backend workspace.
