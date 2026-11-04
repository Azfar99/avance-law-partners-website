Continue the established Avance visual language and shared components. Create the following responsive pages as coherent parts of one website. Keep the existing homepage direction; do not restart the design or add another visual style.

ABOUT /about

Use a quieter opening than the homepage: an ivory text area, a purposeful “Since 1998” treatment, supplied firm introduction and one architectural image. Explain the firm using the supplied scope of work. Include the approach statement and an introduction to the lawyers. Do not create a fictional history timeline, founding story or milestones beyond the supplied establishment year.

LAWYERS /lawyers

Create a directory with exactly the three initial review slots defined in Prompt 1. Use consistent 4:5 portraits, a clear name, optional supplied designation and a visible “View profile” link. Do not hide essential details behind hover. No search or complex filters are necessary for three initial lawyers. The design must accommodate additional profiles and long names without breaking.

LAWYER PROFILE /lawyers/[slug]

Create a reusable detail template: breadcrumb, portrait, name, optional designation, biography, practice areas and populated contact links. Below, show Education, Professional qualifications, Court memberships, Bar memberships, Experience, Languages and Additional information only when populated. Support LinkedIn and other approved social links. Hide empty sections without leaving large gaps. Use a dedicated page rather than placing a long biography in a small modal. Add related services only when explicitly assigned in the CMS.

SERVICES /services

Show all eight practice areas from Appendix A in their supplied order. Use an accessible accordion with exact titles, concise summaries and full included-service lists. Use the supplied High Court introduction where relevant. A service row has an expand button and a separate “View service” link; avoid nesting interactive controls. Include collapsed, expanded and focus states. On mobile use full-width stacked rows. Do not collapse or omit the source service details to make the layout appear cleaner.

SERVICE DETAIL /services/[slug]

Create one reusable template instantiated for all eight practices: breadcrumb, exact title, short introduction derived only from supplied service content, full scope list and a “Discuss this matter” action. That action opens Contact with the legal-matter field preselected. Show associated lawyers only where the CMS provides a relationship. Do not generate hypothetical case results, legal advice articles or invented sector experience.

OUR APPROACH /approach

Keep this concise. Use the supplied approach statement and the three principles Responsive / Practical / Commercially sound. Give each principle space to breathe. Do not make promises about turnaround times, outcomes or assigned staffing. Link to relevant services and the enquiry page. Keep Approach reachable from About, the homepage section and footer; preserve the simple primary navigation.

CONTACT /contact

Use a welcoming two-column layout: office details on the left, labelled form fields on the right. Stack naturally on mobile. Show the exact address from Prompt 1. Render phone, email, WhatsApp, office hours and other office information only when entered. Show a map preview or directions link only after an actual map location has been configured; do not infer precise coordinates. Load an interactive map on request, not automatically at page load.

Fields: Name, Email, Phone, Subject / Legal matter, Message. Name, Email, Subject and Message are required; Phone is optional. Service links can preselect the legal matter, which remains editable. Use “Send enquiry” consistently. Do not add file attachments to the initial form.

Design idle, focused, filled, invalid, submitting, success and failed-submission states. Example validation: “Enter a valid email address.” Preserve input after errors. Suggested confirmed-success copy: “Your enquiry has been received.” Show this only after a working backend accepts the submission; label simulated success in a prototype. Do not promise a response time without supplied policy. Include a brief firm-review placeholder for a contact/privacy notice near the form and a Privacy Policy link; do not invent final legal wording.

LEGAL PAGES AND EXCEPTION STATES

Provide readable Privacy Policy and Legal Disclaimer templates, and an optional Terms template. Their body copy is a clearly identified draft placeholder pending firm input, not invented completed legal documents. Include a functional 404 page with Home and Contact links. Include sensible content-unavailable and image-fallback states.

Demonstrate navigation among pages, menu open/close, profile navigation, service expansion, preselected contact subject and form states. Everything must remain usable by keyboard and touch.

## Prompt 3 — Complete admin dashboard and content ownership

