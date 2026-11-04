Avance Law Partners — Master release audit
স্থানীয় audit সমাপ্তির তারিখ 2026-11-02। Verified NEW project `xweeslmfqpgnxfkgrbat`।

**1. Release সিদ্ধান্ত**

Production readiness **NOT READY**। স্থানীয় integration ও build প্রস্তুত, কিন্তু remote content seed, production CORS এবং Turnstile hostname verification release gate হিসেবে বাকি। ব্যবহারকারী আগেই staging থেকে Gmail delivery সফল হওয়ার কথা নিশ্চিত করেছেন। এই audit-এ contact/email পরীক্ষা local mocks ব্যবহার করেছে।

**2. Root cause ও গুরুত্ব**

| গুরুত্ব | নিশ্চিত finding | স্থানীয় প্রতিকার / বাকি কাজ |
|---|---|---|
| CRITICAL | নতুন project-এর public content tables-এ rows শূন্য। সফল empty response-এ configured hooks shipped lawyers/services দেখায় না। | Verified insert-only seed এবং rollback receipt প্রস্তুত। Remote application-এর অনুমোদন বাকি। |
| HIGH | Production-origin OPTIONS preflight 403, staging-origin OPTIONS 204। | Production origin server allowlist-এ অনুমোদিত করা release gate। বর্তমান remote value পরিবর্তন করা হয়নি। |
| HIGH | Live production HTML-এ noindex/nofollow, robots-এ Disallow-all এবং canonical অনুপস্থিত। Live artifact-এ নতুন visitor flow ও opening-ও অনুপস্থিত। | Local production build-এ index/follow, canonical, OG, favicon, JSON-LD ও root-only sitemap যাচাই হয়েছে। Deployment অনুমোদন বাকি। |
| HIGH | পুরোনো admin token public reads-এ যুক্ত হলে নতুন project/expired session-এর কারণে content failure হতে পারে। | Project/environment-scoped caches এবং anonymous public reads যুক্ত করা হয়েছে। Admin permission server membership দিয়ে যাচাই হয়। |
| MEDIUM | List loading/error/empty state অস্পষ্ট, temporary profile/service network error 404 হয়ে যেত, failed lawyer query counter-এ 0 দেখাতে পারত। Homepage hook-এর পুরোনো fallback copy approved Home copy-এর সঙ্গে মিলছিল না। | Loading/empty/error copy, retry এবং profile/service/About error states যুক্ত হয়েছে। Homepage fallback verified baseline-এর সঙ্গে মিলেছে, drift regression check যুক্ত হয়েছে। |
| MEDIUM | Mobile menu resize/same-route selection ও keyboard focus handling, async-loaded first service accordion-এ ত্রুটি। | Targeted UI repairs ও browser checks সম্পন্ন। Black/gold identity ও মূল animation timeline সংরক্ষিত। |
| MEDIUM | Hash routes আলাদা crawlable documents নয়। | Routing অপরিবর্তিত। অনুমোদন সাপেক্ষে History API paths, legacy hash redirects, SPA fallback এবং গুরুত্বপূর্ণ public routes prerender করার সুপারিশ। |
| MEDIUM | Admin membership 0। Automatic session refresh, page-editor conflict handling, media metadata persistence ও CMS SEO wiring অসম্পূর্ণ। | Admin নতুন features তৈরি করা হয়নি। Public reads-এর admin dependence সরানো হয়েছে। |
| LOW | Google fonts/Unsplash-এর external availability ও field Core Web Vitals পরিবেশনির্ভর। | পাঁচটি homepage photo HEAD 200, final desktop real-asset review হয়েছে। বাস্তব LCP/INP/CLS এখনও NOT VERIFIED। |

Google SPA SEO guidance অনুযায়ী গুরুত্বপূর্ণ views-এর জন্য fragments-এর পরিবর্তে History API ব্যবহার করা উচিত। বর্তমান sitemap-এ তাই শুধু বাস্তব root document রাখা হয়েছে। নতুন architecture-এর অনুমোদন ছাড়া pathname URLs উদ্ভাবন করা হয়নি। [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)

**3. Content ও database প্রস্তুতি**

