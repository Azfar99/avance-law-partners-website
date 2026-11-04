import { EXPECTED_PROJECT_REF } from "./productionConfig"
export type ContactPayload = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
type Visitor = {
  token: string
  expires: number
}
type Pending = {
  id: string
  hash: string
  created: number
  visitor: Visitor
  uncertain: boolean
}
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">
export class ContactFailure extends Error {
  constructor(
    public code: string,
    message: string,
    public uncertain = false,
  ) {
    super(message)
    this.name = "ContactFailure"
  }
}
const pendingMessage =
  "We could not confirm delivery. Retry the same enquiry after verification, or contact the firm before sending a new one."
export function createContactClient(options: {
  url: string
  key: string
  projectRef: string
  enabled: boolean
  storage: Store
  fetch?: typeof fetch
  crypto?: Crypto
  now?: () => number
  timeoutMs?: number
}) {
  const request = options.fetch ?? fetch,
    crypt = options.crypto ?? crypto,
    now = options.now ?? Date.now
  const prefix = `alp_prod_${options.projectRef}_contact_`
  let sending = false
  const read = <T>(key: string): T | null => {
    try {
      return JSON.parse(options.storage.getItem(prefix + key) || "null")
    } catch {
      return null
    }
  }
  const save = (key: string, value: unknown) => {
    try {
      options.storage.setItem(prefix + key, JSON.stringify(value))
    } catch {
      throw new ContactFailure(
        "storage_unavailable",
        "Please enable browser storage before submitting this enquiry.",
      )
    }
  }
  const headers = (visitor?: Visitor) => ({
    apikey: options.key,
    ...(visitor ? { "x-contact-visitor": visitor.token } : {}),
  })
  const json = async (response: Response): Promise<Record<string, unknown>> =>
    response.json().catch(() => ({}))
  async function visitor(previous: Visitor | null): Promise<Visitor> {
    if (previous && previous.expires > now() + 60000) return previous
    if (previous && previous.expires <= now())
      throw new ContactFailure(
        "visitor_session_required",
        "Your contact session expired. Contact the firm before retrying an unconfirmed enquiry.",
      )
    let response: Response
    try {
      response = await request(
        `${options.url}/functions/v1/send-contact-enquiry`,
        {
          method: "GET",
          headers: headers(previous ?? undefined),
          signal: AbortSignal.timeout(12000),
        },
      )
    } catch {
      throw new ContactFailure(
        "session_unavailable",
        "Verification could not start. Please try again shortly.",
      )
    }
    const body = await json(response)
    if (
      !response.ok ||
      body.ok !== true ||
      typeof body.visitor_token !== "string" ||
      !/^v1\.[0-9a-f-]{36}\.\d{10}\.[0-9a-f]{64}$/.test(body.visitor_token) ||
      typeof body.expires_at !== "string" ||
      !(Date.parse(body.expires_at) > now())
    )
      throw new ContactFailure(
        "session_unavailable",
        "The enquiry service is unavailable. Please contact the firm by phone or email.",
      )
    const next = {
      token: body.visitor_token,
      expires: Date.parse(body.expires_at),
    }
    if (previous && previous.token.split(".")[1] !== next.token.split(".")[1])
      throw new ContactFailure("session_changed", pendingMessage, true)
    save("visitor", next)
    return next
  }
  return {
    async submit(payload: ContactPayload, challenge: string, website = "") {
      if (
        !options.enabled ||
        options.projectRef !== EXPECTED_PROJECT_REF ||
        options.url !== `https://${EXPECTED_PROJECT_REF}.supabase.co`
      )
        throw new ContactFailure(
          "unconfigured",
          "Online enquiries are unavailable at the moment. Please contact the firm by phone or email.",
        )
      if (sending)
        throw new ContactFailure(
          "busy",
          "Your enquiry is already being submitted.",
        )
      if (!challenge)
        throw new ContactFailure(
          "challenge_required",
          "Please complete verification before submitting.",
        )
      if (website)
        throw new ContactFailure(
          "invalid_submission",
          "Please review the enquiry and try again.",
        )
      sending = true
      try {
        const bytes = await crypt.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(JSON.stringify(payload)),
        )
        const hash = Array.from(new Uint8Array(bytes), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("")
        const previous = read<Pending>("pending")
        if (
          previous?.uncertain &&
          (previous.hash !== hash || now() - previous.created > 23 * 3600000)
        )
          throw new ContactFailure("delivery_pending", pendingMessage, true)
        const same = previous?.hash === hash
        let current = same ? previous : null
        let credential = current?.visitor ?? read<Visitor>("visitor")
        if (!current && credential && credential.expires <= now())
          credential = null
        credential = await visitor(credential)
        current = current
          ? { ...current, visitor: credential }
          : {
              id: crypt.randomUUID(),
              hash,
              created: now(),
              visitor: credential,
              uncertain: false,
            }
        const wasUncertain = current.uncertain
        // Persist BEFORE dispatch: tab closure/timeout must not lose the retry identity.
        current.uncertain = true
        save("pending", current)
        let response: Response
        try {
          response = await request(
            `${options.url}/functions/v1/send-contact-enquiry`,
            {
              method: "POST",
              headers: {
                ...headers(credential),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...payload,
                request_id: current.id,
                turnstile_token: challenge,
                website,
              }),
              signal: AbortSignal.timeout(options.timeoutMs ?? 40000),
            },
          )
        } catch {
          throw new ContactFailure("delivery_pending", pendingMessage, true)
        }
        const body = await json(response)
        if (response.ok && body.ok === true && body.code === "accepted") {
          options.storage.removeItem(prefix + "pending")
          return { ok: true }
        }
        const code =
          typeof body.code === "string" ? body.code : "delivery_pending"
        const uncertain =
          wasUncertain ||
          (response.status >= 500 && response.status !== 502) ||
          response.status === 409 ||
          response.ok
        current.uncertain = uncertain
        save("pending", current)
        const messages: Record<string, string> = {
          invalid_submission:
            "Please review your enquiry fields and try again.",
          challenge_failed:
            "Verification expired or failed. Please complete it again.",
          visitor_session_required:
            "Your contact session needs attention. Contact the firm before retrying an unconfirmed enquiry.",
          rate_limited:
            "Too many enquiries from this contact session. Please try later or call the firm.",
          origin_denied: "Online enquiries are not enabled for this address.",
          email_unavailable:
            "The email service could not accept this enquiry. You can retry after verification or contact the firm.",
          service_unavailable:
            "The enquiry service is unavailable. Please contact the firm before sending again.",
        }
        throw new ContactFailure(
          code,
          uncertain
            ? pendingMessage
            : messages[code] ||
                "The enquiry could not be submitted. Please contact the firm.",
          uncertain,
        )
      } finally {
        sending = false
      }
    },
  }
}
