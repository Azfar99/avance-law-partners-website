import { useState, useEffect, type FormEvent } from "react"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useService, type DBService } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import Toast from "./components/Toast"

export default function AdminServiceEdit({ slug }: { slug?: string }) {
  const isNew = !slug || slug === "new"
  const { service: existingService, refresh } = useService(
    isNew ? "" : slug,
    true,
  )
  const { navigate } = useRouter()

  const [formData, setFormData] = useState<DBService>({
    index_number: "09",
    title: "",
    slug: "",
    summary: "",
    intro: "",
    items: [],
    published: true,
    display_order: 9,
  })

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (existingService) {
      setFormData(existingService)
    }
  }, [existingService])

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleTitleChange = (title: string) => {
    if (
      isNew &&
      (!formData.slug || formData.slug === slugify(formData.title))
    ) {
      setFormData({ ...formData, title, slug: slugify(title) })
    } else {
      setFormData({ ...formData, title })
    }
  }

  const handleItemChange = (index: number, val: string) => {
    const list = [...(formData.items || [])]
    list[index] = val
    setFormData({ ...formData, items: list })
  }

  const addItem = () => {
    setFormData({ ...formData, items: [...(formData.items || []), ""] })
  }

  const removeItem = (index: number) => {
    const list = [...(formData.items || [])]
    list.splice(index, 1)
    setFormData({ ...formData, items: list })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert("Title and slug are required.")
      return
    }

    setSaving(true)
    const result =
      formData.id && !isNew
        ? await supabase.from("services").update(formData).eq("id", formData.id)
        : await supabase.from("services").insert(formData)
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
    setToast("Practice area updated successfully!")
    setTimeout(() => {
      navigate("/admin/services")
    }, 1200)
  }

  return (
    <AdminLayout
      title={
        isNew
          ? "Add Practice Area"
          : `Edit Practice Area: ${formData.title || "Service"}`
      }
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-20">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="text-xs font-semibold text-charcoal/70 hover:text-obsidian"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft aria-hidden size={13} /> Back to all services
            </span>
          </button>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-charcoal bg-stone/50 px-3 py-1.5 rounded border border-line-light">
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

        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-6">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Overview & Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField label="Index Number" required>
              <input
                type="text"
                required
                value={formData.index_number}
                onChange={(e) =>
                  setFormData({ ...formData, index_number: e.target.value })
                }
                placeholder="01"
                className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none text-center font-mono"
              />
            </FormField>

            <div className="md:col-span-3">
              <FormField label="Practice Area Title" required>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Corporate & Company Law"
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>

            <div className="md:col-span-4">
              <FormField label="URL Slug" required>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: slugify(e.target.value) })
                  }
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-xs font-mono text-charcoal focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>

            <div className="md:col-span-4">
              <FormField
                label="Short Summary"
                description="Displayed in the homepage preview table"
              >
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Concise overview of what this practice covers..."
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
                />
              </FormField>
            </div>

            <div className="md:col-span-4">
              <FormField
                label="Intro Statement (Optional)"
                description="Lead paragraph shown before the bullet points"
              >
                <input
                  type="text"
                  value={formData.intro || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, intro: e.target.value })
                  }
                  placeholder="e.g. We provide legal representation and advisory services..."
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Scope Items */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-line-light pb-3">
            <div>
              <h2 className="font-serif text-lg text-obsidian">
                Included Legal Services (Scope)
              </h2>
              <p className="text-xs text-ink-60">
                The specific bullet points displayed under this practice area
              </p>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-gold-deep border border-gold/40 px-3 py-1.5 rounded hover:bg-gold/10"
            >
              <span className="inline-flex items-center gap-1">
                <Plus aria-hidden size={13} /> Add Item
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {(formData.items || []).map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <span className="text-xs text-ink-60 w-6 text-right font-mono">
                  {idx + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(idx, e.target.value)}
                  placeholder="e.g. Company incorporation and registration in Bangladesh"
                  className="flex-1 rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-xs text-red-600 px-2.5 py-2 hover:bg-red-50 rounded"
                >
                  <X aria-hidden size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-4 z-20 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/services")}
            className="rounded bg-stone px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-line-light transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gold px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] shadow-lg transition-all focus:outline-none disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isNew
                ? "Create Practice Area"
                : "Update Practice Area"}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