Verified local baseline-এ ৩ published lawyer, ৮ service, ৯ homepage block এবং ১৪ + ১৪ + ১৫ = **৪৩** lawyer-practice-area assignment আছে। তিনটি portrait স্থানীয় public assets-এ আছে। Source এবং seed field-by-field local database-এ যাচাই হয়েছে। Lawyer/service text, publication flags ও slugs baseline থেকে এসেছে।

Seed মোট ২৫টি missing row যোগ করতে পারে — ১ site setting, ৩ lawyer, ৮ service, ৯ home block, ৩ legal draft shell এবং ১ media reference। SEO metadata table ইচ্ছাকৃত খালি, public SEO component defaults ব্যবহার করে। Legal body ফাঁকা থাকলে আগের draft fallback প্রদর্শিত হয়। চূড়ান্ত privacy/terms firm review বাকি।

নতুন seed একটি atomic SQL statement। সব INSERT-এ natural-key conflict হলে DO NOTHING হয়। Existing CMS edits, intentionally blank values ও extra rows রক্ষার test PASS। প্রতিবার শুধু newly inserted IDs এবং guarded rollback SQL ফেরত আসে। Approval-এর পরে seed প্রয়োগ করলে সেই receipt সংরক্ষণ করতে হবে। Rollback-এ full-row SHA-256 guard থাকায় পরবর্তী edit পাওয়া row delete হবে না। Rollback-ও আলাদা অনুমোদন ও transaction review দাবি করে। Seed চলার আগে remote counts/conflicts আবার read-only যাচাই করতে হবে।

Migration ordering ও frontend columns PASS। `services.detail`, published filters এবং schema compatibility যাচাই হয়েছে। Source snapshot-এর Contact/hooks fingerprints বর্তমান reviewed frontend-এর সঙ্গে হালনাগাদ হয়েছে। ব্যবসায়িক baseline text অপরিবর্তিত।

**4. Hosted backend-এর read-only evidence**

- Deployed Contact function ACTIVE, version **2**, `verify_jwt=false`; deployed source local corrected source-এর সঙ্গে মিলে গেছে।
- তিনটি migration version remote history-তে আছে — `20261101000100`, `20261101000200`, `20261101000300`।
- আটটি public application table-এ RLS enabled।
- Anonymous role enquiry SELECT/INSERT বা Contact preparation RPC execute করতে পারে না। সাধারণ authenticated role-ও preparation RPC execute করতে পারে না।
- Admin membership **0**। Media bucket public imagery-এর জন্য configured, limit **5 MiB**, JPEG/PNG/WebP/AVIF।
- সাতটি public content table-এর published/public read count **0** পাওয়া গেছে। আগের read-only counts-এও RLS দ্বারা অদৃশ্য হয়ে যাওয়ার পরিবর্তে actual content শূন্য নিশ্চিত হয়েছিল।
- Production CORS preflight **403**; staging preflight **204**, GET/POST ও visitor header অনুমোদিত।
- Server setting names `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_RATE_LIMIT_SECRET`, `ALLOWED_ORIGINS`, `CONTACT_FROM`, `CONTACT_TO` সব **PRESENT**। Secret values প্রকাশ করা হয়নি। Presence থেকে provider key validity প্রমাণ করা হয় না।

**5. Contact ও security audit**

Working contract production source-এ বাছাই করে যুক্ত হয়েছে। Submit flow GET signed visitor session থেকে POST enquiry-তে যায়। Fresh Turnstile token, origin/action/hostname checking, honeypot, bounded validation, stable request UUID, ১২-second bootstrap timeout ও ৪০-second frontend POST timeout আছে। Uncertain retries একই identity/request ID ধরে রাখে এবং plaintext enquiry localStorage-এ রাখে না। Confirmed acceptance ছাড়া success দেখায় না।

Backend-এ per-visitor HMAC identity, ৩ accepted/reserved submission প্রতি UTC admission hour, atomic advisory locks, lease ownership ও Resend idempotency আছে। Definitive rejection capacity release করে, uncertain timeout/5xx reservation ধরে রাখে। Visitor token ৭ দিন, ২৩ ঘণ্টার বেশি uncertain retry manual review চায়। Public function-এর verify_jwt=false strategy anonymous form-এর জন্য coherent, validation/Turnstile/limits handler-এর ভিতরে থাকে।

