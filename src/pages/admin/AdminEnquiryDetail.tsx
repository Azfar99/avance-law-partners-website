import { useState, useEffect } from "react"
import { ArrowLeft, Mail } from "lucide-react"
import { useEnquiries, type DBEnquiry } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import StatusBadge from "./components/StatusBadge"
import ConfirmDialog from "./components/ConfirmDialog"
import Toast from "./components/Toast"

export default function AdminEnquiryDetail({ id }: { id: string }) {
  const { enquiries, refresh } = useEnquiries()
  const { navigate } = useRouter()

  const [enquiry, setEnquiry] = useState<DBEnquiry | null>(null)
  const [status, setStatus] = useState<DBEnquiry["status"]>("New")
  const [adminNotes, setAdminNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const found = enquiries.find((e) => String(e.id) === String(id))
    if (found) {
      setEnquiry(found)
      setStatus(found.status)
      setAdminNotes(found.admin_notes || "")
    }
  }, [enquiries, id])

  const handleStatusChange = async (newStatus: DBEnquiry["status"]) => {
    setStatus(newStatus)
    const result = await supabase
      .from("enquiries")
      .update({ status: newStatus })
      .eq("id", id)
    if (result.error) {
      setStatus(enquiry?.status || "New")
      setToast("Could not update the enquiry. " + result.error.message)
      return
    }
    await refresh()
    setToast(`Enquiry status changed to "${newStatus}".`)
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    const result = await supabase
      .from("enquiries")
      .update({ admin_notes: adminNotes })
      .eq("id", id)
    if (result.error) {
      setSaving(false)
      setToast("Could not save notes. " + result.error.message)
      return
    }
    await refresh()
    setSaving(false)
    setToast("Internal chamber notes saved.")
  }

  const handleDelete = async () => {
    const result = await supabase.from("enquiries").delete().eq("id", id)
    if (result.error) {
      setShowDelete(false)
      setToast("Could not delete the enquiry. " + result.error.message)
      return
    }
    await refresh()
    navigate("/admin/enquiries")
  }

  if (!enquiry) {
    return (
      <AdminLayout title="Enquiry Detail">
        <div className="p-8 text-center bg-ivory rounded-lg border border-line-light">
          <p className="font-serif text-lg text-charcoal/60">
            Loading enquiry details...
          </p>
          <button
            onClick={() => navigate("/admin/enquiries")}
            className="mt-4 text-xs font-semibold text-gold-deep underline"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft aria-hidden size={13} /> Back to Enquiries
            </span>
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Enquiry from ${enquiry.name}`}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {showDelete && (
        <ConfirmDialog
          title="Delete Client Enquiry?"
          message="Are you sure you want to delete this client enquiry record? This cannot be undone."
          confirmLabel="Delete Message"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      <div className="space-y-6 max-w-4xl pb-16">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/enquiries")}
            className="text-xs font-semibold text-charcoal/70 hover:text-obsidian"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft aria-hidden size={13} /> Back to all enquiries
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-60">Status:</span>
            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as DBEnquiry["status"])
              }
              className="rounded border border-line-light bg-ivory px-3 py-1 text-xs font-semibold text-charcoal focus:border-gold focus:outline-none"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Client & Message Card */}
        <div className="bg-ivory rounded-lg border border-line-light p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-line-light pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-2xl text-obsidian font-medium">
                  {enquiry.name}
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-xs text-ink-60 mt-1">
                Submitted on {new Date(enquiry.created_at).toLocaleString()}
              </p>
            </div>

            <a
              href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.subject)} - Avance Law Partners`}
              className="rounded bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] transition-colors self-start md:self-auto"
            >
              <span className="inline-flex items-center gap-2">
                <Mail aria-hidden size={14} /> Reply via Email
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-stone/30 p-4 rounded-lg border border-line-light">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-60 block">
                Email Address
              </span>
              <a
                href={`mailto:${enquiry.email}`}
                className="text-sm font-semibold text-charcoal hover:underline"
              >
                {enquiry.email}
              </a>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-60 block">
                Telephone / Mobile
              </span>
              <span className="text-sm font-semibold text-charcoal">
                {enquiry.phone || "Not provided"}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-ink-60 block">
                Legal Matter / Practice
              </span>
              <span className="text-sm font-semibold text-gold-deep">
                {enquiry.subject}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-60 mb-2">
              Message Body
            </h3>
            <div className="bg-stone/20 p-5 rounded-lg border border-line-light text-sm leading-relaxed text-charcoal whitespace-pre-wrap">
              {enquiry.message}
            </div>
          </div>
        </div>

        {/* Internal Chamber Notes Card */}
        <div className="bg-ivory rounded-lg border border-line-light p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-line-light pb-3">
            <h3 className="font-serif text-lg text-obsidian">
              Chamber Internal Notes
            </h3>
            <span className="text-[11px] text-ink-60">
              Private: only visible to firm admins
            </span>
          </div>

          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about consultations, assigned counsel, fee discussions, or next steps..."
            className="w-full rounded border border-line-light bg-stone/20 px-3.5 py-2 text-sm text-charcoal focus:border-gold focus:outline-none resize-y"
          />

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="text-xs font-semibold text-red-700 hover:underline"
            >
              Delete Enquiry
            </button>

            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={saving}
              className="rounded bg-stone px-4 py-2 text-xs font-semibold text-charcoal hover:bg-line-light transition-colors"
            >
              {saving ? "Saving..." : "Save Internal Notes"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
