import { useState, useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { useEnquiries, type DBEnquiry } from "../../lib/hooks"
import { useRouter } from "../../lib/router"
import AdminLayout from "./AdminLayout"
import StatusBadge from "./components/StatusBadge"

export default function AdminEnquiries() {
  const { enquiries } = useEnquiries()
  const { navigate } = useRouter()
  const [filter, setFilter] = useState<string>("All")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchFilter = filter === "All" || e.status === filter
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [enquiries, filter, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      All: enquiries.length,
      New: 0,
      Contacted: 0,
      "In Progress": 0,
      Closed: 0,
    }
    enquiries.forEach((e) => {
      if (c[e.status] !== undefined) c[e.status]++
    })
    return c
  }, [enquiries])

  return (
    <AdminLayout title="Client Enquiries & Intake">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-ivory p-1 rounded-lg border border-line-light">
            {([
              "All",
              "New",
              "Contacted",
              "In Progress",
              "Closed",
            ] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  filter === tab
                    ? "bg-obsidian text-ivory"
                    : "text-charcoal/70 hover:text-obsidian hover:bg-stone/50"
                }`}
              >
                {tab}{" "}
                {counts[tab] > 0 && (
                  <span className="ml-1 opacity-75">({counts[tab]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="search"
              placeholder="Search enquiries by name, email, topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-line-light bg-ivory px-3.5 py-2 text-xs text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        {/* Enquiries List */}
        <div className="bg-ivory rounded-lg border border-line-light overflow-hidden shadow-xs">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="font-serif text-lg text-charcoal/60">
                No matching enquiries found.
              </p>
              <p className="text-xs text-ink-60 mt-1">
                {enquiries.length === 0
                  ? "When clients submit the website contact form, new messages arrive here."
                  : "Try clearing your search query or choosing another status tab."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line-light">
              {filtered.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => navigate(`/admin/enquiries/${enq.id}`)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone/30 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base text-obsidian font-bold">
                        {enq.name}
                      </span>
                      <StatusBadge status={enq.status} />
                      <span className="text-xs text-ink-60">· {enq.email}</span>
                      {enq.phone && (
                        <span className="text-xs text-ink-60">
                          · {enq.phone}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-gold-deep">
                      {enq.subject}
                    </div>
                    <p className="text-xs text-charcoal/80 line-clamp-2 leading-relaxed">
                      {enq.message}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0 self-start md:self-center">
                    <span className="text-xs text-ink-60 block">
                      {new Date(enq.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold-deep">
                      Read full message <ArrowRight aria-hidden size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
