// Avance Law Partners. Dynamic SEO Meta Tag Injector
export function updatePageSEO({
  title,
  description,
  ogImage,
  canonicalUrl,
  noindex = false,
}: {
  title?: string
  description?: string
  ogImage?: string
  canonicalUrl?: string
  noindex?: boolean
}) {
  if (title) {
    document.title = title.includes("Avance Law Partners")
      ? title
      : `${title} | Avance Law Partners`
  }

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement("meta")
      metaDesc.setAttribute("name", "description")
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute("content", description)
  }

  for (const [property, content] of [
    ["og:title", document.title],
    ["og:description", description],
  ] as const) {
    if (!content) continue
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("property", property)
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", content)
  }

  if (ogImage) {
    let ogImg = document.querySelector('meta[property="og:image"]')
    if (!ogImg) {
      ogImg = document.createElement("meta")
      ogImg.setAttribute("property", "og:image")
      document.head.appendChild(ogImg)
    }
    ogImg.setAttribute("content", ogImage)
  }

  if (canonicalUrl) {
    let linkCan = document.querySelector('link[rel="canonical"]')
    if (!linkCan) {
      linkCan = document.createElement("link")
      linkCan.setAttribute("rel", "canonical")
      document.head.appendChild(linkCan)
    }
    linkCan.setAttribute("href", canonicalUrl)
  }

  for (const [attribute, key, content] of [
    ["name", "robots", noindex ? "noindex, nofollow" : "index, follow"],
    ["property", "og:type", "website"],
    ["property", "og:site_name", "Avance Law Partners"],
    ["property", "og:url", canonicalUrl],
    ["property", "og:image:alt", "Avance Law Partners logo, Dhaka, Bangladesh"],
    ["name", "twitter:card", "summary_large_image"],
    ["name", "twitter:title", document.title],
    ["name", "twitter:description", description],
    ["name", "twitter:image", ogImage],
    ["name", "twitter:image:alt", "Avance Law Partners logo, Dhaka, Bangladesh"],
  ] as const) {
    if (!content) continue
    let meta = document.querySelector(`meta[${attribute}="${key}"]`)
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute(attribute, key)
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", content)
  }
}

// Hash views are one crawlable document, not separately addressable HTML pages.
export const CANONICAL_URL = "https://avancelawpartners.info/"
export const publicPageMetadata: Record<string, { title: string; description: string }> = {
  "/": { title: "Avance Law Partners | Law Firm in Dhaka, Bangladesh", description: "Corporate, commercial, regulatory and dispute resolution counsel in Dhaka, Bangladesh. Established in 1998." },
  "/about": { title: "About the Firm | Avance Law Partners", description: "Learn about Avance Law Partners, established in 1998, and its legal practice serving companies, institutions and individuals in Dhaka, Bangladesh." },
  "/approach": { title: "Our Approach to Legal Counsel | Avance Law Partners", description: "Explore the responsive, practical and commercially focused approach to legal matters at Avance Law Partners in Dhaka, Bangladesh." },
  "/services": { title: "Legal Practice Areas in Dhaka | Avance Law Partners", description: "Explore corporate and company law, commercial advisory, contracts, energy regulation, litigation and arbitration services at Avance Law Partners." },
  "/lawyers": { title: "Our Lawyers in Dhaka | Avance Law Partners", description: "Meet the lawyers at Avance Law Partners and explore their supplied professional profiles, practice areas and contact information." },
  "/contact": { title: "Contact & Consultations in Dhaka | Avance Law Partners", description: "Contact Avance Law Partners in Hatirjheel, Dhaka, by phone or email, or submit an enquiry about your legal matter." },
  "/privacy": { title: "Privacy Policy | Avance Law Partners", description: "Read the privacy information and document status provided by Avance Law Partners for visitors and people making enquiries." },
  "/disclaimer": { title: "Legal Disclaimer | Avance Law Partners", description: "Read the legal disclaimer concerning website information and enquiries submitted to Avance Law Partners." },
  "/terms": { title: "Terms of Use | Avance Law Partners", description: "Read the website terms and document status provided by Avance Law Partners." },
}
