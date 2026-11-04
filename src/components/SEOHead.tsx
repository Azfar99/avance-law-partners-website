import { useEffect } from "react"
import { CANONICAL_URL, publicPageMetadata, updatePageSEO } from "../lib/seo"

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  canonicalPath?: string
}

export default function SEOHead({
  title,
  description,
  ogImage,
  canonicalPath,
}: SEOHeadProps) {
  useEffect(() => {
    const path = canonicalPath || window.location.hash.slice(1).split("?")[0] || "/"
    const metadata = publicPageMetadata[path]
    updatePageSEO({
      title: metadata?.title || title,
      description:
        metadata?.description || description || publicPageMetadata["/"].description,
      ogImage: new URL(
        ogImage || "/images/social-card.png",
        CANONICAL_URL,
      ).href,
      canonicalUrl: CANONICAL_URL,
      noindex: path === "/404" || path.startsWith("/admin") || import.meta.env.VITE_PUBLIC_PREVIEW === "true" ||
        !["avancelawpartners.info", "www.avancelawpartners.info"].includes(window.location.hostname),
    })
  }, [title, description, ogImage, canonicalPath])

  return null
}

// SEO only; admin sessions and authorization are untouched.
export function PrivatePageSEO() {
  useEffect(() => {
    updatePageSEO({ title: "Admin | Avance Law Partners", description: "Private administration area.", canonicalUrl: CANONICAL_URL, noindex: true })
  }, [])
  return null
}
