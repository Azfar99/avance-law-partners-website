import { useState, useEffect, type FormEvent } from "react"
import { usePageContent } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import Toast from "./components/Toast"

export default function AdminPageEditor() {
  const { content: homeContent, refresh } = usePageContent("home")
  const [fields, setFields] = useState<Record<string, string>>(homeContent)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setFields(homeContent)
  }, [homeContent])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    for (const [key, value] of Object.entries(fields)) {
      const result = await supabase.from("page_content").insert({
        page_key: "home",
        section_key: key,
        content: value,
      })
      if (result.error) {
        setSaving(false)
        setToast(
          "Could not save homepage content. " +
            (result.error.message || "Please try again."),
        )
        return
      }
    }

    await refresh()
    setSaving(false)
    setToast("Homepage content updated successfully!")
  }

  return (
    <AdminLayout title="Website Page Content Editor">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-20">
        <p className="text-sm text-ink-60">
          Edit headlines, mission statements, and section intros appearing on
          the homepage without touching code.
        </p>

        {/* Hero Section */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Hero Section (Homepage Header)
          </h2>

          <FormField label="Hero Eyebrow (Top Small Label)">
            <input
              type="text"
              value={fields.hero_eyebrow || ""}
              onChange={(e) =>
                setFields({ ...fields, hero_eyebrow: e.target.value })
              }
              placeholder="AVANCE LAW PARTNERS · DHAKA, BANGLADESH"
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </FormField>

          <FormField label="Hero Main Title (H1)">
            <input
              type="text"
              value={fields.hero_title || ""}
              onChange={(e) =>
                setFields({ ...fields, hero_title: e.target.value })
              }
              placeholder="Legal excellence. Practical solutions."
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none font-serif text-lg"
            />
          </FormField>

          <FormField label="Hero Subtitle / Description">
            <input
              type="text"
              value={fields.hero_subtitle || ""}
              onChange={(e) =>
                setFields({ ...fields, hero_subtitle: e.target.value })
              }
              placeholder="Providing trusted legal counsel and representation since 1998."
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </FormField>
        </div>

        {/* Intro Section */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Firm Overview (Section 1)
          </h2>

          <FormField label="Section Heading">
            <input
              type="text"
              value={fields.intro_heading || ""}
              onChange={(e) =>
                setFields({ ...fields, intro_heading: e.target.value })
              }
              placeholder="Established in 1998. Focused on your next step."
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none font-serif"
            />
          </FormField>

          <FormField label="Primary Statement">
            <textarea
              rows={3}
              value={fields.intro_primary || ""}
              onChange={(e) =>
                setFields({ ...fields, intro_primary: e.target.value })
              }
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>

          <FormField label="Secondary Practice Scope Statement">
            <textarea
              rows={3}
              value={fields.intro_secondary || ""}
              onChange={(e) =>
                setFields({ ...fields, intro_secondary: e.target.value })
              }
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>
        </div>

        {/* Approach Section */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Our Approach Section
          </h2>

          <FormField label="Approach Core Statement">
            <textarea
              rows={3}
              value={fields.approach_statement || ""}
              onChange={(e) =>
                setFields({ ...fields, approach_statement: e.target.value })
              }
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>
        </div>

        {/* Contact Invitation */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Contact Call-to-Action
          </h2>

          <FormField label="Contact Card Title">
            <input
              type="text"
              value={fields.contact_heading || ""}
              onChange={(e) =>
                setFields({ ...fields, contact_heading: e.target.value })
              }
              placeholder="Start with a conversation."
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none font-serif"
            />
          </FormField>

          <FormField label="Contact Card Subtitle">
            <textarea
              rows={2}
              value={fields.contact_subtitle || ""}
              onChange={(e) =>
                setFields({ ...fields, contact_subtitle: e.target.value })
              }
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>
        </div>

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gold px-8 py-3 font-semibold text-xs uppercase tracking-widest text-obsidian hover:bg-[#d8b32e] shadow-lg transition-all focus:outline-none disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Page Content"}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
