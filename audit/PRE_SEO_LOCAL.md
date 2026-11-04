# Local pre-SEO and brand intro changes

Prepared locally only. No deployment, backend configuration, contact/auth changes or environment changes.

## URL and indexing decisions

The router still uses hashes. `/#/about`, detail views and legal views are not separately crawlable HTML documents. The sitemap therefore contains only the real root document. All view canonical/og:url values use `https://avancelawpartners.info/`, never fragments or invented `/about` URLs. Public views have unique client-rendered titles/descriptions, but initial HTML/social scrapers see the homepage metadata. Social previews for individual hash views cannot be guaranteed.

For independently indexed services/lawyers, propose a separate approved History API routing change with Cloudflare SPA handling and preferably prerendering/SSR per public route. Only then publish full pathname canonicals/sitemap/per-route social metadata. This work does not make that migration.

The prior Figma `robots.index = false` prevented public indexing. The local production configuration now permits indexing. Admin/not-found views set client-side noindex. Robots blocks `/admin` and `/login`, but cannot block hash fragments because the server never receives them. No private routes are in the sitemap. Preview builds/hosts should remain noindex; before sharing a staging deployment enforce noindex at HTML/header level too. Authentication and backend authorization are still the privacy boundary.

## Intro motion and safety

The HTML shell paints a fixed navy (#101923) backdrop and the existing logo immediately, with two equal 69px gold segments separated by a 10px center gap. Left segment origin is right; right segment origin is left. Logo, divider and uppercase name fade/reveal in sequence. This near-black navy is confined to the intro/social/favicon assets; existing page colors/layout remain intact.

React's first AppShell layout effect dismisses the intro immediately, irrespective of fonts, images, API calls or animation progress. Fast loads may skip the later animation stages intentionally. There is no minimum dwell. Exit is 160ms and reduced-motion removal is immediate. It never runs again on hash navigation. The overlay is aria-hidden, inert, non-interactive and fixed, with no body lock or document layout changes. CSS hides it after four seconds if startup fails, and noscript hides it immediately. Missing logo leaves the brand text fallback. This is a fail-safe ceiling, not a loading delay.

Any fullscreen intro can affect perceived paint. No field CWV improvement or zero LCP impact is claimed. Measure the actual deployed experience later with real images/network and PageSpeed/CrUX. The page and hero are never gated behind image decode or a timer.

## Assets and performance

The supplied PNG is preserved. WebP logo derivatives reduce header/footer transfer from about 902kB to about 39kB; the intro derivative is about 26kB. The favicon uses a cropped authentic ALP monogram flattened to the existing gold #c9a227. favicon.svg is self-contained with an embedded 256px PNG, not a newly invented vector logo. Dedicated 16/32 PNG and multi-size ICO fallbacks are supplied. The asset generation script records the crop and can reproduce all derivatives using Pillow.

Social card is 1200x630, combining the real logo with existing business name/location. LegalService JSON-LD includes only supplied name, founding year, website/logo/image and office address. No ratings, awards, client counts, hours, geocoordinates or lawyer credentials were added.

Logo dimensions reserve their shape. Footer logo is lazy decoded. The first hero image retains eager/high priority; subsequent carousel frames no longer acquire high priority when activated. Existing descriptive alt text and portrait loading are preserved. Fonts use existing swap configuration plus preconnect hints.

## Sources

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/url-structure
- https://web.dev/articles/lcp

Required checks: pnpm.cmd typecheck; pnpm.cmd test; pnpm.cmd build.

## Changed and added files

- `index.html`: immediate intro shell/styles, static canonical, favicon references, preconnects, social fields and LegalService JSON-LD.
- `.figma/make/site.json`: factual homepage title/description, social card and production indexing policy.
- `src/App.tsx`: initial commit readiness and SEO-only private-page wrapper.
- `src/brandIntro.ts`: one-time dismissal and logo failure fallback.
- `src/components/SEOHead.tsx`, `src/lib/seo.ts`: public view metadata, canonical, robots and social tag updates.
- `src/components/Logo.tsx`, `src/pages/Home.tsx`: logo derivative/dimensions/lazy footer and stable first-image priority.
- `public/robots.txt`, `public/sitemap.xml`: real crawlable root only, no private/hash sitemap entries.
- `scripts/generate-brand-assets.py`: reproducible derivatives from real logo.
- `public/favicon.svg`, `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`.
- `public/images/avance-law-partners-logo.webp`, `public/images/avance-law-partners-intro.webp`, `public/images/social-card.png`.
- `tests/seo.test.mjs`: canonical, unique titles, metadata deduplication and private/public indexing regression checks.
- `audit/PRE_SEO_LOCAL.md`, `audit/pre-seo-local-checks.json`: change record and bounded local QA evidence.
- `dist/` was regenerated by the required build; it has not been deployed.

## Completed verification

pnpm.cmd typecheck passed; pnpm.cmd test passed all eight tests; pnpm.cmd build passed. Isolated local Chromium checked 320/390/768/1440px without horizontal overflow, 13 public/detail/admin/not-found views, consistent single canonical, unique public titles, valid LegalService JSON, reduced motion, one-time intro and CSS startup-failure timeout. Divider segments measured exactly 69px each with a 10px middle gap. Screenshots visually reviewed for mobile intro, social card and 16/32 favicon derivatives. External image/font/API requests were intercepted; no backend requests were sent. This does not establish real-network CWV scores.

38 protected files covering frontend environment, Supabase, contact validation/form, admin/auth files and the new backend's migrations/config/function/README retained their prior hashes. The new backend directory was not modified. No production environment, Cloudflare or DNS change was made.
