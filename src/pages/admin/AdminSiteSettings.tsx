import { useState, useEffect, type FormEvent } from "react"
import { Plus, X } from "lucide-react"
import { useSiteSettings, type SiteSettings } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import Toast from "./components/Toast"

export default function AdminSiteSettings() {
  const { settings, refresh } = useSiteSettings()
  const [formData, setFormData] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const result = formData.id
      ? await supabase
          .from("site_settings")
          .update(formData)
          .eq("id", formData.id)
      : await supabase.from("site_settings").insert(formData)
    if (result.error) {
      setSaving(false)
      setToast(
        "Could not save changes. " +
          (result.error.message || "Please try again."),
      )
      return
    }

    await refresh()
    setSaving(false)
    setToast(
      "Website settings updated successfully. Changes are live on your website!",
    )
  }

  const addSocialLink = () => {
    setFormData({
      ...formData,
      social_links: [
        ...(formData.social_links || []),
        { label: "LinkedIn", url: "" },
      ],
    })
  }

  const removeSocialLink = (index: number) => {
    const next = [...(formData.social_links || [])]
    next.splice(index, 1)
    setFormData({ ...formData, social_links: next })
  }

  const updateSocialLink = (
    index: number,
    key: "label" | "url",
    value: string,
  ) => {
    const next = [...(formData.social_links || [])]
    next[index] = { ...next[index], [key]: value }
    setFormData({ ...formData, social_links: next })
  }

  return (
    <AdminLayout title="Website & Firm Settings">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
        {/* Section 1: Firm Overview */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            General Firm Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Firm Name" required>
              <input
                type="text"
                required
                value={formData.firm_name}
                onChange={(e) =>
                  setFormData({ ...formData, firm_name: e.target.value })
                }
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Year Established" required>
              <input
                type="text"
                required
                value={formData.established}
                onChange={(e) =>
                  setFormData({ ...formData, established: e.target.value })
                }
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Firm Tagline" required>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Section 2: Physical Address */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Chamber Physical Address
          </h2>
          <p className="text-xs text-ink-60">
            Updating the address here automatically updates the Contact page,
            Footer, and consultation cards.
          </p>

          <div className="space-y-4">
            <FormField label="Address Line 1">
              <input
                type="text"
                value={formData.address_line_1}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_1: e.target.value })
                }
                placeholder="House 5, Block A, Road No. 2"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Address Line 2">
              <input
                type="text"
                value={formData.address_line_2}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_2: e.target.value })
                }
                placeholder="Mohanagar Project, Hatirjheel"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="City & Country">
              <input
                type="text"
                value={formData.address_line_3}
                onChange={(e) =>
                  setFormData({ ...formData, address_line_3: e.target.value })
                }
                placeholder="Dhaka, Bangladesh"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Section 3: Official Contact Channels */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Contact Channels
          </h2>
          <p className="text-xs text-ink-60">
            Leave blank if not ready. When filled, these automatically appear on
            the Contact page and Footer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Telephone / Mobile">
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Public Firm Email">
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="info@avancelawpartners.info"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="WhatsApp Business Number">
              <input
                type="text"
                value={formData.whatsapp || ""}
                onChange={(e) =>
                  setFormData({ ...formData, whatsapp: e.target.value })
                }
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Chamber Hours">
              <input
                type="text"
                value={formData.office_hours || ""}
                onChange={(e) =>
                  setFormData({ ...formData, office_hours: e.target.value })
                }
                placeholder="Sunday – Thursday: 9:00 AM – 7:00 PM"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-line-light pb-3">
            <div>
              <h2 className="font-serif text-lg text-obsidian">
                Social Profiles
              </h2>
              <p className="text-xs text-ink-60">LinkedIn, Facebook, etc.</p>
            </div>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-xs font-semibold text-gold-deep border border-gold/40 px-3 py-1.5 rounded hover:bg-gold/10 transition-colors"
            >
              <span className="inline-flex items-center gap-1">
                <Plus aria-hidden size={13} /> Add Link
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {(formData.social_links || []).map((link, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) =>
                    updateSocialLink(idx, "label", e.target.value)
                  }
                  placeholder="Platform (e.g. LinkedIn)"
                  className="w-1/3 rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="text-xs font-semibold text-red-700 p-2 hover:bg-red-50 rounded"
                  title="Remove"
                >
                  <X aria-hidden size={14} />
                </button>
              </div>
            ))}
            {(!formData.social_links || formData.social_links.length === 0) && (
              <p className="text-xs italic text-ink-60 py-2">
                No social media links configured yet.
              </p>
            )}
          </div>
        </div>

        {/* Submit action */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gold px-8 py-3 font-semibold text-xs uppercase tracking-widest text-obsidian hover:bg-[#d8b32e] shadow-lg transition-all focus:outline-none disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Website Settings"}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
