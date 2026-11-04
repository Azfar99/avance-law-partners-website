import { useState, useRef, type ChangeEvent } from "react"
import { X } from "lucide-react"
import { uploadMedia } from "../../../lib/storage"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const res = await uploadMedia(file, "lawyers")
      onChange(res.url)
    } catch (err) {
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block overflow-hidden rounded-md border border-line-light bg-stone">
          <img src={value} alt="Preview" className="h-36 w-28 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 rounded-full bg-obsidian/80 p-1 text-xs text-ivory hover:bg-obsidian"
            title="Remove image"
          >
            <X aria-hidden size={14} strokeWidth={1.8} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-36 w-28 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-line-light bg-stone/40 hover:bg-stone/80 transition-colors"
        >
          <span className="text-2xl text-charcoal/40">+</span>
          <span className="mt-1 text-[11px] font-medium text-charcoal/60 text-center px-2">
            {uploading ? "Uploading..." : label}
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
