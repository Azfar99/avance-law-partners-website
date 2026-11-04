import { useState, useEffect, type FormEvent } from "react"
import { useLegalPage, type DBLegalPage } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import Toast from "./components/Toast"

export default function AdminLegalPages() {
  const [selectedType, setSelectedType] =
    useState<"privacy" | "disclaimer" | "terms">("privacy")
  const { legal, refresh } = useLegalPage(selectedType, true)

  const [formData, setFormData] = useState<DBLegalPage>(legal)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    setFormData(legal)
  }, [legal])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const result = formData.id
      ? await supabase
          .from("legal_pages")
          .update(formData)
          .eq("id", formData.id)
      : await supabase.from("legal_pages").insert(formData)
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
    setToast(`${formData.title} saved successfully.`)
  }

  return (
    <AdminLayout title="Legal & Compliance Documents">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="space-y-6 max-w-4xl pb-16">
        <div className="flex items-center gap-2 bg-ivory p-1.5 rounded-lg border border-line-light w-fit">
          <button
            type="button"
            onClick={() => setSelectedType("privacy")}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
              selectedType === "privacy"
                ? "bg-obsidian text-ivory"
                : "text-charcoal/70 hover:text-obsidian"
            }`}
          >
            Privacy Policy (/privacy)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("disclaimer")}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
              selectedType === "disclaimer"
                ? "bg-obsidian text-ivory"
                : "text-charcoal/70 hover:text-obsidian"
            }`}
          >
            Legal Disclaimer (/disclaimer)
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("terms")}
            className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
              selectedType === "terms"
                ? "bg-obsidian text-ivory"
                : "text-charcoal/70 hover:text-obsidian"
            }`}
          >
            Terms of Use (/terms)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-line-light pb-4">
              <h2 className="font-serif text-xl text-obsidian">
                {formData.title}
              </h2>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="accent-gold rounded"
                />
                <span>Published on Website</span>
              </label>
            </div>

            <FormField label="Document Title" required>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField
              label="Document Text / Policy Content"
              description="Enter the official text for this legal policy"
            >
              <textarea
                rows={12}
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder="Enter formal legal text here..."
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2.5 text-sm text-charcoal focus:border-gold focus:outline-none resize-y leading-relaxed"
              />
            </FormField>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-gold px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] shadow-md transition-all focus:outline-none disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Legal Document"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
