import { type ReactNode } from "react"

export default function FormField({
  label,
  description,
  required,
  children,
}: {
  label: string
  description?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-charcoal">
          {label} {required && <span className="text-gold-deep">*</span>}
        </label>
      </div>
      {description && <p className="text-xs text-ink-60">{description}</p>}
      {children}
    </div>
  )
}
