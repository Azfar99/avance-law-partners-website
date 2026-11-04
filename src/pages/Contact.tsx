import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Mail, Phone } from "lucide-react"
import {
  lawyers as defaultLawyers,
  services as defaultServices,
} from "../lib/content"
import { useSiteSettings, useServices } from "../lib/hooks"
import { AppLink, Button, Container, InlineLink } from "../components/ui"
import { useRouter } from "../lib/router"
import { useHeroTone } from "../lib/chrome"
import SEOHead from "../components/SEOHead"
import { productionConfig, EXPECTED_PROJECT_REF } from "../lib/productionConfig"
import { createContactClient, ContactFailure } from "../lib/contactClient"
import TurnstileWidget from "../components/TurnstileWidget"
import {
  normalizeEnquiry,
  validateEnquiry,
  type EnquiryErrors as Errors,
} from "../lib/contactValidation"

type Status = "idle" | "sent"
const primaryContact = defaultLawyers.find(
  (lawyer) => lawyer.slug === "lawyer-one",
)
const contactPhone = primaryContact?.phone ?? "+88 01628 781 222"
const contactEmail = primaryContact?.email ?? "isratarni1422@gmail.com"

const fieldBase =
  "w-full border-0 border-b bg-transparent px-0 py-3 text-[16px] text-charcoal transition-colors placeholder:text-ink-60/60 focus:outline-none focus-visible:border-gold focus-visible:ring-0"

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: string
  optional?: boolean
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[14px] font-semibold text-charcoal"
    >
      {children}
      {!optional ? (
        <span className="text-gold-deep"> *</span>
      ) : (
        <span className="ml-1 font-normal text-ink-60">(optional)</span>
      )}
    </label>
  )
}

