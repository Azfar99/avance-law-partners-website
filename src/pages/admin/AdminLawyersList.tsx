import { Plus } from "lucide-react"
import { useState } from "react"
import { useLawyers, type DBLawyer } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import ConfirmDialog from "./components/ConfirmDialog"
import Toast from "./components/Toast"

export default function AdminLawyersList() {
  const { lawyers, refresh } = useLawyers(true)
  const { navigate } = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<DBLawyer | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const togglePublish = async (lawyer: DBLawyer) => {
    const nextState = !lawyer.published
    if (lawyer.id) {
      const result = await supabase
        .from("lawyers")
        .update({ published: nextState })
        .eq("id", lawyer.id)
      if (result.error) {
        setToast(
          "Could not change publication. " +
            (result.error.message || "Please try again."),
        )
        return
      }
    }
    await refresh()
    setToast(
      `Lawyer "${lawyer.name}" is now ${
        nextState ? "published on the website" : "hidden from the website"
      }.`,
    )
  }

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= lawyers.length) return

    const current = lawyers[index]
    const target = lawyers[targetIndex]

    const tempOrder = current.display_order
    current.display_order = target.display_order
    target.display_order = tempOrder

    if (current.id)
      await supabase
        .from("lawyers")
        .update({ display_order: current.display_order })
        .eq("id", current.id)
    if (target.id)
      await supabase
        .from("lawyers")
        .update({ display_order: target.display_order })
        .eq("id", target.id)

    await refresh()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    if (deleteTarget.id) {
      const result = await supabase
        .from("lawyers")
        .delete()
        .eq("id", deleteTarget.id)
      if (result.error) {
        setDeleteTarget(null)
        setToast(
          "Could not delete this profile. " +
            (result.error.message || "Please try again."),
        )
        return
      }
    }
    setDeleteTarget(null)
    await refresh()
    setToast("Lawyer profile removed successfully.")
  }

  return (
    <AdminLayout title="Lawyers & Legal Counsel">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Lawyer Profile?"
          message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete Lawyer"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-ink-60">
            Manage lawyer profiles appearing on your public website. You can
            reorder, edit, or hide profiles anytime without programming.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/lawyers/new")}
          className="rounded bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            <Plus aria-hidden size={14} /> Add New Lawyer
          </span>
        </button>
      </div>

      <div className="bg-ivory rounded-lg border border-line-light overflow-hidden shadow-xs">
        <div className="divide-y divide-line-light">
          {lawyers.map((lawyer, idx) => (
            <div
              key={lawyer.id || lawyer.slug}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveOrder(idx, "up")}
                    className="text-xs text-charcoal/40 hover:text-obsidian disabled:opacity-20 leading-none p-1"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    disabled={idx === lawyers.length - 1}
                    onClick={() => moveOrder(idx, "down")}
                    className="text-xs text-charcoal/40 hover:text-obsidian disabled:opacity-20 leading-none p-1"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>

                {/* Avatar / Initials */}
                <div className="h-12 w-10 rounded bg-stone border border-line-light overflow-hidden flex items-center justify-center flex-shrink-0">
                  {lawyer.photo_url ? (
                    <img
                      src={lawyer.photo_url}
                      alt={lawyer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-lg font-bold text-gold-deep">
                      {lawyer.name.charAt(0) || "A"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-obsidian font-medium">
                      {lawyer.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${
                        lawyer.published
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {lawyer.published
                        ? "● Live on Site"
                        : "○ Unpublished Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-60 mt-0.5">
                    {lawyer.designation || "Advocate"} · Slug:{" "}
                    <code className="text-[11px] font-mono">
                      /lawyers/{lawyer.slug}
                    </code>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => togglePublish(lawyer)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded border transition-colors ${
                    lawyer.published
                      ? "border-line-light text-charcoal hover:bg-stone"
                      : "border-gold/60 text-gold-deep bg-gold/10 hover:bg-gold/20"
                  }`}
                >
                  {lawyer.published ? "Hide from Site" : "Publish to Site"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/admin/lawyers/${lawyer.slug}`)}
                  className="rounded bg-stone px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:bg-line-light transition-colors"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(lawyer)}
                  className="p-1.5 text-xs text-charcoal/40 hover:text-red-700 transition-colors"
                  title="Delete lawyer"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