সীমাবদ্ধতা রয়েছে। Anonymous session rotate করা যায় এবং Resend account-এর shared provider budget আলাদা operational concern। পৃথক browser tab-এ client submit serialization নেই। PGlite-এর এক serialized connection দিয়ে real multi-session PostgreSQL contention প্রমাণ হয়নি। Real retention policy, provider webhook/bounce monitoring, hosted admin login/CRUD এবং public hostname challenge verification এখনও NOT VERIFIED।

**6. Production configuration**

Ignored mode-specific file `G:/Build Professional Website/.env.production.local` প্রস্তুত হয়েছে। Verified new URL, existing staging থেকে validated public publishable/site keys এবং production origin ব্যবহার করা হয়েছে। এই public keys পুনর্ব্যবহারের সিদ্ধান্ত local preparation-এর জন্য নেওয়া হয়েছে। Turnstile widget-এর production hostname permission **NOT VERIFIED**।

| Name | প্রস্তুতি |
|---|---|
| VITE_SUPABASE_URL | verified new project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | public key PRESENT, accepted format |
| VITE_TURNSTILE_SITE_KEY | public Site Key PRESENT, production hostname permission বাকি |
| VITE_SITE_ORIGIN | https://avancelawpartners.info |
| VITE_PUBLIC_PREVIEW | false |

Production build strict target ও allowed VITE names যাচাই করে। Runtime Contact/backend origin guard exact apex production origin গ্রহণ করে। `www` alias/redirect এই audit-এ NOT VERIFIED, তাই apex URL release target। Production environment build-time-এ সংযুক্ত হয়। ভবিষ্যতে public config বদলালে আবার build দরকার।

Original production `.env.local` এবং staging `.env.staging.local` hash দিয়ে অপরিবর্তিত পাওয়া গেছে। Privileged secrets frontend-এ আনা হয়নি। New backend function source এই audit-এ পরিবর্তিত হয়নি।

**7. Public UX, SEO ও preservation**

Homepage, About, Approach, Lawyers, সব ৩ profile, Services, সব ৮ service detail, Contact, তিন legal view এবং missing-page view পরীক্ষা হয়েছে। Profile visibility, service accordion, mobile two-column cards, menu keyboard containment/Escape, language toggle, input validation, image alt presence, anonymous public reads ও admin noindex checks PASS।

Normal/reduced-motion opening, internal navigation-এ intro replay না হওয়া এবং count stable হয়ে ৪৩ থাকার পরীক্ষা হয়েছে। Assets ও animation logic-এর সফল আগের version সংরক্ষিত। Main brand logo, favicon এবং original portraits ব্যবহার করা হয়েছে।

Local production shell indexable, canonical/OG production origin-এ, factual LegalService JSON-LD এবং root-only sitemap PASS। Admin/login views ও animation-review page noindex থাকে। Local staging build noindex header/meta, self-origin canonical, sitemap exclusion ও production URL scan PASS।

**8. Test ফলাফল**

| Check | ফল |
|---|---|
| Production pnpm.cmd typecheck | PASS |
| Production pnpm.cmd test | **19/19 PASS** |
| Production pnpm.cmd build + artifact verification | PASS |
| Staging pnpm.cmd typecheck | PASS |
| Staging pnpm.cmd test | **19/19 PASS** |
| Staging pnpm.cmd build + noindex/credential scan | PASS |
| Backend pnpm.cmd check | **26/26 PASS** — ১২ SQL/schema/RLS/seed ও ১৪ mocked function group |
| Chromium public-route matrix | **210 PASS** — দুই artifact-এ ২১ route × ৫ width |
| Viewports | 320, 390, 768, 1024, 1440 px |
| Browser JavaScript exceptions / missing local assets | 0 / 0 |
| Staging unapproved-origin safety browser check | PASS |
| Production artifact staging-host scan / privileged-pattern scan / source maps | PASS / PASS / absent |
| Real Turnstile widget + email in this audit | NOT VERIFIED; browser contract mocked, prior success owner-confirmed |
| Remote seed / production CORS repair / deployment | BLOCKED pending requested explicit approval |
| Real mobile hardware, field Core Web Vitals, full assistive-technology audit | NOT VERIFIED |

Route matrix-এ সব backend/widget/email requests intercept করা হয়েছে। Final desktop visual review-এ শুধু public fonts/photos real network থেকে নেওয়া হয়েছে, এবং real fonts-সহ Home/Lawyers/Contact চারটি width-এ overflow check PASS। Mock results real delivery হিসেবে দাবি করা হয়নি।

