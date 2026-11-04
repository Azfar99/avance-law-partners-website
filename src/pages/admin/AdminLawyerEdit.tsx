import { useState, useEffect, type FormEvent } from "react"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useLawyer, type DBLawyer } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import FormField from "./components/FormField"
import ImageUpload from "./components/ImageUpload"
import Toast from "./components/Toast"

export default function AdminLawyerEdit({ slug }: { slug?: string }) {
  const isNew = !slug || slug === "new"
  const { lawyer: existingLawyer, refresh } = useLawyer(isNew ? "" : slug, true)
  const { navigate } = useRouter()

  const [formData, setFormData] = useState<DBLawyer>({
    name: "",
    slug: "",
    designation: "Advocate",
    photo_url: "",
    biography: "",
    education: ["LL.B (Honours)"],
    qualifications: ["Enrolled Advocate"],
    court_memberships: ["High Court Division, Supreme Court of Bangladesh"],
    bar_memberships: ["Dhaka Bar Association"],
    languages: ["English", "Bangla"],
    email: "",
    phone: "",
    linkedin: "",
    published: true,
    display_order: 1,
  })

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (existingLawyer) {
      setFormData(existingLawyer)
    }
  }, [existingLawyer])

  const handleNameChange = (name: string) => {
    if (isNew && (!formData.slug || formData.slug === slugify(formData.name))) {
      setFormData({ ...formData, name, slug: slugify(name) })
    } else {
      setFormData({ ...formData, name })
    }
  }

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleListChange = (
    field: "education" | "qualifications" | "court_memberships" | "bar_memberships" | "languages",
    index: number,
    value: string,
  ) => {
    const list = [...(formData[field] || [])]
    list[index] = value
    setFormData({ ...formData, [field]: list })
  }

  const addListItem = (
    field: "education" | "qualifications" | "court_memberships" | "bar_memberships" | "languages",
  ) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ""] })
  }

  const removeListItem = (
    field: "education" | "qualifications" | "court_memberships" | "bar_memberships" | "languages",
    index: number,
  ) => {
    const list = [...(formData[field] || [])]
    list.splice(index, 1)
    setFormData({ ...formData, [field]: list })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert("Name and URL slug are required.")
      return
    }

    setSaving(true)
    const result =
      formData.id && !isNew
        ? await supabase.from("lawyers").update(formData).eq("id", formData.id)
        : await supabase.from("lawyers").insert(formData)
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
    setToast("Lawyer profile saved successfully!")
    setTimeout(() => {
      navigate("/admin/lawyers")
    }, 1200)
  }

  return (
    <AdminLayout
      title={
        isNew
          ? "Add New Lawyer Profile"
          : `Edit Profile: ${formData.name || "Lawyer"}`
      }
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-20">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/lawyers")}
            className="text-xs font-semibold text-charcoal/70 hover:text-obsidian"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft aria-hidden size={13} /> Back to all lawyers
            </span>
          </button>
          <div className="flex items-center gap-3">
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
        </div>

        {/* Basic Details */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-6">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Basic Details & Photo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div>
              <FormField
                label="Lawyer Portrait / Photo"
                description="Recommended: 4:5 ratio formal photo"
              >
                <ImageUpload
                  value={formData.photo_url || ""}
                  onChange={(url) =>
                    setFormData({ ...formData, photo_url: url })
                  }
                  label="Upload Photo"
                />
              </FormField>
            </div>

            <div className="md:col-span-2 space-y-4">
              <FormField label="Full Name" required>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Barrister / Advocate Name"
                  className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Title / Designation">
                  <input
                    type="text"
                    value={formData.designation || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    placeholder="e.g. Partner, Senior Advocate"
                    className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none"
                  />
                </FormField>

                <FormField
                  label="URL Slug"
                  required
                  description="Appears in website address bar"
                >
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: slugify(e.target.value),
                      })
                    }
                    placeholder="e.g. rishad"
                    className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none font-mono text-xs"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <FormField
            label="Biography & Practice Focus"
            description="Overview of legal background and experience"
          >
            <textarea
              rows={4}
              value={formData.biography || ""}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              placeholder="Describe the lawyer's professional background, focus areas, and counsel style..."
              className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
            />
          </FormField>
        </div>

        {/* Credentials & Memberships */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-6">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Credentials, Education & Bar Memberships
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-charcoal">
                Education Degrees
              </label>
              <button
                type="button"
                onClick={() => addListItem("education")}
                className="text-xs font-semibold text-gold-deep border border-gold/40 px-2 py-1 rounded hover:bg-gold/10"
              >
                <span className="inline-flex items-center gap-1">
                  <Plus aria-hidden size={13} /> Add Degree
                </span>
              </button>
            </div>
            {(formData.education || []).map((deg, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={deg}
                  onChange={(e) =>
                    handleListChange("education", idx, e.target.value)
                  }
                  placeholder="e.g. LL.B (Honours), University of Dhaka"
                  className="flex-1 rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("education", idx)}
                  className="text-xs text-red-600 px-2 hover:bg-red-50 rounded"
                >
                  <X aria-hidden size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-line-light">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-charcoal">
                Court Memberships
              </label>
              <button
                type="button"
                onClick={() => addListItem("court_memberships")}
                className="text-xs font-semibold text-gold-deep border border-gold/40 px-2 py-1 rounded hover:bg-gold/10"
              >
                <span className="inline-flex items-center gap-1">
                  <Plus aria-hidden size={13} /> Add Court
                </span>
              </button>
            </div>
            {(formData.court_memberships || []).map((court, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={court}
                  onChange={(e) =>
                    handleListChange("court_memberships", idx, e.target.value)
                  }
                  placeholder="e.g. High Court Division, Supreme Court of Bangladesh"
                  className="flex-1 rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("court_memberships", idx)}
                  className="text-xs text-red-600 px-2 hover:bg-red-50 rounded"
                >
                  <X aria-hidden size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-line-light">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-charcoal">
                Bar Association Memberships
              </label>
              <button
                type="button"
                onClick={() => addListItem("bar_memberships")}
                className="text-xs font-semibold text-gold-deep border border-gold/40 px-2 py-1 rounded hover:bg-gold/10"
              >
                <span className="inline-flex items-center gap-1">
                  <Plus aria-hidden size={13} /> Add Bar
                </span>
              </button>
            </div>
            {(formData.bar_memberships || []).map((bar, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={bar}
                  onChange={(e) =>
                    handleListChange("bar_memberships", idx, e.target.value)
                  }
                  placeholder="e.g. Supreme Court Bar Association / Dhaka Bar Association"
                  className="flex-1 rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeListItem("bar_memberships", idx)}
                  className="text-xs text-red-600 px-2 hover:bg-red-50 rounded"
                >
                  <X aria-hidden size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Links */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-lg text-obsidian border-b border-line-light pb-3">
            Contact & Social Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Direct Email">
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="counsel@avancelawpartners.info"
                className="w-full rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="Direct Telephone">
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+880 1XXXXXXXXX"
                className="w-full rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>

            <FormField label="LinkedIn Profile URL">
              <input
                type="url"
                value={formData.linkedin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded border border-line-light bg-stone/20 px-3 py-1.5 text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-4 z-20 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/lawyers")}
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
                ? "Create Lawyer Profile"
                : "Update Profile"}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
