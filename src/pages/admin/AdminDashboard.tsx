import { ArrowRight, Inbox, Scale, Users } from "lucide-react"
import { useLawyers, useServices, useEnquiries } from "../../lib/hooks"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import StatusBadge from "./components/StatusBadge"

export default function AdminDashboard() {
  const { lawyers } = useLawyers(true)
  const { services } = useServices(true)
  const { enquiries } = useEnquiries()
  const { navigate } = useRouter()

  const publishedLawyersCount = lawyers.filter((l) => l.published).length
  const newEnquiriesCount = enquiries.filter((e) => e.status === "New").length

  return (
    <AdminLayout title="Firm Overview & Analytics">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate("/admin/lawyers")}
          className="cursor-pointer bg-ivory rounded-lg border border-line-light p-6 shadow-xs hover:border-gold transition-colors"
        >
          <div className="flex items-center justify-between text-ink-60 text-xs font-semibold uppercase tracking-wider">
            <span>Lawyers Directory</span>
            <Users
              aria-hidden
              className="text-gold-deep"
              size={19}
              strokeWidth={1.7}
            />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl text-obsidian">
              {lawyers.length}
            </span>
            <span className="text-xs text-ink-60 font-medium">
              ({publishedLawyersCount} active on website)
            </span>
          </div>
          <div className="mt-4 text-xs font-semibold text-gold-deep hover:underline">
            <span>Manage profiles</span>{" "}
            <ArrowRight aria-hidden className="inline" size={13} />
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/services")}
          className="cursor-pointer bg-ivory rounded-lg border border-line-light p-6 shadow-xs hover:border-gold transition-colors"
        >
          <div className="flex items-center justify-between text-ink-60 text-xs font-semibold uppercase tracking-wider">
            <span>Practice Areas</span>
            <Scale
              aria-hidden
              className="text-gold-deep"
              size={19}
              strokeWidth={1.7}
            />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl text-obsidian">
              {services.length}
            </span>
            <span className="text-xs text-ink-60 font-medium">
              (All 8 practice areas active)
            </span>
          </div>
          <div className="mt-4 text-xs font-semibold text-gold-deep hover:underline">
            <span>Manage practice areas</span>{" "}
            <ArrowRight aria-hidden className="inline" size={13} />
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/enquiries")}
          className="cursor-pointer bg-ivory rounded-lg border border-line-light p-6 shadow-xs hover:border-gold transition-colors"
        >
          <div className="flex items-center justify-between text-ink-60 text-xs font-semibold uppercase tracking-wider">
            <span>Client Enquiries</span>
            <Inbox
              aria-hidden
              className="text-gold-deep"
              size={19}
              strokeWidth={1.7}
            />
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl text-obsidian">
              {enquiries.length}
            </span>
            {newEnquiriesCount > 0 ? (
              <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                {newEnquiriesCount} New
              </span>
            ) : (
              <span className="text-xs text-ink-60 font-medium">
                All caught up
              </span>
            )}
          </div>
          <div className="mt-4 text-xs font-semibold text-gold-deep hover:underline">
            <span>View inbox</span>{" "}
            <ArrowRight aria-hidden className="inline" size={13} />
          </div>
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="bg-ivory rounded-lg border border-line-light overflow-hidden shadow-xs">
        <div className="p-6 border-b border-line-light flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl text-obsidian">
              Recent Enquiries
            </h2>
            <p className="text-xs text-ink-60 mt-0.5">
              Submissions received through the website contact form
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/enquiries")}
            className="text-xs font-semibold text-gold-deep uppercase tracking-wider hover:underline"
          >
            View All ({enquiries.length})
          </button>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-serif text-lg text-charcoal/60">
              No enquiries yet.
            </p>
            <p className="text-xs text-ink-60 mt-1 max-w-sm mx-auto">
              When prospective clients submit the enquiry form on your website,
              their messages will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-line-light">
            {enquiries.slice(0, 5).map((enq) => (
              <div
                key={enq.id}
                onClick={() => navigate(`/admin/enquiries/${enq.id}`)}
                className="p-5 flex items-center justify-between hover:bg-stone/50 cursor-pointer transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-obsidian">
                      {enq.name}
                    </span>
                    <StatusBadge status={enq.status} />
                    <span className="text-xs text-ink-60">· {enq.subject}</span>
                  </div>
                  <p className="text-xs text-charcoal/70 line-clamp-1 max-w-2xl">
                    {enq.message}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-ink-60 block">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-deep">
                    View <ArrowRight aria-hidden size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