প্রথম local typecheck অসমাপ্ত storage response integration-এর error ধরেছিল, পরে সেটি সংশোধিত হয়েছে। Formatter-এর একটি type-member separator error-ও typecheck-এ ধরা ও সংশোধন হয়েছে। উপরের ফল বর্তমান শেষ checks-এর।

**9. পরিবর্তিত local files**

তিনটি root Git repository নয়। শুরুতে file hashes সংগ্রহ করা হয়েছে। দুই nested public preview checkout clean ছিল। একক প্রয়োজনীয় files পর্যালোচনা করে edit/copy করা হয়েছে। Existing build outputs পুনরায় generate হয়েছে। নিচের তালিকায় environment file-এর নাম দেওয়া আছে, values নেই।

**G:/Build Professional Website**

- [.env.production.example](<G:/Build Professional Website/.env.production.example>)
- [.env.production.local](<G:/Build Professional Website/.env.production.local>)
- [.gitignore](<G:/Build Professional Website/.gitignore>)
- [index.html](<G:/Build Professional Website/index.html>)
- [package.json](<G:/Build Professional Website/package.json>)
- [public/_headers](<G:/Build Professional Website/public/_headers>)
- [scripts/check-release-browser.cjs](<G:/Build Professional Website/scripts/check-release-browser.cjs>)
- [scripts/verify-release.mjs](<G:/Build Professional Website/scripts/verify-release.mjs>)
- [src/components/Header.tsx](<G:/Build Professional Website/src/components/Header.tsx>)
- [src/components/parts.tsx](<G:/Build Professional Website/src/components/parts.tsx>)
- [src/components/TurnstileWidget.tsx](<G:/Build Professional Website/src/components/TurnstileWidget.tsx>)
- [src/lib/auth.ts](<G:/Build Professional Website/src/lib/auth.ts>)
- [src/lib/contactClient.ts](<G:/Build Professional Website/src/lib/contactClient.ts>)
- [src/lib/hooks.ts](<G:/Build Professional Website/src/lib/hooks.ts>)
- [src/lib/i18n.tsx](<G:/Build Professional Website/src/lib/i18n.tsx>)
- [src/lib/productionConfig.ts](<G:/Build Professional Website/src/lib/productionConfig.ts>)
- [src/lib/storage.ts](<G:/Build Professional Website/src/lib/storage.ts>)
- [src/lib/supabase.ts](<G:/Build Professional Website/src/lib/supabase.ts>)
- [src/pages/About.tsx](<G:/Build Professional Website/src/pages/About.tsx>)
- [src/pages/Contact.tsx](<G:/Build Professional Website/src/pages/Contact.tsx>)
- [src/pages/LawyerProfile.tsx](<G:/Build Professional Website/src/pages/LawyerProfile.tsx>)
- [src/pages/Lawyers.tsx](<G:/Build Professional Website/src/pages/Lawyers.tsx>)
- [src/pages/ServiceDetail.tsx](<G:/Build Professional Website/src/pages/ServiceDetail.tsx>)
- [src/pages/Services.tsx](<G:/Build Professional Website/src/pages/Services.tsx>)
- [tests/critical-flows.test.mjs](<G:/Build Professional Website/tests/critical-flows.test.mjs>)
- [tests/helpers/load.mjs](<G:/Build Professional Website/tests/helpers/load.mjs>)
- [tests/production-contact.test.mjs](<G:/Build Professional Website/tests/production-contact.test.mjs>)
- [vite.config.ts](<G:/Build Professional Website/vite.config.ts>)

**G:/Avance-Law-New-Backend**

- [.env.edge.example](<G:/Avance-Law-New-Backend/.env.edge.example>)
- [checks/report.json](<G:/Avance-Law-New-Backend/checks/report.json>)
- [README.md](<G:/Avance-Law-New-Backend/README.md>)
- [scripts/check-local.mjs](<G:/Avance-Law-New-Backend/scripts/check-local.mjs>)
- [scripts/prepare-local.mjs](<G:/Avance-Law-New-Backend/scripts/prepare-local.mjs>)
- [SOURCE_SNAPSHOT.json](<G:/Avance-Law-New-Backend/SOURCE_SNAPSHOT.json>)
- [supabase/seed.sql](<G:/Avance-Law-New-Backend/supabase/seed.sql>)

**G:/Avance-Law-Staging-Frontend**

