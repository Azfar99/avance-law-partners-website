import { useState, useRef, type ChangeEvent } from "react"
import { uploadMedia } from "../../lib/storage"
import AdminLayout from "./AdminLayout"
import Toast from "./components/Toast"

interface MediaItem {
  id: string
  name: string
  url: string
  size: string
  type: string
}

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([
    {
      id: "med-1",
      name: "avance-law-partners-logo.png",
      url: "/images/avance-law-partners-logo.png",
      size: "PNG logo",
      type: "image/png",
    },
  ])
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await uploadMedia(file, "general")
      const newItem: MediaItem = {
        id: "med-" + Date.now(),
        name: file.name,
        url: res.url,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type,
      }
      setItems((prev) => [newItem, ...prev])
      setToast(`Image "${file.name}" uploaded successfully!`)
    } catch (err) {
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setToast("Image URL copied to clipboard!")
  }

  return (
    <AdminLayout title="Media Library & Assets">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-60">
            Upload photographs, chamber logos, and lawyer portraits. Files are
            stored securely.
          </p>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian hover:bg-[#d8b32e] transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "+ Upload New Image"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-ivory rounded-lg border border-line-light overflow-hidden shadow-xs hover:border-gold transition-colors flex flex-col"
            >
              <div className="aspect-square bg-stone relative flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="rounded bg-ivory px-3 py-1 text-[11px] font-semibold text-charcoal shadow-sm hover:bg-gold hover:text-obsidian transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="p-3 border-t border-line-light space-y-0.5">
                <p
                  className="text-xs font-semibold text-charcoal truncate"
                  title={item.name}
                >
                  {item.name}
                </p>
                <div className="flex justify-between text-[11px] text-ink-60">
                  <span>{item.size}</span>
                  <span>{item.type.split("/")[1]?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