Design the secure-admin experience and all content-editing workflows for Avance Law Partners. It must be usable by a nontechnical firm administrator. Every visible business detail and public-facing content label must have a clearly identified editable source. Use shared content records so changing the address updates Contact, footer and other uses consistently.

The admin should use a practical ivory workspace, dark sidebar, restrained gold actions and readable Manrope typography. Avoid ornamental hero typography and decorative motion in management screens. Prioritize clear labels, predictable forms and readable tables.

Create these screens:

- Login, logout, invalid credentials, expired session and password recovery states. A recovery link must have a real implementation or be labelled as a prototype dependency.
- Overview: Total lawyers, Total services, Enquiries and Recent enquiries. Seed counts from actual records: three initial lawyer records, eight service records and zero enquiries. Distinguish published from draft lawyer counts. Do not invent business analytics.
- Website settings: firm name, tagline, established year, full and compact logo assets, favicon, address, phone, email, WhatsApp, office hours, social links, map location, additional office information and footer text.
- Page editor: hero text/image, CTA labels/destinations, About copy, Approach copy, section titles, contact invitation, page images, navigation labels, public form labels/messages, section visibility and editable content on every public page. Use structured fields and repeatable blocks rather than a source-code editor.
- Lawyers: list, add, edit, preview, publish/hide, reorder and delete. Fields: name, slug, designation, photograph, biography, education, qualifications, practice areas, experience, court memberships, bar memberships, languages, email, phone, LinkedIn, other social links, additional information and visibility. Support keyboard reorder controls as well as drag handles. Initial internal placeholders are [AMMU'S NAME — ADMIN CAN EDIT], [YOUR NAME — ADMIN CAN EDIT], and Rishad. Keep missing facts empty; prevent incomplete placeholders from being accidentally published.
- Services: list, add, edit, preview, publish/hide, reorder and delete. Fields: title, slug, short description, full description, optional icon, included-service items, associated lawyers, display order and visibility. Seed every service and bullet in Appendix A. Icons are optional and should not force additional visual clutter.
- Enquiries: searchable list, filters, detail view, date/time, name, email, phone, subject, message and status. Statuses: New, Contacted, In Progress, Closed. Support status changes and delete confirmation. Start with a useful empty state: “No enquiries yet. New messages will appear here.” Do not populate with fabricated client data.
- Media library: upload, preview, replace, crop/focal point, alt text and usage references. Include invalid-format, upload-failed and oversized-file states. Warn before deleting media in active use. Replacing an image should retain the layout slot and crop controls.
- Legal content: Privacy Policy, Legal Disclaimer and optional Terms; title, body, publication state and updated date.
- SEO: per-page title, meta description, slug, Open Graph title/description/image and preview. Omit a required meta-keywords field. Use accurate content, descriptive URLs and one meaningful H1 per page; structured business data must use populated facts only.

Use tabs or clearly titled groups for long edit forms. Show Save draft, Preview and Publish distinctly. Include saved confirmation, unsaved-change warning, validation, loading, no-results, failed-save retry and delete-confirmation dialogs. Keep destructive actions separate from routine saving. Make simple copy and image updates possible without editing code.

Document content models and relationships: SiteSettings, Pages, Lawyers, Services, Media, Enquiries, LegalPages and page metadata. Include CMS-managed labels and shared content references. Layout rules and security logic belong in the application; administrators edit content through safe fields, not arbitrary scripts.

FUNCTIONAL BOUNDARY

In a design prototype, simulate workflows using labelled sample states. In a working application, require database persistence, server-enforced authorization on every admin operation, protected enquiry records and a supported authentication system with secure password handling and sessions. Never expose credentials or administrative secrets in client code. Do not claim that a login screen or browser storage constitutes secure authentication. Public form submissions may create enquiries but must never grant access to read other enquiries. Identify actual backend dependencies and test persistence after reload and access from a signed-out session before describing the admin as implemented.

## Prompt 4 — Motion and mouse reveal

Refine motion without changing the accepted layouts. The hero's “Window of Clarity” is the single signature interaction.

HERO REVEAL

Start with an already readable, gently desaturated architectural image. When a fine pointer moves within that image only, a soft elliptical window reveals its warmer natural color. Use two renderings of the same source image so there is no scene jump. Echo the logo's sweeping curve through the framing, not by deforming or replacing the logo. The reveal should feel like daylight moving across a surface, not a spotlight chasing the visitor across the entire website.

Use an approximately 240–320 px reveal area on desktop, with subtle smoothing. Limit updates to animation frames and stop tracking when the image is offscreen or the pointer leaves it. Keep it behind content and unable to intercept clicks. Never make text, navigation or essential image information dependent on discovering the reveal. Do not hide or replace the system cursor.

On touch and reduced-motion settings, display the complete warm image with no pointer effect. If masking is unsupported or performs poorly, fall back to a static image. Do not use WebGL, canvas animation or a continuous rendering engine for this effect. Profile the masked layer; simplify it if it causes visible lag.

OTHER MOTION

- Initial hero: headline, supporting copy, CTAs and image settle in once with a restrained 12–16 px movement and opacity transition. Total sequence approximately 700–900 ms, with 60–90 ms stagger. No loading screen; the page must be useful immediately and content must not remain hidden if scripting fails.
- Buttons: 160–200 ms color change; arrow moves up to 3 px. Do not move the whole button away from the pointer.
- Navigation: subtle underline or color transition, with equally clear focus state.
- Image hover: optional scale up to 1.02 in a clipped frame, no layout movement.
- Section entrance: at most 16 px movement over 350–450 ms, once per section; avoid animating every paragraph.
- Accordion: restrained 200–250 ms expansion; remain correct when content height changes.
- Mobile menu: 200–250 ms transition; reduced motion switches instantly.

Use one easing family, such as cubic-bezier(0.22, 1, 0.36, 1). Native scrolling stays intact. Do not introduce parallax, cursor trails, magnetic controls, horizontal scroll traps, looping decorative movement or animated counters.

In Figma Design, show rest, pointer-reveal, hover, focus, mobile and reduced-motion variants with implementation notes. Label simulations honestly; a fixed prototype hotspot is not continuous pointer tracking. In Figma Make, implement and test the actual behavior where supported.

## Prompt 5 — Responsive system and accessibility

Audit all public and admin pages at 1440, 1024, 768 and 390 px, with additional stress checks at 320 px and 200% zoom. Keep the visual direction while adapting the composition intentionally. Do not just shrink the desktop screen.

Desktop: broad reading spaces, composed image offsets and clear navigation. Tablet: collapse navigation before it collides with the brand, simplify multi-column layouts and preserve readable line lengths. Mobile: text-first hero, full-width usable actions where needed, shorter image, single-column service rows and portrait cards, stacked contact fields and accessible admin navigation.

Long names, eight practice titles, multi-line addresses, validation messages and expanded service content must wrap without clipping. Avoid horizontal page scrolling, truncation of important titles and fixed-height text containers. Do not force sticky controls onto short screens where they obscure content. Admin tables may use clearly labelled row summaries on mobile; retain access to all details and actions.

Create reusable components for header, mobile menu, footer, buttons, inline links, service rows, accordions, lawyer cards, breadcrumbs, form controls, select menus, textareas, alerts, dialogs, tabs, data tables, pagination, image upload, empty states, status labels and toasts. Include light/dark context and default/hover/focus/pressed/disabled/loading/error states where relevant. Restyle components completely to match Avance; do not leave default library styling.

Use semantic headings and landmarks, a skip link, persistent field labels, meaningful alt text and text alternatives for icons. Target WCAG 2.2 AA. Verify normal text contrast of at least 4.5:1 and large text at least 3:1. Use comfortably sized touch targets, aiming for 44 × 44 px. Focus must be visible and not obscured by the header. Do not communicate status through color alone.

Menus and dialogs must support Escape, sensible focus placement and focus return. Modal focus stays within the modal while open. Accordion buttons expose expanded state. Announce submission and validation changes appropriately; connect errors to their fields. Respect reduced motion and support keyboard use for every action, including ordering records. Keep browser zoom and native scrolling available.

In Figma Design, use Auto Layout, variables, component properties and descriptive layers. Avoid flattened page images and detached component copies. Annotate responsive transitions, content limits and interaction states.

## Prompt 6 — Lightweight frontend and production handoff

Turn the accepted design into a clear implementation specification. Where generating working code, preserve the established framework and avoid unnecessary dependencies. Prefer semantic server-rendered or statically rendered public pages where practical, with CMS-backed content and a separately protected admin experience. Do not add multiple UI frameworks or animation libraries for simple transitions.

Use shared tokens and small reusable components. Keep text selectable. Use responsive image sources, modern compressed formats with appropriate fallbacks, intrinsic dimensions and editable focal points. Load the hero image promptly; lazy-load below-the-fold images. Avoid autoplay background video. Reuse a single fetched source for both renderings in the reveal. Load map embeds only after interaction. Load only the fonts and weights actually used, with sensible fallbacks and a strategy to minimize layout shift.

Use transform and opacity for routine animation. Bound the hero mask effect to its own image area, and test its rendering cost. Avoid adding animation libraries if CSS and a small pointer handler are sufficient. Use progressive enhancement so unsupported effects never prevent reading or contacting the firm.

Performance targets for the production implementation: LCP ≤ 2.5 seconds, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile of real visits. Treat these as targets requiring measurement, not claims a mockup can prove. Inspect a representative mobile connection and device; document remaining bottlenecks. Set practical image/font budgets after measuring actual assets.

Specify and test the full contact path: browser validation, server validation, submission failure, successful persistence and appearance in the admin inbox. Include abuse protection and sensible submission limits. Keep private enquiries out of public pages and public data responses. Enforce authorization server-side and use a maintained authentication approach, not custom client-only checks.

Supply editable page metadata, canonical URLs, a sitemap, appropriate indexing rules and factual structured data. Keep admin pages out of indexing, while recognizing that indexing rules do not provide access control. Use only supplied business facts; do not create SEO claims such as “Bangladesh’s best law firm.”

Provide a handoff list separating implemented behavior, simulated prototype behavior, required integrations and client-supplied content. Outstanding client content includes the first two lawyer names, approved photographs, all missing credentials and biographies, actual contact details, office hours, map location, approved compact logo artwork and reviewed legal/privacy copy. Do not label the site production-ready while those dependencies or backend tests are unresolved.

## Prompt 7 — Final art direction and quality pass

Review the complete Avance website as a design director and a visitor seeking legal help. Correct the design itself rather than merely returning a critique.

Check that the opening identifies the firm, Dhaka location, legal-service purpose, 1998 establishment and next action within a few seconds. Confirm the logo is legible, the hero composition is distinctive and welcoming, gold is restrained and body copy is comfortable to read. Check that imagery looks coherent and purposeful and that replacing each temporary image will be straightforward.

Replace repetitive generic layouts with content-appropriate compositions. Remove decoration that does not improve recognition, clarity or navigation. Do not solve every concern by adding another card, icon, section or animation. Retain the approved palette and architecture-inspired direction.

Verify every public route, all eight complete services, the three initial lawyer records, contact states, admin editing workflows and legal-page placeholders. Check keyboard, touch, reduced motion, slow loading, long text, missing data and unavailable images. Confirm that decorative motion never hides important content.

Confirm every editable business detail has a CMS field and that shared details have a single source. Changing the address in Settings must update every use. Changing a service title must update its lists and enquiry selector without manual source edits. Hidden lawyers/services must disappear from public listings and their public detail routes must follow the intended unpublished behavior.

Deliver the polished screens, reusable system, responsive examples, interaction specifications and implementation notes. Report concrete unresolved dependencies. Do not replace actual verification with a claim that the design is “market ready.”