- [checks/browser-report.json](<G:/Avance-Law-Staging-Frontend/checks/browser-report.json>)
- [scripts/check-staging-browser.cjs](<G:/Avance-Law-Staging-Frontend/scripts/check-staging-browser.cjs>)
- [src/components/Header.tsx](<G:/Avance-Law-Staging-Frontend/src/components/Header.tsx>)
- [src/components/parts.tsx](<G:/Avance-Law-Staging-Frontend/src/components/parts.tsx>)
- [src/lib/hooks.ts](<G:/Avance-Law-Staging-Frontend/src/lib/hooks.ts>)
- [src/lib/i18n.tsx](<G:/Avance-Law-Staging-Frontend/src/lib/i18n.tsx>)
- [src/lib/supabase.ts](<G:/Avance-Law-Staging-Frontend/src/lib/supabase.ts>)
- [src/pages/About.tsx](<G:/Avance-Law-Staging-Frontend/src/pages/About.tsx>)
- [src/pages/LawyerProfile.tsx](<G:/Avance-Law-Staging-Frontend/src/pages/LawyerProfile.tsx>)
- [src/pages/Lawyers.tsx](<G:/Avance-Law-Staging-Frontend/src/pages/Lawyers.tsx>)
- [src/pages/ServiceDetail.tsx](<G:/Avance-Law-Staging-Frontend/src/pages/ServiceDetail.tsx>)
- [src/pages/Services.tsx](<G:/Avance-Law-Staging-Frontend/src/pages/Services.tsx>)
- [STAGING_README.md](<G:/Avance-Law-Staging-Frontend/STAGING_README.md>)
- [tests/critical-flows.test.mjs](<G:/Avance-Law-Staging-Frontend/tests/critical-flows.test.mjs>)

Generated release evidence-ও হালনাগাদ হয়েছে।

- [Production build checks](<G:/Build Professional Website/audit/master-release-build.json>)
- [Browser route evidence](<G:/Build Professional Website/audit/master-browser-checks.json>)
- [Backend SQL/seed checks](<G:/Avance-Law-New-Backend/checks/report.json>)
- [Backend mocked Contact checks](<G:/Avance-Law-New-Backend/checks/function-report.json>)
- [Staging build checks](<G:/Avance-Law-Staging-Frontend/checks/build-report.json>)
- [Staging origin safety](<G:/Avance-Law-Staging-Frontend/checks/browser-report.json>)

**10. অনুমোদনের পরে staging verification order**

প্রথমে reviewed seed শুধু verified NEW project-এ atomic statement হিসেবে প্রয়োগ করে returned receipt সংরক্ষণ করতে হবে। তারপর anonymous reads-এ ৩/৮/৯ counts, ৪৩ assignments, three profiles, eight service details, homepage text ও portraits staging-এ দেখতে হবে। Existing CMS conflict পাওয়া গেলে overwrite-এর বদলে review করতে হবে। প্রয়োজন হলে পৃথক অনুমোদনে local staging repairs upload হবে।

তারপরে production exact origin server allowlist ও working Turnstile widget hostname অনুমোদন যাচাই/পরিবর্তনের জন্য আলাদা approval লাগবে। Stage hostname রাখতে হবে। Production-origin preflight 204 এবং challenge hostname match নিশ্চিত হতে হবে। আরও real email test করলে পৃথক permission নিতে হবে।

শেষে creative design review, public/private SEO checks, existing Worker settings/routes/bindings review ও rollback artifact review করে production Worker `polished-night-5f7c`-তে upload-এর পৃথক অনুমোদন প্রয়োজন। Staging Worker `avance-law-staging` আলাদা থাকবে। Legacy frontend `supabase` directory deploy source হিসেবে ব্যবহার করা যাবে না; reviewed backend workspace ও explicit verified project guard অনুসরণ করতে হবে।

**11. পরের একমাত্র action**

শুধু verified NEW Supabase project-এ [reviewed seed.sql](<G:/Avance-Law-New-Backend/supabase/seed.sql>) একবার প্রয়োগের অনুমতি দিন। এতে remote public content প্রস্তুত হবে এবং staging-এ lawyers/services/counter যাচাই করা যাবে। আপনার master instructions remote writes-এর আগে আলাদা অনুমোদন চেয়েছে। এই report deployment approval হিসেবে গণ্য নয়।

