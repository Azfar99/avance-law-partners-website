import { useState, useEffect, type FormEvent } from "react"
import { supabase } from "../../lib/supabase"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import Toast from "./components/Toast"

interface SEORow {
  id?: string
  page_key: string
  title: string
  description: string
  og_title: string
  og_description: string
  canonical_slug: string
}

const PAGES = [
  { key: "home", label: "Homepage (/)" },
  { key: "about", label: "About Us (/about)" },
  { key: "services", label: "Practice Areas (/services)" },
  { key: "lawyers", label: "Lawyers Directory (/lawyers)" },
  { key: "contact", label: "Contact & Consultations (/contact)" },
  { key: "approach", label: "Our Approach (/approach)" },
]

export default function AdminSEO() {
  const [selectedPage, setSelectedPage] = useState("home")
  const [formData, setFormData] = useState<SEORow>({
    page_key: "home",
    title:
      "Avance Law Partners | Legal Excellence Since 1998 | Dhaka, Bangladesh",
    description:
      "Providing trusted legal counsel and representation for companies, institutions and individuals across corporate, commercial, regulatory and dispute matters.",
    og_title: "Avance Law Partners",
    og_description:
      "Providing trusted legal counsel and representation since 1998 in Dhaka, Bangladesh.",
    canonical_slug: "/",
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("seo_metadata")
        .select("*")
        .eq("page_key", selectedPage)
        .limit(1)
      if (data && data.length > 0) {
        setFormData(data[0])
      } else {
        setFormData({
          page_key: selectedPage,
          title: `Avance Law Partners | ${PAGES.find((p) => p.key === selectedPage)?.label}`,
          description:
            "Providing trusted legal counsel and representation for companies, institutions and individuals in Dhaka, Bangladesh since 1998.",
          og_title: "Avance Law Partners",
          og_description:
            "Providing trusted legal counsel and representation since 1998 in Dhaka, Bangladesh.",
          canonical_slug: selectedPage === "home" ? "/" : `/${selectedPage}`,
        })
      }
    }
    load()
  }, [selectedPage])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const result = formData.id
      ? await supabase
          .from("seo_metadata")
          .update(formData)
          .eq("id", formData.id)
      : await supabase.from("seo_metadata").insert(formData)
    if (result.error) {
      setSaving(false)
      setToast(
        "Could not save changes. " +
          (result.error.message || "Please try again."),
      )
      return
    }

    setSaving(false)
    setToast("SEO metadata updated successfully!")
  }

  return (
    <AdminLayout title="Search Engine Optimization (SEO)">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="space-y-6 max-w-4xl pb-16">
        <p className="text-sm text-ink-60">
          Control how your website appears on Google Search results and social
          media shares (Facebook, LinkedIn, Twitter).
        </p>

        {/* Page selector */}
        <div className="flex flex-wrap gap-2 bg-ivory p-2 rounded-lg border border-line-light">
          {PAGES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedPage(p.key)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                selectedPage === p.key
                  ? "bg-obsidian text-ivory"
                  : "text-charcoal/70 hover:text-obsidian hover:bg-stone/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Google Search Result Preview */}
        <div className="bg-stone/40 border border-line-light rounded-lg p-5 space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-60 font-semibold block mb-2">
            Google Search Preview
          </span>
          <div className="text-xs text-[#202124] flex items-center gap-1.5">
            <span>https://avancelawpartners.info</span>
            <span className="text-charcoal/40">›</span>
            <span className="text-charcoal/60">{formData.canonical_slug}</span>
          </div>
          <div className="text-lg text-[#1a0dab] font-serif hover:underline cursor-pointer">
            {formData.title || "Avance Law Partners"}
          </div>
          <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {formData.description || "Website description..."}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-5"
        >
          <FormField
            label="SEO Browser Title Tag"
            required
            description="Appears as the blue link on Google and on browser tab"
          >
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
            label="Meta Description"
            required
            description="150–160 characters summary snippet shown on Google search"
          >
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-line-light">
            <FormField
              label="OpenGraph Share Title"
              description="Title when link is shared on LinkedIn or WhatsApp"
            >
              <input
                type="text"
                value={formData.og_title}
                onChange={(e) =>
                  setFormData({ ...formData, og_title: e.target.value })
                }
                className="w-full rounded border border-line-light bg-stone/20 px-3 py-1.5 text-xs text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Canonical Path">
              <input
                type="text"
                value={formData.canonical_slug}
                onChange={(e) =>
                  setFormData({ ...formData, canonical_slug: e.target.value })
                }
                className="w-full rounded border border-line-light bg-stone/20 px-3 py-1.5 text-xs text-charcoal focus:border-gold focus:outline-none font-mono"
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-gold px-8 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] shadow-md transition-all focus:outline-none disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
