import { AlertTriangle, Check, X } from "lucide-react"

export default function Toast({
  message,
  type = message.startsWith("Could not") ? "error" : "success",
  onClose,
}: {
  message: string
  type?: "success" | "error"
  onClose: () => void
}) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md bg-obsidian px-5 py-3.5 text-sm text-ivory shadow-2xl border border-line-dark animate-rise"
    >
      <span className={type === "success" ? "text-gold" : "text-red-400"}>
        {type === "success" ? (
          <Check aria-hidden size={16} />
        ) : (
          <AlertTriangle aria-hidden size={16} />
        )}
      </span>
      <span>{message}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onClose}
        className="ml-3 text-ivory/50 hover:text-ivory focus:outline-none"
      >
        <X aria-hidden size={15} />
      </button>
    </div>
  )
}