export default function Contact() {
  useHeroTone("dark")
  const { settings } = useSiteSettings()
  const { services } = useServices()
  const { query } = useRouter()
  const preselected = query.get("matter") ?? ""

  const [status, setStatus] = useState<Status>("idle")
  const [isSending, setIsSending] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [challengeToken, setChallengeToken] = useState("")
  const [challengeReset, setChallengeReset] = useState(0)
  const [honeypot, setHoneypot] = useState("")
  const contactReady = productionConfig.contactConfigured
  const client = useMemo(() => createContactClient({
    url: productionConfig.url, key: productionConfig.publicKey, projectRef: EXPECTED_PROJECT_REF, enabled: contactReady,
    storage: { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value), removeItem: key => window.localStorage.removeItem(key) },
  }), [contactReady])
  const sending = useRef(false)
  const confirmation = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (status === "sent") confirmation.current?.focus()
  }, [status])
  const [errors, setErrors] = useState<Errors>({})
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: preselected,
    message: "",
  })
  const subjectOptions = useMemo(() => {
    const list = services.length > 0 ? services : defaultServices
    return list.map((s) => s.title)
  }, [services])

  function set<K extends keyof typeof values>(key: K, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }))
    if (errors[(key as keyof Errors)]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function validate(): Errors {
    return validateEnquiry(values)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (sending.current) return
    if (!contactReady || !challengeToken) { setSubmitError(contactReady ? "Please complete verification before submitting." : "Online enquiries are unavailable at the moment. Please contact the firm by phone or email."); return }
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      // Move focus to the first invalid field.
      const first = document.getElementById(Object.keys(next)[0])
      first?.focus({ preventScroll: true })
      first?.scrollIntoView({ behavior: "instant", block: "center" })
      return
    }

    sending.current = true
    setIsSending(true)
    setSubmitError("")
    try {
      await client.submit(normalizeEnquiry(values), challengeToken, honeypot)
      setStatus("sent")
    } catch (error) {
      setSubmitError(
        error instanceof ContactFailure
          ? error.message
          : "We could not send your enquiry right now. Please try again.",
      )
    } finally {
      setChallengeToken("")
      setChallengeReset(value => value + 1)
      sending.current = false
      setIsSending(false)
    }
  }

  return (
    <>
      <SEOHead
        title="Contact & Chamber Consultations"
        description="Contact Avance Law Partners in Hatirjheel, Dhaka. Start with a consultation regarding your corporate or legal matter."
        canonicalPath="/contact"
      />
      <section className="relative overflow-hidden bg-obsidian text-ivory arch-grid">
        <div
          aria-hidden
          className="absolute -right-[12%] top-20 h-[33rem] w-[33rem] rounded-full border border-gold/20"
        />
        <div
          aria-hidden
          className="absolute -right-[5%] top-32 h-[25rem] w-[25rem] rounded-full border border-gold/15"
        />
        <Container className="relative pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-14 lg:pt-40">
          <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_.75fr]">
            <div>
              <p className="eyebrow text-gold">Contact · Dhaka</p>
              <h1 className="display-hero mt-5 max-w-3xl text-ivory">
                Start with a conversation.
              </h1>
            </div>
            <p className="max-w-md border-l border-gold/50 pl-6 text-[18px] leading-relaxed text-ivory/75 lg:justify-self-end">
              Tell us a little about the matter and we will point you to the
              right counsel and a sensible next step.
            </p>
          </div>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
            <a
              href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}
              className="control-parent contact-method"
            >
              <span aria-hidden className="action-mark action-mark--dark"><Phone size={17} /></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                Call Israt
              </span>
              <span className="mt-1 text-[15px] font-semibold text-ivory sm:text-[16px]">
                {contactPhone}
              </span>
              <span className="mt-1 text-[11px] text-ivory/55">
                Managing Partner
              </span>
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="control-parent contact-method min-w-0"
            >
              <span aria-hidden className="action-mark action-mark--dark"><Mail size={17} /></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                Email Israt
              </span>
              <span className="mt-1 break-words text-[15px] font-semibold text-ivory sm:text-[16px]">
                {contactEmail}
              </span>
              <span className="mt-1 text-[11px] text-ivory/55">
                Managing Partner
              </span>
            </a>
          </div>
        </Container>
      </section>

      <section className="relative bg-ivory paper-grain">
        <Container className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-4xl">
            {/* Form */}
            <div className="border-t-2 border-obsidian pt-7">
              <div className="mb-9 flex items-baseline justify-between border-b border-line-light pb-4">
                <p className="eyebrow text-ink-60">Enquiry form</p>
                <span className="font-serif text-[18px] text-gold-deep">
                  01
                </span>
              </div>
              {status === "sent" ? (
                <div
                  ref={confirmation}
                  tabIndex={-1}
                  role="status"
                  className="border-y border-gold/40 bg-gold/10 p-8"
                >
                  <p className="eyebrow text-gold-deep">Enquiry sent</p>
                  <h2 className="mt-3 font-serif text-[30px] text-obsidian">
                    Thank you for contacting Avance Law Partners.
                  </h2>
                  <p className="mt-3 max-w-md text-[16px] leading-relaxed text-charcoal/80">
                    Your enquiry has been accepted for delivery. Our team will
                    respond as soon as possible.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  aria-busy={isSending}
                  className="space-y-6"
                >
                  {!contactReady && (
                    <p role="status" className="text-[13px] text-ink-60">
                      Online enquiries are unavailable at the moment. Please contact
                      the firm by phone or email.
                    </p>
                  )}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <input
                        id="name"
                        name="name"
                        disabled={isSending}
                        autoComplete="name"
                        required
                        maxLength={120}
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-err" : undefined}
                        className={`${fieldBase} ${
                          errors.name ? "border-red-800" : "border-line-light"
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="name-err"
                          className="mt-1.5 text-[13px] text-red-900"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <input
                        id="email"
                        name="email"
                        disabled={isSending}
                        autoComplete="email"
                        required
                        maxLength={254}
                        type="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-err" : undefined
                        }
                        className={`${fieldBase} ${
                          errors.email ? "border-red-800" : "border-line-light"
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="email-err"
                          className="mt-1.5 text-[13px] text-red-900"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" optional>
                      Phone
                    </Label>
                    {errors.phone && (
                      <p
                        id="phone-err"
                        className="mt-1.5 text-[13px] text-red-900"
                      >
                        {errors.phone}
                      </p>
                    )}
                    <input
                      id="phone"
                      name="phone"
                      disabled={isSending}
                      autoComplete="tel"
                      maxLength={60}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-err" : undefined}
                      type="tel"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={`${fieldBase} border-line-light`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject / Legal matter</Label>
                    <select
                      id="subject"
                      name="subject"
                      disabled={isSending}
                      required
                      value={values.subject}
                      onChange={(e) => set("subject", e.target.value)}
                      aria-invalid={!!errors.subject}
                      aria-describedby={
                        errors.subject ? "subject-err" : undefined
                      }
                      className={`${fieldBase} ${
                        errors.subject ? "border-red-800" : "border-line-light"
                      } ${values.subject ? "text-charcoal" : "text-ink-60/70"}`}
                    >
                      <option value="">Select a legal matter…</option>
                      {preselected && !subjectOptions.includes(preselected) && (
                        <option value={preselected}>
                          Selected matter: {preselected.slice(0, 160)}
                        </option>
                      )}
                      {subjectOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                      <option value="Other / general enquiry">
                        Other / general enquiry
                      </option>
                    </select>
                    {errors.subject && (
                      <p
                        id="subject-err"
                        className="mt-1.5 text-[13px] text-red-900"
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      name="message"
                      disabled={isSending}
                      required
                      maxLength={5000}
                      rows={5}
                      value={values.message}
                      onChange={(e) => set("message", e.target.value)}
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-err" : undefined
                      }
                      className={`${fieldBase} resize-y ${
                        errors.message ? "border-red-800" : "border-line-light"
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="message-err"
                        className="mt-1.5 text-[13px] text-red-900"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={event => setHoneypot(event.target.value)} /></label></div>
                  {contactReady && <TurnstileWidget siteKey={productionConfig.siteKey} resetKey={challengeReset} onToken={setChallengeToken} />}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button
                      type="submit"
                      disabled={isSending || !contactReady || !challengeToken}
                      aria-busy={isSending}
                      size="lg"
                      withArrow
                    >
                      {isSending ? "Sending…" : "Send enquiry"}
                    </Button>
                    <p className="text-[13px] leading-relaxed text-ink-60">
                      By sending an enquiry you agree to our{" "}
                      <AppLink
                        to="/privacy"
                        className="font-semibold text-gold-deep underline underline-offset-4"
                      >
                        Privacy Policy
                      </AppLink>
                      .
                    </p>
                  </div>
                  <p className="text-[12px] italic text-ink-60">
                    Contact / privacy notice, placeholder pending firm review.
                  </p>
                  {submitError && (
                    <p
                      role="alert"
                      className="text-[13px] leading-relaxed text-red-900"
                    >
                      {submitError}{" "}
                      <a
                        href={`mailto:${contactEmail}`}
                        className="underline underline-offset-4"
                      >
                        Email the firm instead
                      </a>
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line-light bg-stone">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-5 sm:grid-cols-[.55fr_1.45fr] sm:gap-10">
            <div>
              <p className="eyebrow text-gold-deep">Our office</p>
            </div>
            <div>
              <address className="not-italic text-[16px] leading-relaxed text-charcoal sm:text-[18px]">
                <span className="block">{settings.address_line_1}</span>
                <span className="block">{settings.address_line_2}</span>
                <span className="block">{settings.address_line_3}</span>
              </address>
              {settings.office_hours && (
                <p className="mt-4 text-[13px] leading-relaxed text-ink-60">
                  <span className="font-semibold text-charcoal">
                    Office Hours:
                  </span>{" "}
                  {settings.office_hours}
                </p>
              )}
              <div className="mt-6">
                <InlineLink to="/approach">How we work</InlineLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
