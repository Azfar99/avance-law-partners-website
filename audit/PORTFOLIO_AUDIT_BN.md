# Avance Law Partners: portfolio audit ও UI/UX report

বর্তমান অবস্থা: ব্যবহারকারীর নির্দেশে redesign-এর visual পরিবর্তনগুলো original backup-এ ফিরিয়ে নেওয়া হয়েছে। এই report-এর design implementation অংশ এখন historical। Technical fixes বহাল আছে; বর্তমান বিবরণ `DESIGN_ROLLBACK.md`-এ।

তারিখ: ৩০ অক্টোবর ২০২৬, Asia/Dhaka

## ১. কাজের ফল

Existing portfolio-এর public pages, shared components, routing, content hooks, contact flow এবং admin source audit করা হয়েছে। সেই findings ধরে public UI refresh, responsive layout, সংযত mouse reveal, navigation fixes, content corrections এবং কয়েকটি critical data/auth defect ঠিক করা হয়েছে। এটি local implementation। Production publish বা database migration চালানো হয়নি।

Design-এর মূল শর্ত: আইন প্রতিষ্ঠানের উপযোগী পেশাদার presentation, সংক্ষিপ্ত copy, সহজে খুঁজে পাওয়া services ও lawyers, পড়ার মতো button labels এবং স্বাভাবিক browsing। নতুন testimonial, award, case result বা success-rate তৈরি করা হয়নি।

চূড়ান্ত palette user-এর নির্দেশ অনুযায়ী আগের palette-ই। Black surfaces-এর জন্য pitch black ব্যবহার করা হয়েছে।

| ব্যবহার | চূড়ান্ত রং |
| --- | --- |
| Black sections, header, menu, footer | `#000000` |
| Gold accent ও primary button | `#C9A227` |
| Ivory background | `#F6F1E4` |
| Charcoal text | `#2B2B2B` |
| Deep gold accent | `#A8851C` |
| Stone surface | `#EFE9D8` |
| Muted text | `#55524A` |
| Small accent text on ivory | Existing copper `#785E36` |

Copper নতুন palette নয়, এটি আগের stylesheet-এই ছিল। Ivory-এর ওপর deep gold-এর contrast প্রায় 3.08:1। ছোট accent text-এর জন্য existing copper প্রায় 5.39:1 দেয়। Gold on pitch black প্রায় 8.68:1, muted ink on ivory প্রায় 6.92:1। এগুলো নির্দিষ্ট token pair-এর হিসাব, পুরো সাইটের accessibility certification নয়।

## ২. Audit কীভাবে করা হয়েছে

প্রথমে `src/App.tsx`, global CSS, Home ও shared header/footer/button/reveal দেখা হয়েছে। Imports অনুসরণ করে public pages, hooks, router, translation, custom Supabase adapter, admin components এবং database/edge-function source পর্যালোচনা করা হয়েছে। এরপর baseline typecheck/build, read-only backend availability check এবং browser QA হয়েছে।

শুরুর production build pass করলেও TypeScript-এ ১৯টি error ছিল। অর্থাৎ শুধু Vite build pass করাকে যথেষ্ট quality gate ধরা যাচ্ছিল না।

পরিবর্তনের আগের `src`, `package.json` ও `index.html` রাখা আছে `audit/before-ui-refresh.zip`-এ। এতে environment credentials রাখা হয়নি। Workspace-এ Git metadata ছিল না, তাই commit বা PR তৈরি হয়নি।

## ৩. সবচেয়ে গুরুত্বপূর্ণ findings

Status অর্থ: **ঠিক করা হয়েছে** মানে local source ও উপযুক্ত checks সম্পন্ন; **আংশিক** মানে client-side সংশোধন হয়েছে, live infrastructure verification বাকি; **পরবর্তী ধাপ** মানে এই UI refresh-এ implement করা হয়নি।

