# Mobile lawyer directory

The mobile horizontal rail, snap scrolling, swipe hint, progress bar and scroll handler have been removed. Published lawyer data now fills two grid columns: 1–2, 3–4, 5–6. The current three profiles appear as 2 + 1. No lawyer content or backend configuration was edited.

Changed implementation files:
- `src/pages/Lawyers.tsx`: grid markup and carousel cleanup; compact mobile profile-link label and scoped styling hooks.
- `src/pages/lawyers.css`: styles restricted to widths below 768px. Smaller spacing/type/badges, aligned actions, immediately visible cards, two-line professional-title preview, and biography available through the full profile. Intro spacing is reduced on mobile so the first pair of cards fits in a typical portrait viewport. Portrait proportions remain 4:5.

Validation:
- `pnpm.cmd typecheck`, `pnpm.cmd test` (10 passing tests), `pnpm.cmd build`.
- Local Chromium widths: 320, 360, 390, 430, 640, 767, 768, 1024 and 1440.
- Two columns below 1024px; original three-column stagger at 1024px+.
- No card, grid or document horizontal overflow; no swipe hint remains; full-profile navigation works.
- Desktop 1440px card positions, dimensions, padding, borders, background and name sizes match the pre-change baseline exactly.
- Six mocked fixtures produce 2 + 2 + 2 rows; fixtures were never saved to application content.
- All external/API requests intercepted. No Supabase calls were sent. External fonts were blocked; approved local portrait assets were used.

Machine-readable results: `audit/lawyer-grid-checks.json`.

Only the separate public client-preview Site is authorized for publishing. Production, opening animation, SEO metadata, contact/authentication and the isolated Supabase backend workspace remain unchanged.
