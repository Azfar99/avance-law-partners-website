export const EXPECTED_PROJECT_REF = "xweeslmfqpgnxfkgrbat"
export const PRODUCTION_ORIGIN = "https://avancelawpartners.info"
const expectedUrl = `https://${EXPECTED_PROJECT_REF}.supabase.co`

export function resolveProductionConfig(
  env: Record<string, unknown> = {},
  runtimeOrigin?: string,
) {
  const get = (name: string) =>
    typeof env[name] === "string" ? env[name].trim() : ""
  const url = get("VITE_SUPABASE_URL")
  const publicKey = get("VITE_SUPABASE_PUBLISHABLE_KEY")
  const siteKey = get("VITE_TURNSTILE_SITE_KEY")
  const origin = get("VITE_SITE_ORIGIN")
  const issues: string[] = []
  if (url !== expectedUrl) issues.push("VITE_SUPABASE_URL")
  if (!/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(publicKey))
    issues.push("VITE_SUPABASE_PUBLISHABLE_KEY")
  if (origin !== PRODUCTION_ORIGIN) issues.push("VITE_SITE_ORIGIN")
  const preview = get("VITE_PUBLIC_PREVIEW")
  if (preview && preview !== "false") issues.push("VITE_PUBLIC_PREVIEW")
  const backendConfigured =
    issues.length === 0 &&
    (runtimeOrigin === undefined || runtimeOrigin === origin)
  if (!/^0x[A-Za-z0-9_-]{20,}$/.test(siteKey))
    issues.push("VITE_TURNSTILE_SITE_KEY")
  return {
    url,
    publicKey,
    siteKey,
    origin,
    issues,
    backendConfigured,
    contactConfigured: backendConfigured && !issues.length,
  }
}

export const productionConfig = resolveProductionConfig(
  import.meta.env
    ? {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env
          .VITE_SUPABASE_PUBLISHABLE_KEY,
        VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        VITE_SITE_ORIGIN: import.meta.env.VITE_SITE_ORIGIN,
        VITE_PUBLIC_PREVIEW: import.meta.env.VITE_PUBLIC_PREVIEW,
      }
    : {},
  typeof window === "undefined" ? undefined : window.location.origin,
)
