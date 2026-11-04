export default function StatusBadge({
  status,
}: {
  status: "New" | "Contacted" | "In Progress" | "Closed"
}) {
  const styles =
    {
      New: "bg-gold/20 text-gold-deep border-gold/40",
      Contacted: "bg-blue-500/15 text-blue-800 border-blue-400/40",
      "In Progress": "bg-amber-500/15 text-amber-800 border-amber-400/40",
      Closed: "bg-stone text-charcoal/70 border-line-light",
    }[status] || "bg-stone text-charcoal/70 border-line-light"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${styles}`}
    >
      {status}
    </span>
  )
}
