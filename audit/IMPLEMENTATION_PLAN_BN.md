# Avance Law Partners: implementation plan

বর্তমান নির্দেশ: visual redesign ফিরিয়ে original design baseline রাখা হয়েছে। নিচের আগের design plan নতুন design পরিবর্তনের অনুমোদন নয়। পরের visual changes ব্যবহারকারীর পৃথক নির্দেশে অল্প অল্প করে হবে। Technical/backend findings প্রযোজ্য আছে।

তারিখ: ৩০ অক্টোবর ২০২৬

## স্থির requirements

Existing gold, ivory, charcoal ও supporting palette বজায় থাকবে। Black surfaces `#000000` হবে। Typography, spacing ও interactions law firm-এর ব্যবহারিক প্রয়োজন মেনে চলবে। Copy মানুষের মতো সরাসরি হবে; EM dash, invented social proof, autoplay, decorative cursor, floating card ও অপ্রয়োজনীয় animation যোগ করা হবে না।

## Phase 1: UI foundation ও public experience

**অবস্থা: এই pass-এ সম্পন্ন।**

- Homepage compact করা, repeated sections বাদ, services ও lawyers দৃশ্যমান করা।
- Responsive buttons, mobile navigation, focus/skip-link/route recovery।
- Hero-bound mouse reveal এবং reduced-motion/touch fallback code।
- Lawyer/profile/service/legal/contact presentation-এর consistency।
- Human copy, নতুন Bengali translations ও visible draft-document status।
- TypeScript defects, query-chain defects ও selected production auth failure cases।
- Lazy admin chunks ও root recovery screen।

Evidence: ৯০টি browser layout case, ছয়টি critical-flow automated test এবং typecheck/build। Physical touch, reduced motion ও screen-reader certification এই phase-এর completed evidence হিসেবে ধরা হয়নি।

## Phase 2: Backend ও content source নির্ভরযোগ্য করা

**Priority: P0। পরবর্তী কাজ এখানে শুরু হবে।**

| কাজ | নির্ভরতা | Done হওয়ার শর্ত |
| --- | --- | --- |
| Supabase schema availability diagnose | সঠিক project/schema access | services/lawyers endpoint-এ intended published records আসে, `PGRST205` নেই |
| Migration/seed review | Existing data inventory ও backup | destructive replacement ছাড়া approved content import; seed পুনরায় চালালে duplicates না হয় |
| Admin membership ও RLS | Intended admin identity/role definition | anonymous, authenticated non-admin ও admin দিয়ে পৃথক access tests pass |
| Official Supabase client migration | Current adapter contract tests | auth refresh, filtered CRUD, storage ও error semantics verified |
| Shared content fetching | API contract স্থির | duplicate request কমে; loading, unavailable ও intentional empty state আলাদা হয় |

Current missing-table fallback শুধু supplied public portfolio চালু রাখছে। এটি schema setup-এর বিকল্প নয়। Successful empty table-এ default profile/service ফেরত আসবে না।