| ID | Priority | আগে কী সমস্যা ছিল | বর্তমান অবস্থা |
| --- | --- | --- | --- |
| F01 | P1 | Mobile hero CTA ৯px পর্যন্ত ছোট হচ্ছিল | ঠিক করা হয়েছে: ১৪px label, প্রায় ৪৮px minimum button height, ছোট screen-এ stacked actions |
| F02 | P1 | Hero split কেবল খুব বড় width-এ শুরু হচ্ছিল, tablet-এ opening অতিরিক্ত লম্বা | ঠিক করা হয়েছে: 1024px থেকে split, compact spacing ও bounded typography |
| F03 | P1 | Home-এর client cards, দীর্ঘ introduction ও repeated contact sections একই কথা বারবার বলছিল | ঠিক করা হয়েছে: পাঁচটি স্বতন্ত্র content section, audience intro-তে, একটি shared footer invitation |
| F04 | P1 | Services mobile horizontal rail-এ লুকানো ছিল | ঠিক করা হয়েছে: সব areas vertical list-এ, বড় screen-এ দুই column |
| F05 | P1 | Lawyers mobile swipe rail, staggered alignment, shadows ও repeated framed controls | ঠিক করা হয়েছে: একই reading order, সরল portrait directory, homepage-এ lawyer preview |
| F06 | P1 | Hero image চার সেকেন্ড অন্তর নিজে বদলাত | ঠিক করা হয়েছে: static photograph, image-এর মধ্যে pointer colour reveal |
| F07 | P1 | Existing mouse reveal component homepage-এ ব্যবহার হচ্ছিল না | ঠিক করা হয়েছে: hero-তে integrated, event-driven animation frame, leave/cancel/blur cleanup |
| F08 | P1 | Hidden mobile menu শুধু opacity/pointer-events দিয়ে বন্ধ থাকত | ঠিক করা হয়েছে: native modal dialog, closed state-এ navigation focus পায় না |
| F09 | P1 | Menu focus containment, Escape, focus return ও resize recovery অসম্পূর্ণ | ঠিক করা হয়েছে: keyboard wrap, Escape close, trigger focus return, desktop resize-এ close ও body unlock |
| F10 | P1 | Skip link hash router-এ page route হিসেবে ধরা পড়তে পারত | ঠিক করা হয়েছে: hash অপরিবর্তিত রেখে main-এ focus ও scroll |
| F11 | P1 | Browser back/forward এবং raw hash link-এ scroll/focus consistency ছিল না | ঠিক করা হয়েছে: route-change scroll/focus handling |
| F12 | P1 | অতিরিক্ত path segment-ও valid detail route হয়ে যেত | ঠিক করা হয়েছে: detail route-এ ঠিক দুই segment; অতিরিক্ত path-এ 404 |
| F13 | P1 | Route reuse-এ আগের entity/page state থাকতে পারত | ঠিক করা হয়েছে: route-keyed public ও admin rendering |
| F14 | P1 | Reveal wrapper default-এ content লুকিয়ে রাখত | ঠিক করা হয়েছে: content সব সময় readable; entrance motion progressive enhancement |
| F15 | P1 | খুব লম্বা reveal target viewport threshold পূরণ না করলে invisible থেকে যেতে পারত | ঠিক করা হয়েছে: visible-by-default এবং সহজ observer threshold |
| F16 | P1 | Contact client validation ও server field limits এক ছিল না | ঠিক করা হয়েছে: name 120, email 254, phone 60, subject 160, message 5000; whitespace trim |
| F17 | P1 | Rapid duplicate submission, sending state এবং acknowledgement handling দুর্বল | ঠিক করা হয়েছে: synchronous submission guard, disabled fieldset, timeout, explicit `ok` acknowledgement |
| F18 | P1 | Error state থেকে বিকল্প যোগাযোগ সহজ ছিল না | ঠিক করা হয়েছে: email fallback, unavailable-service notice, field errors ও first-invalid focus |
| F19 | P1 | Success panel-এ focus ও নতুন enquiry শুরু করার ব্যবস্থা ছিল না | ঠিক করা হয়েছে: confirmation focus ও reset action; live email success পরীক্ষা করা হয়নি |
| F20 | P1 | Required state/autofill এবং textarea limit feedback অসম্পূর্ণ | ঠিক করা হয়েছে: required attributes, autocomplete, character count, associated error text |
| F21 | P1 | বাংলা dictionary-তে duplicate keys TypeScript fail করাচ্ছিল | ঠিক করা হয়েছে: duplicates বাদ, নতুন copy ও কয়েকটি address/ARIA translation যুক্ত |
| F22 | P1 | About-এ ভুল `settings.firmName` ব্যবহার হচ্ছিল | ঠিক করা হয়েছে: `firm_name`, dynamic service count, invalid establishment-year guard |
| F23 | P0 | Custom adapter-এ `.update(...).eq(...)` ও `.delete().eq(...)` chain ভাঙা ছিল | ঠিক করা হয়েছে: mutation execute হওয়ার আগে filters সংগ্রহ করে; filter ছাড়া update/delete reject করে |
| F24 | P0 | পরিচিত lawyer slug-এর database changes hardcoded defaults দিয়ে overwrite হচ্ছিল | ঠিক করা হয়েছে: stored record defaults-এর ওপর precedence পায় |
| F25 | P0 | Fallback deleted/unpublished records আবার public directory-তে যোগ করতে পারত | ঠিক করা হয়েছে: successful empty state respected; public query-তে published filter; draft editor আলাদা |
| F26 | P0 | Configured auth network failure-এ simulated preview login-এ নামতে পারত | ঠিক করা হয়েছে: configured failure-এ fail closed, preview login development-only, production-এ preview token অগ্রহণযোগ্য |
| F27 | P1 | Configured mutation/upload failure local success হিসেবে দেখা দিতে পারত | আংশিক: adapter-এ error ফেরে; প্রধান editor/publish/delete/notes flows-এ failure feedback যোগ হয়েছে; reorder ও সব admin flow-এর integration QA বাকি |
| F28 | P1 | সব admin modules public entry bundle-এ ছিল | ঠিক করা হয়েছে: lazy admin imports ও Suspense fallback |
| F29 | P1 | Render/chunk failure হলে recovery screen ছিল না | ঠিক করা হয়েছে: root error boundary ও refresh action |
| F30 | P1 | Missing lawyer image-এ broken-image presentation | ঠিক করা হয়েছে: portrait component-এ initials fallback; profile-এও একই component |
| F31 | P1 | Terms page footer থেকে পাওয়া যেত না; litigation label-এর link civil-dispute route-এ যেত | ঠিক করা হয়েছে: Terms link ও general litigation route যুক্ত |
| F32 | P1 | Duplicate description tag, stale OG title/description ও relative OG image URL | ঠিক করা হয়েছে: metadata update consistency ও absolute image URL; broader SEO কাজ বাকি |
| F33 | P1 | Draft legal text-কে official publication বলা হচ্ছিল | ঠিক করা হয়েছে: draft status; approved published body ছাড়া official label নেই; unsupported privacy assurance সরানো হয়েছে |
| F34 | P1 | Admin sidebar ছোট screen-এ fixed 256px জায়গা নিত | আংশিক: responsive admin shell/nav/header, login labels ও notification semantics; authenticated visual QA হয়নি |
| F35 | P2 | সব numbered approach block-এর reading order visual alignment অনুযায়ী পাল্টাত | ঠিক করা হয়েছে: এক reading order, compact ledger, কম section padding |
| F36 | P1 | Bundled formatter inline TypeScript member separator বাদ দিচ্ছিল | ঠিক করা হয়েছে: formatter-safe multiline types ও named query result interface; formatting-এর পরে typecheck pass |

