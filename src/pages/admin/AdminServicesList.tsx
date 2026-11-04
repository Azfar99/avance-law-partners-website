import { Plus } from "lucide-react"
import { useState } from "react"
import { useServices, type DBService } from "../../lib/hooks"
import { supabase } from "../../lib/supabase"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import Toast from "./components/Toast"

export default function AdminServicesList() {
  const { services, refresh } = useServices(true)
  const { navigate } = useRouter()
  const [toast, setToast] = useState<string | null>(null)

  const togglePublish = async (service: DBService) => {
    const nextState = !service.published
    if (service.id) {
      const result = await supabase
        .from("services")
        .update({ published: nextState })
        .eq("id", service.id)
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
      `Service "${service.title}" is now ${
        nextState ? "visible" : "hidden"
      } on the website.`,
    )
  }

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= services.length) return

    const current = services[index]
    const target = services[targetIndex]

    const tempOrder = current.display_order
    current.display_order = target.display_order
    target.display_order = tempOrder

    if (current.id)
      await supabase
        .from("services")
        .update({ display_order: current.display_order })
        .eq("id", current.id)
    if (target.id)
      await supabase
        .from("services")
        .update({ display_order: target.display_order })
        .eq("id", target.id)

    await refresh()
  }

  return (
    <AdminLayout title="Practice Areas & Legal Services">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-60">
          Manage practice areas displayed across the website and contact forms.
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/services/new")}
          className="rounded bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            <Plus aria-hidden size={14} /> Add Practice Area
          </span>
        </button>
      </div>

      <div className="bg-ivory rounded-lg border border-line-light overflow-hidden shadow-xs">
        <div className="divide-y divide-line-light">
          {services.map((service, idx) => (
            <div
              key={service.id || service.slug}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Reorder controls */}
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
                    disabled={idx === services.length - 1}
                    onClick={() => moveOrder(idx, "down")}
                    className="text-xs text-charcoal/40 hover:text-obsidian disabled:opacity-20 leading-none p-1"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>

                <span className="font-serif text-xl font-bold text-gold-deep w-8 text-center">
                  {service.index_number || `0${idx + 1}`}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-obsidian font-medium">
                      {service.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${
                        service.published
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {service.published ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-60 mt-0.5 max-w-xl line-clamp-1">
                    {service.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => togglePublish(service)}
                  className="text-xs font-semibold px-3 py-1.5 rounded border border-line-light text-charcoal hover:bg-stone transition-colors"
                >
                  {service.published ? "Hide" : "Show"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/admin/services/${service.slug}`)}
                  className="rounded bg-stone px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:bg-line-light transition-colors"
                >
                  Edit Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
