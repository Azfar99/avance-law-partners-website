import { useEffect, useId, useRef, useState } from "react"

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [busy, setBusy] = useState(false)
  const heading = useId()
  const description = useId()
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = previous
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      aria-labelledby={heading}
      aria-describedby={description}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onCancel()
      }}
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none items-center justify-center overflow-auto border-0 bg-obsidian/60 p-4 text-charcoal backdrop-blur-xs open:flex backdrop:bg-transparent"
    >
      <div className="w-full max-w-md rounded-lg border border-line-light bg-ivory p-6 shadow-2xl">
      <h2 id={heading} className="font-serif text-2xl text-obsidian">
        {title}
      </h2>
      <p id={description} className="mt-3 text-sm leading-relaxed">
        {message}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          autoFocus
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="rounded px-4 py-2 text-sm font-semibold text-charcoal hover:bg-stone transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await onConfirm()
            } finally {
              setBusy(false)
            }
          }}
          className="rounded bg-red-800 px-4 py-2 text-sm font-semibold text-ivory hover:bg-red-900 transition-colors disabled:opacity-60"
        >
          {busy ? "Please wait..." : confirmLabel}
        </button>
      </div>
      </div>
    </dialog>
  )
}