## ৪. Design ও content decisions

Homepage এখন: **Hero → Firm introduction → Practice areas → Lawyers → Approach → shared footer**। প্রতিটি section আলাদা প্রশ্নের উত্তর দেয়। Hero-তে firm কী করে, services-এ কোন matter নিয়ে আসা যায়, lawyers-এ কারা কাজ করেন এবং approach-এ কাজটি কীভাবে এগোয় বোঝা যায়।

Practice areas numbered ruled list-এ রাখা হয়েছে। Public directory-তে portrait, নাম, designation, professional title ও profile link আছে। Decorative shadow, glowing progress bar, floating frame, autoplay carousel ও image zoom সরানো হয়েছে। Button hierarchy এখন gold primary, outlined secondary, underlined contextual link।

Copy-তে অস্পষ্ট promotional sentence কমিয়ে সরাসরি ভাষা ব্যবহার করা হয়েছে। যেমন “Clear advice. Considered action.” ও “Tell us what you need help with.” Current TypeScript/TSX/CSS ও HTML-এ EM dash নেই। Database থেকে ভবিষ্যতে ঢোকা copy আলাদা editorial review পাবে।

Content structure-এর reference হিসেবে [A&O Shearman-এর expertise organisation](https://www.aoshearman.com/en) এবং [Clifford Chance-এর people, expertise ও firm information navigation](https://www.cliffordchance.com/home.html) দেখা হয়েছে। এখান থেকে expertise ও people-কে সহজে খুঁজে পাওয়ার নীতি নিয়েছি। তাদের logo, copy, assets বা exact layout ব্যবহার করা হয়নি। Avance-এর existing branding-ই রাখা হয়েছে।

## ৫. Mouse reveal specification

- শুধু hero photograph-এর মধ্যে colour window দেখা যায়। Text, CTA ও পুরো page-এ effect ছড়ায় না।
- Native cursor থাকে। Cursor follower, magnetic button, tilt, bouncing ও continuous animation loop নেই।
- Actual mouse pointer, hover-capable/fine-pointer device এবং no-reduced-motion preference একসঙ্গে থাকলেই effect চলে।
- প্রতি pointer event-এ React render না করে সর্বোচ্চ একটি scheduled animation frame-এ CSS variables লেখা হয়।
- Pointer leave/cancel, window blur ও preference change-এ effect reset হয়; unmount-এ listeners/frame পরিষ্কার হয়।
- Touch ও reduced-motion condition-এ base colour photograph থাকে। CSS mask unavailable হলে content ও image readable থাকে।
- Scroll entrance ছোট ও একবারের; observer না থাকলেও content লুকায় না।

Desktop browser-এ actual pointer input দিয়ে reveal চালিয়ে mask coordinates ও `data-revealing` যাচাই করা হয়েছে। Physical touch device এবং OS reduced-motion toggle এই session-এ চালিয়ে পরীক্ষা করা হয়নি; সেই branches code review করা হয়েছে।

## ৬. Responsive ও interaction verification

### Public layout matrix

`/`, `/about`, `/approach`, `/lawyers`, `/services`, `/contact`, `/privacy`, `/terms`, `/disclaimer`:

| Width | পরীক্ষা |
| --- | --- |
| 320px | ৯ page |
| 375px | ৯ page |
| 768px | ৯ page |
| 1024px | ৯ page |
| 1440px | ৯ page |

প্রতিটি case-এ exact expected heading, horizontal document overflow এবং main heading/button/input/select/textarea viewport bounds দেখা হয়েছে। ৪৫টি case-এ tested bounds অতিক্রম হয়নি।

### Detail ও recovery matrix

তিন lawyer profile, আট service detail এবং চার invalid-route scenario 320px, 768px ও 1440px-এ দেখা হয়েছে। মোট আরও ৪৫টি case। Unknown page, unknown service, unknown lawyer এবং অতিরিক্ত route segment-এ 404 content পাওয়া গেছে।

সব মিলিয়ে **৯০টি browser layout case**। এটি automated axe audit, screen-reader certification বা সব browser/physical device-এর পূর্ণ পরীক্ষা নয়।

### আলাদাভাবে যাচাই হয়েছে

1. Mobile menu open/close, reverse Tab wrap, Escape ও focus restoration।
2. Mobile menu খোলা অবস্থায় desktop width-এ গেলে dialog close ও body scroll unlock।
3. Keyboard দিয়ে skip link activate করলে hash না বদলে main-content focus।
4. Arbitration service CTA থেকে contact-এ সঠিক matter preselection।
5. Empty enquiry submit-এ name/email/message errors এবং প্রথম invalid field focus। এই submit validation-এ থেমেছে, email পাঠানো হয়নি।
6. Bengali homepage ও 320px text wrapping, translated primary copy ও language switching।
7. 375px admin login overflow ও associated input labels। Remote admin sign-in করা হয়নি।
8. Hero background computed colour `rgb(0, 0, 0)` এবং বাস্তব pointer reveal।

### Automated critical-flow tests

`pnpm test`-এ ছয়টি test pass:

- বাংলা নাম ও trimmed email গ্রহণ।
- ফাঁকা field, invalid email, overlong input ও subject header-injection rejection।
- Deferred filtered update/delete, অন্য record অক্ষত রাখা, filter-less mutation rejection।
- Configured network outage-এ simulated auth/session বা local write না হওয়া।
- Unconfigured production-এ development preview login বন্ধ থাকা।
- Remote PATCH-এ selected record filter এবং server rejection propagate হওয়া।

## ৭. Build ও frontend stack

বর্তমান stack: React 19, TypeScript 5.7, Vite 8, Tailwind CSS v4, existing Radix Slot/CVA button system ও Lucide icons। এই কাজের জন্য নতুন animation framework বা component dependency লাগেনি।

| Local build measurement | আগে | পরে |
| --- | --- | --- |
| Main entry JS | 466.20 kB | 375.52 kB |
| Main entry JS gzip | 126.20 kB | 108.01 kB |
| CSS | 79.09 kB | 62.55 kB |
| CSS gzip | 13.82 kB | 11.75 kB |

Main entry JS প্রায় 19.5% ছোট। এটি পুরো application-এর total bytes বা বাস্তব loading-time improvement নয়। Admin code আলাদা chunks-এ গেছে; কিছু shared modules এখনও আলাদাভাবে load হয়। Lighthouse/Core Web Vitals এই session-এ মাপা হয়নি।

Final gates: `pnpm typecheck`, `pnpm test`, `pnpm build`।

## ৮. Launch-এর আগে যেগুলো অবশ্যই বাকি

### P0: Backend availability ও permission

Read-only request-এ `services` ও `lawyers` endpoint উভয়টিতে HTTP 404, `PGRST205` পাওয়া গেছে। API schema cache-এ table পাওয়া যাচ্ছে না। Migration অনুপস্থিত, schema exposure বা cache configuration কোনটি কারণ, সেটি backend inspection ছাড়া নিশ্চিত নয়। বর্তমানে repository-এর supplied content ব্যবহার হচ্ছে।

Successful empty table আর missing/unconfigured table এক নয়। Client fallback এখন এই পার্থক্য রাখে। কিন্তু CMS-ready দাবি করার আগে schema, seed content ও public/admin permission staging-এ যাচাই করতে হবে।

Existing migration-এর “Admins” policies কেবল `auth.role() = 'authenticated'` দেখছে। এটি নিজে আলাদা admin role প্রতিষ্ঠা করে না। তাই migration সরাসরি live-এ চালানোর আগে intended admin membership/claims, signup settings এবং enquiry access review প্রয়োজন। Row-level policies database-এ enforcement-এর জায়গা; frontend visibility একা access control নয়। [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)।

### P0: Enquiry delivery বনাম admin inbox

Edge-function source email পাঠায়, কিন্তু `enquiries` table-এ record insert করে না। Admin inbox copy ধরে নেয় website enquiry সেখানে আসবে। তাই delivery ও inbox একসঙ্গে কাজ করছে বলে এখন দাবি করা যাবে না।

Live send, sender/domain verification, allowed origins, mail provider secret, inbox persistence, idempotency ও spam/rate-limit behaviour staging-এ যাচাই করতে হবে। এই session-এ কোনো real enquiry/email পাঠানো হয়নি।

### P1: CMS editing reliability

Homepage editor এখনো প্রতিটি section-এর জন্য plain insert করে, অথচ schema-তে `(page_key, section_key)` unique। Existing row দ্বিতীয়বার save করলে duplicate-key conflict হতে পারে। Client এখন error দেখায়; next pass-এ upsert ও atomic save দরকার।

Reorder দুটি পৃথক update; partial failure এবং optimistic state mutation-এর test বাকি। Media library বর্তমানে hardcoded initial list থেকে শুরু করে; persisted inventory reload, upload validation, clipboard denial ও storage quota handling বাকি।

AdminSEO editor-এর stored metadata public SEOHead-এ fetch হয়ে ব্যবহার হয় না। Public metadata consistency এই pass-এ উন্নত হয়েছে, কিন্তু admin SEO editor-কে কার্যকর wiring দিতে হবে।

### P1: Legal copy ও verified content

Privacy, terms ও disclaimer-এর fallback এখন draft হিসেবে চিহ্নিত। Firm-এর approved wording, actual data recipients, retention ও communication practices ছাড়া এগুলোকে final করা যাবে না। About-এ existing illustrative interior photograph আছে, firm-এর office হিসেবে দেখানো হয়নি। পরিচয়, qualification, establishment year, office details ও portrait-use rights firm review করবে।

### P1: Production SEO

Preview configuration-এ `robots.index` false আছে। Hash routing, client-written metadata ও current canonical-domain assumptions থেকে production SEO সীমিত থাকবে। Domain যাচাই, crawlable URL strategy, static rendering/SSR, per-page metadata, sitemap ও real HTTP 404 behaviour পরের phase-এ দরকার। Preview noindex এই pass-এ চালুই রাখা হয়েছে।

### P2: Performance, localization ও resilience

- Supplied logo প্রায় 902 kB; ছোট header usage-এর জন্য optimized approved export দরকার।
- Hero/About photographs ও English fonts external hosts-এর ওপর নির্ভরশীল। Local approved assets, responsive image exports ও self-hosted font strategy দরকার।
- Translation এখনও existing DOM-based dictionary adapter ব্যবহার করে। HMR-এ module reload-এর সময় translated DOM-এর original tracking stale হতে পারে; clean reload-এ final QA হয়েছে। দীর্ঘমেয়াদে React-rendered message keys ও content translations উত্তম।
- Bengali numeric formatting, সব dynamic ARIA text ও full legal copy localization audit বাকি।
- Hooks-এর shared request deduplication/error states উন্নত করা দরকার; backend outage-এর সব ক্ষেত্রে empty state ও unavailable state এখনও আলাদা message নয়।
- Official Supabase client-এ migration করলে custom auth/session/query implementation কমবে। এই SDK-তে database, auth ও storage APIs আছে। [Supabase client reference](https://supabase.com/docs/reference/javascript/initializing)। Migration হবে contract tests বজায় রেখে।
- Safari/iOS, Android touch, reduced motion, forced colours, 200%/400% zoom, screen reader, offline font/image failure এবং authenticated admin workflow-এর যাচাই বাকি।
- Server source-এর 12,000-byte payload cap-এর সঙ্গে 5,000-character Bengali message-এর আচরণ যাচাই করা দরকার। Client character count আর UTF-8 byte size এক নয়।

## ৯. Evidence ও handoff

- `audit/responsive-checks.json`: ৪৫ public-page layout result।
- `audit/detail-checks.json`: ৪৫ detail/404 layout result।
- `audit/screenshots/desktop-home.jpg`: desktop hero ও final visual direction।
- `audit/screenshots/mobile-home.jpg`: mobile layout।
- `audit/screenshots/bengali-mobile.jpg`: বাংলা mobile layout।
- `audit/screenshots/contact-validation.jpg`: contact error state।
- `tests/critical-flows.test.mjs`: critical validation/query/auth tests।
- `audit/IMPLEMENTATION_PLAN_BN.md`: পরবর্তী ধাপ, priority ও completion criteria।

UI refresh local preview-তে review করা যায়। Production launch readiness backend, enquiry flow, role policies ও firm-approved legal content সম্পন্ন হওয়ার ওপর নির্ভরশীল।
