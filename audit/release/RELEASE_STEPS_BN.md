Avance Law Partners - final release procedure

Existing verified business content owner-approved। Content review gate complete।
Target Worker polished-night-5f7c। Target NEW Supabase xweeslmfqpgnxfkgrbat।

Local readiness

- Insert-only seed G:\Avance-Law-New-Backend\supabase\seed.sql ready। Baseline 3 lawyers, 8 services, 9 home blocks, 43 assignments। Existing records are preserved by ON CONFLICT DO NOTHING। Legal bodies remain empty draft shells and the frontend visibly labels them as drafts।
- Production frontend includes working visitor GET -> enquiry POST contract, Turnstile, request IDs, safe retries/timeouts and project-scoped credentials। Existing staging Edge Function source and Resend delivery flow are preserved।
- Production config is mode-specific .env.production.local, with approved NEW project, public publishable/site keys, apex production origin and preview=false। No privileged key is included।
- Footer now links the existing approved phone/email and all three legal pages using the existing branding/layout।
- Local production indexing/canonical/metadata/social/JSON-LD/favicon and root-only sitemap checks pass। Staging noindex remains enabled।

Remote gates and required approval

1. Seed approval: confirm CLI/Dashboard target xweeslmfqpgnxfkgrbat and recheck current content/conflicts, then execute only the reviewed seed as one atomic statement. Save returned table_name/id/rollback_sql receipt. Verify 3 published lawyers, 8 services, 9 home blocks and 43 assignment entries via anonymous reads. Do not rerun migrations or reset the database.
2. Origin approval: in the NEW project's server-side ALLOWED_ORIGINS, preserve every existing authorized origin and append https://avancelawpartners.info only if absent. Keep https://avance-law-staging.isratarni1422.workers.dev. Then verify production OPTIONS=204 and matching CORS headers. Latest observed state is production 403 / staging 204.
3. Turnstile approval: inspect the existing widget matching the configured public Site Key in the owner's Cloudflare account. Verify that avancelawpartners.info is authorized; add it only if absent and approved. Preserve the staging hostname and existing keys. Production hostname permission is NOT VERIFIED because authenticated Cloudflare access is unavailable locally.
4. Additional real email requires a separate explicit approval. Current local browser email tests are mocked. Prior real staging delivery was owner-confirmed.

Deployment procedure, only after separate deployment approval

1. Verify the signed-in Cloudflare account and exact existing Worker polished-night-5f7c. Record the current active version/deployment ID and review current domains/routes, asset routing, bindings and configuration for recovery. The active version ID has not been captured yet because authenticated access is unavailable.
2. Verify production-assets.zip against production-assets-manifest.json and its SHA-256. The ZIP contains dist assets only. It excludes environment files, source SQL and reports. The package is a release candidate pending the remote gates above.
3. Through the existing Worker's established Static Assets upload workflow, upload this exact dist artifact. Preserve existing custom-domain routing and bindings. Do not upload the workspace/backend folder or use the staging Worker as the production target.
4. After the approved deployment, verify the production root and hash routes, footer tel/mailto/legal links, three profiles, eight services, About 43, legal draft labels, actual response headers, robots/sitemap, canonical/social data and challenge hostname. Send an email only when separately approved.

Rollback

Before deployment, record the current known-working version. If release verification fails, use Cloudflare Dashboard > Workers & Pages > polished-night-5f7c > Deployments > the saved version's three-dot menu > Rollback. Verify the selected version becomes active and the public site recovers. Worker rollback does not restore connected databases/resources.

Preserve new enquiry data. Do not automatically delete seeded content on frontend rollback. Any database rollback requires separate approval and the saved insertion receipt; its full-row hash guards exclude edited rows. Keep previous assets/source and the new release package for recovery.

Reference: https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/

Remaining SEO limitation

Hash routing is preserved. Important views still share a root document/canonical and are not independent crawlable pathname pages. A future approved History API/prerender change can address that. This does not block the scoped functional release but limits per-page SEO.

Next ONE action

Approve applying only the reviewed insert-only seed to the verified NEW project. This is the first necessary remote write. Origin, Turnstile and production deployment changes each remain subject to explicit authorization.
