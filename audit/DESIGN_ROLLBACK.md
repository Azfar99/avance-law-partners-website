# Design rollback, technical fixes retained

Requested on 30 October 2026 after review of the first redesign.

## Current visual baseline

The original presentation from `audit/before-ui-refresh.zip` has been restored across every public page and shared visual component: homepage sections, hero carousel, audience cards, introduction, services rail, approach, contact invitation, footer, lawyers directory, individual lawyer profiles, service pages, legal pages, buttons, type scale, padding, decorative frames and theme colours.

The theme now matches that original backup, including Obsidian `#141414`, Gold `#C9A227`, Ivory `#F6F1E4`, Charcoal `#2B2B2B`, original body font size 17px and original breakpoints. The later redesign's homepage lawyer preview and mouse colour reveal are no longer part of the public homepage.

The original copy is restored where it accompanied the design; the prior no-EM-dash constraint is preserved with equivalent punctuation. Draft legal content is still labelled accurately.

## Technical improvements preserved

- Filtered deferred update/delete and protection against unfiltered mutations.
- Authentication/network failure handling, production preview-login restriction and auth notification fixes.
- Published/draft/empty content rules and preservation of stored lawyer edits.
- Enquiry normalization, validation limits, duplicate-submission guard, confirmed acknowledgement, sending state and error recovery.
- Correct service preselection, first-invalid focus and autocomplete/required semantics.
- Skip-link, route focus/scroll, exact detail-route matching and 404 fixes.
- Lazy admin imports, Suspense, root error recovery and SEO metadata fixes.
- Image-error fallback in the original portrait frame.
- Mobile menu keyboard containment, Escape, focus restoration and desktop-resize cleanup, using the original header/menu structure and styling.
- Duplicate translation-key fix and form/error translations.
- Admin mutation error feedback, accessible notifications/login labels and modal confirmation handling, with original presentation restored.

## Verification

- AST comparison confirms identical original/current className expressions in 13 key public pages/shared components; see `rollback-style-checks.json`.
- Nine core technical files were compared byte-for-byte against the pre-rollback snapshot and were unchanged: Supabase, router, SEO, storage, auth, contact validation, App, SEOHead and useReveal.
- Other mixed files retain their technical logic with original JSX styling restored.
- `pnpm typecheck`, six critical-flow automated tests and production build pass.
- 69 browser route/viewport cases passed at 320px, 768px and 1440px; see `rollback-route-checks.json`.
- Three lawyer profiles, eight service details, every public index/legal page and invalid routes were checked.
- Follow-up after the responsive review restored the original mobile menu wrapper and reveal visibility rule exactly; TypeScript and production build pass on that source.
- Contact validation/preselection were exercised without sending an enquiry.
- Published as version 2 at the same public URL; anonymous HTTP 200 and the new asset hash were confirmed. Mobile lawyer cards and disabled preview admin routes were checked on the published site.

The latest mobile-menu wrapper adjustment is in the local preview. The hosted version 2 predates that final adjustment and needs a new publication to carry it.

The old audit/implementation reports describe the earlier redesign and are historical. This note supersedes their visual implementation status. Backend launch-readiness limitations in those reports still apply.

Recovery copies: original source in `before-ui-refresh.zip`; the full improved source before this visual rollback in `before-design-rollback.zip`.