Role-policy implementation-এ database enforcement বজায় রাখতে হবে। [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security)। Client migration-এর API reference: [Supabase JavaScript initialization](https://supabase.com/docs/reference/javascript/initializing)।

## Phase 3: Enquiry delivery ও inbox

**Priority: P0। Phase 2-এর permissions-এর পরে।**

1. Email-only নাকি email-plus-inbox, expected flow নির্ধারণ করা। Existing admin UI inbox থাকায় দ্বিতীয়টি সম্পন্ন করাই coherent direction।
2. Enquiry persistence, delivery state ও idempotency এক contract-এ আনা। Timeout-এর পরে blindly duplicate send না হওয়া নিশ্চিত করা।
3. Provider sender/domain, allowed origins ও staging configuration যাচাই করা। Secrets frontend bundle-এ যাবে না।
4. Rate limiting/abuse handling, server-side bounded payload এবং UTF-8 byte limits নির্ধারণ করা।
5. Staging-এ controlled synthetic enquiry পাঠিয়ে delivery ও inbox arrival দুটো যাচাই করা।

Acceptance scenarios:

- Valid enquiry-তে এক record, এক intended delivery এবং acknowledged success।
- Double-click, slow response ও retry-তে duplicate না হওয়া।
- Provider 4xx/5xx, timeout, offline ও partial success-এ truthful message।
- Bengali 5,000-character input ও byte limit-এর স্পষ্ট আচরণ।
- Unauthorized visitor enquiry list, admin note বা private contact data পড়তে না পারা।

## Phase 4: CMS ও admin workflow

**Priority: P1। Phase 2 complete হলে।**

| কাজ | Done হওয়ার শর্ত |
| --- | --- |
| Page-content upsert/atomic save | একই section দুবার save করলে update; duplicate row বা partial section save নয় |
| Reorder transaction | দুটি record-এর order swap atomic; failure-এ আগের state ফিরে আসে |
| Dirty-form handling | accidental navigation-এ unsaved work হারানোর clear recovery |
| Admin error states | list load failure আর zero records আলাদা; সব mutations-এ truthful feedback |
| Media inventory | reload-এর পর uploaded assets থাকে; size/type/error/clipboard cases handled |
| SEO editor wiring | saved metadata public output-এ আসে; route/language অনুযায়ী সঠিক tags |
| Mobile authenticated QA | actual dashboard/editors/dialogs ছোট ও বড় screen-এ ব্যবহারযোগ্য |

Admin list fallback record-এর synthetic ID বাস্তব database row নয়। Migration-এর পরে edit/update selected real IDs ব্যবহার করছে কি না test করতে হবে।

## Phase 5: Firm review ও content completion

**Priority: P1। Backend কাজের সঙ্গে independent review চলতে পারে।**

- Firm-approved privacy policy, disclaimer ও terms। Actual data handling ও recipients-এর সঙ্গে wording মিলবে।
- Lawyers-এর নাম, title, qualification, court/bar membership, portrait rights ও contact details।
- Establishment year এবং office address/hours।
- General litigation বনাম civil/commercial disputes-এর overlap content review।
- About-এর illustrative photograph-এর পরিবর্তে approved office image, যদি পাওয়া যায়।
- বাংলা ও English copy দুই ভাষায় একই অর্থ দিচ্ছে কি না editorial check।

Completion criteria: unverified claim, misleading office photograph বা unlabeled draft publication থাকবে না।

## Phase 6: Production URLs, SEO ও performance

**Priority: P1/P2। Domain ও hosting requirements স্থির হলে।**

1. Crawlable URL এবং rendering strategy বেছে নেওয়া। Current hash links preserve করার redirect/migration map রাখা।
2. Canonical host, per-page metadata, absolute social image, sitemap, robots ও real 404 response যাচাই।
3. Preview noindex বজায় রেখে production indexing আলাদাভাবে configure করা।
4. Approved logo-এর ছোট optimized export; hero/portrait responsive sources; stable image dimensions।
5. English/Bengali font delivery ও fallback policy স্থির করা।
6. Production-like connection-এ Lighthouse এবং measured Core Web Vitals budget স্থির করা। Bundle-size reduction-কে loading-speed score হিসেবে দেখানো হবে না।

Done: every service/lawyer deep link reload হয়, social metadata source HTML-এ পাওয়া যায় যেখানে প্রয়োজন, console errors নেই, redirect chain নেই এবং measured budgets পূরণ হয়।

## Phase 7: Final regression ও release

**Priority: release gate।**

| ক্ষেত্র | Case |
| --- | --- |
| Screen | 320, 375, 768, 1024, 1440px; short landscape viewport |
| Zoom | 200% ও 400%; system font scaling |
| Input | keyboard, mouse, physical touch; no hover dependency |
| Motion | OS reduced motion, preference change while page remains open |
| Accessibility | heading hierarchy, labels, announcements, focus order, contrast, screen reader ও forced colours |
| Network | slow, offline, image/font failure, API 401/403/404/500 ও timeout |
| Content | long Bengali/English name, long service title, no photo, empty array, unpublished/deleted record, malformed data |
| Navigation | back/forward, direct deep link, trailing slash, unknown route ও external modified click |
| Form | trim/limits, invalid email, long subject, query preselection, double click, failed delivery, reset |
| Admin | admin/non-admin roles, expired session, save failure, reorder rollback, dirty form, upload failure |
| Build | formatter-safe source, `pnpm typecheck`, `pnpm test`, `pnpm build` |

Release হবে code ও content version review, staging evidence, backend permission verification এবং remaining P0 items বন্ধ হওয়ার পরে। বর্তমান local UI refresh-এর সঙ্গে live launch-ready status গুলিয়ে ফেলা হবে না।

## কাজের পরবর্তী ক্রম

**Schema ও roles → enquiry delivery/inbox → CMS reliability → approved content → production SEO/assets → final regression ও launch।**

Visual direction এখন স্থির। পরের pass-এ আবার palette বা decorative layout বদলানোর প্রয়োজন নেই; চিহ্নিত functional ও launch gaps বন্ধ করাই মূল কাজ।
