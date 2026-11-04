// Avance Law Partners. Reactive Data Hooks
// Provides access to Supabase content, with shipped defaults only before table setup.

import { useState, useEffect, useCallback } from "react"
import { hasLocalTable, isConfigured, supabase } from "./supabase"
import {
  siteSettings as defaultSettings,
  services as defaultServices,
  lawyers as defaultLawyers,
  firmIntro as defaultFirmIntro,
  approach as defaultApproach,
  type Service,
  type Lawyer,
} from "./content"

// 1. SITE SETTINGS HOOK
export interface SiteSettings {
  id?: string
  firm_name: string
  tagline: string
  established: string
  location: string
  address_line_1: string
  address_line_2: string
  address_line_3: string
  phone: string
  email: string
  whatsapp: string
  office_hours: string
  logo_url: string
  favicon_url: string
  footer_text: string
  social_links: Array<{
    label: string
    url: string
  }>
  map_location: {
    lat: number
    lng: number
  } | null
  notification_email?: string
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    firm_name: defaultSettings.firmName,
    tagline: defaultSettings.tagline,
    established: defaultSettings.established,
    location: defaultSettings.location,
    address_line_1:
      defaultSettings.address[0] || "House 5, Block A, Road No. 2",
    address_line_2:
      defaultSettings.address[1] || "Mohanagar Project, Hatirjheel",
    address_line_3: defaultSettings.address[2] || "Dhaka, Bangladesh",
    phone: defaultSettings.phone,
    email: defaultSettings.email,
    whatsapp: defaultSettings.whatsapp,
    office_hours: defaultSettings.officeHours,
    logo_url: "/images/avance-law-partners-logo.png",
    favicon_url: "",
    footer_text: defaultSettings.copyright,
    social_links: defaultSettings.social.map((s) => ({
      label: s.label,
      url: s.href,
    })),
    map_location: null,
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await supabase.from("site_settings", { useSession: false }).select("*").limit(1)
    if (data && data.length > 0) {
      setSettings(data[0])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { settings, loading, refresh }
}

// 2. LAWYERS HOOKS
export interface DBLawyer {
  id?: string
  name: string
  slug: string
  designation?: string
  professional_title?: string
  photo_url?: string
  biography?: string
  education?: string[]
  qualifications?: string[]
  court_memberships?: string[]
  bar_memberships?: string[]
  experience?: string
  languages?: string[]
  practice_areas?: string[]
  email?: string
  phone?: string
  linkedin?: string
  other_social?: Array<{
    label: string
    url: string
  }>
  additional_info?: string
  chamber_address?: string
  published: boolean
  display_order: number
}

function lawyerDefaultRecord(lawyer: Lawyer, index: number): DBLawyer {
  return {
    id: "default-" + lawyer.slug,
    name: lawyer.name || `Lawyer Profile (${index + 1})`,
    slug: lawyer.slug,
    designation: lawyer.designation,
    professional_title: lawyer.professional_title,
    photo_url: lawyer.photo_url,
    biography: lawyer.biography,
    education: lawyer.education,
    qualifications: lawyer.qualifications,
    court_memberships: lawyer.court_memberships,
    bar_memberships: lawyer.bar_memberships,
    practice_areas: lawyer.practice_areas,
    chamber_address: lawyer.chamber_address,
    email: lawyer.email,
    phone: lawyer.phone,
    published: lawyer.published,
    display_order: index + 1,
  }
}

function defaultLawyerIndex(slug: string) {
  if (slug === "rishad" || slug === "lawyer-three") return 2
  if (slug === "lawyer-two") return 1
  return defaultLawyers.findIndex((lawyer) => lawyer.slug === slug)
}

function normalizeLawyer(record: DBLawyer): DBLawyer {
  const index = defaultLawyerIndex(record.slug)
  if (index < 0) return record

  const defaults = lawyerDefaultRecord(defaultLawyers[index], index)
  return {
    ...defaults,
    ...record,
    id: record.id || defaults.id,
    display_order: record.display_order ?? index + 1,
  }
}

function mergeDefaultLawyers(
  records: DBLawyer[],
  useDefaults: boolean,
): DBLawyer[] {
  const bySlug = new Map<string, DBLawyer>()
  records.map(normalizeLawyer).forEach((lawyer) => {
    bySlug.set(lawyer.slug, lawyer)
  })
  if (useDefaults && records.length === 0)
    defaultLawyers.forEach((lawyer, index) => {
      if (!bySlug.has(lawyer.slug)) {
        bySlug.set(lawyer.slug, lawyerDefaultRecord(lawyer, index))
      }
    })
  const normalized = [...bySlug.values()]
  return normalized.sort((a, b) => a.display_order - b.display_order)
}

export function useLawyers(all: boolean = false) {
  const [lawyers, setLawyers] = useState<DBLawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    let query = supabase
      .from("lawyers", { useSession: all })
      .select("*")
      .order("display_order", { ascending: true })
    if (!all) query = query.eq("published", true)
    const { data, error } = await query
    setLoadFailed(Boolean(isConfigured && error && error.code !== "PGRST205"))
    const mapped = mergeDefaultLawyers(
      data as DBLawyer[] | null || [],
      (!isConfigured && !hasLocalTable("lawyers")) ||
        error?.code === "PGRST205",
    )
    setLawyers(all ? mapped : mapped.filter((lawyer) => lawyer.published))
    setLoading(false)
  }, [all])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { lawyers, loading, loadFailed, refresh }
}

export function useLawyer(slug: string, includeDrafts = false) {
  const [lawyer, setLawyer] = useState<DBLawyer | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    let query = supabase.from("lawyers", { useSession: includeDrafts }).select("*").eq("slug", slug).limit(1)
    if (!includeDrafts) query = query.eq("published", true)
    const { data, error } = await query
    setLoadFailed(Boolean(isConfigured && error && error.code !== "PGRST205"))
    if (data && data.length > 0) {
      const record = normalizeLawyer(data[0] as DBLawyer)
      setLawyer(includeDrafts || record.published ? record : null)
    } else {
      const index = defaultLawyerIndex(slug)
      setLawyer(
        ((!isConfigured && !hasLocalTable("lawyers")) ||
          error?.code === "PGRST205") &&
          index >= 0 &&
          (includeDrafts || defaultLawyers[index].published)
          ? lawyerDefaultRecord(defaultLawyers[index], index)
          : null,
      )
    }
    setLoading(false)
  }, [slug, includeDrafts])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { lawyer, loading, loadFailed, refresh }
}

// 3. SERVICES HOOKS
export interface DBService {
  id?: string
  index_number: string
  title: string
  slug: string
  summary: string
  intro?: string
  detail?: string
  items: string[]
  icon?: string
  associated_lawyers?: string[]
  published: boolean
  display_order: number
}

function normalizeService(record: DBService): DBService {
  const replacement = defaultServices.find(
    (service) => service.slug === "litigation-and-dispute-resolution",
  )
  if (!replacement) return record

  if (record.slug === "high-court-division-practice") {
    return {
      ...record,
      index_number: replacement.index,
      title: replacement.title,
      slug: replacement.slug,
      summary: replacement.summary,
      intro: replacement.intro,
      detail: replacement.detail,
      items: replacement.items,
    }
  }

  if (record.slug === "litigation-dispute-resolution") {
    const civilDisputes = defaultServices.find(
      (service) => service.slug === "litigation-dispute-resolution",
    )
    return civilDisputes ? { ...record, title: civilDisputes.title } : record
  }

  return record
}

export function useServices(all: boolean = false) {
  const [services, setServices] = useState<DBService[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    let query = supabase
      .from("services", { useSession: all })
      .select("*")
      .order("display_order", { ascending: true })
    if (!all) {
      query = query.eq("published", true)
    }
    const { data, error } = await query
    setLoadFailed(Boolean(isConfigured && error && error.code !== "PGRST205"))
    if (data && data.length > 0) {
      setServices(data.map((record: DBService) => normalizeService(record)))
    } else if (
      (!isConfigured && !hasLocalTable("services")) ||
      error?.code === "PGRST205"
    ) {
      const mapped: DBService[] = defaultServices.map((s, idx) => ({
        id: "default-" + s.slug,
        index_number: s.index,
        title: s.title,
        slug: s.slug,
        summary: s.summary,
        intro: s.intro || "",
        detail: s.detail || "",
        items: s.items,
        published: true,
        display_order: idx + 1,
      }))
      setServices(mapped)
    } else {
      setServices([])
    }
    setLoading(false)
  }, [all])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { services, loading, loadFailed, refresh }
}

export function useService(slug: string, includeDrafts = false) {
  const [service, setService] = useState<DBService | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadFailed(false)
    let query = supabase.from("services", { useSession: includeDrafts }).select("*").eq("slug", slug).limit(1)
    if (!includeDrafts) query = query.eq("published", true)
    const { data, error } = await query
    setLoadFailed(Boolean(isConfigured && error && error.code !== "PGRST205"))
    if (data && data.length > 0) {
      const record = normalizeService(data[0])
      setService(includeDrafts || record.published ? record : null)
    } else {
      const found = defaultServices.find(
        (s) =>
          s.slug === slug ||
          (slug === "high-court-division-practice" && s.index === "04"),
      )
      if (
        found &&
        ((!isConfigured && !hasLocalTable("services")) ||
          error?.code === "PGRST205")
      ) {
        setService({
          id: "default-" + found.slug,
          index_number: found.index,
          title: found.title,
          slug: found.slug,
          summary: found.summary,
          intro: found.intro || "",
          detail: found.detail || "",
          items: found.items,
          published: true,
          display_order: 1,
        })
      } else {
        setService(null)
      }
    }
    setLoading(false)
  }, [slug, includeDrafts])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { service, loading, loadFailed, refresh }
}

// 4. ENQUIRIES HOOK (ADMIN)
export interface DBEnquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "New" | "Contacted" | "In Progress" | "Closed"
  admin_notes?: string
  created_at: string
}

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<DBEnquiry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
    setEnquiries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { enquiries, loading, refresh }
}

// 5. PAGE CONTENT HOOK
export function usePageContent(pageKey: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("page_content", { useSession: false })
      .select("*")
      .eq("page_key", pageKey)
    const map: Record<string, string> = {}
    if (data && data.length > 0) {
      data.forEach((row: any) => {
        map[row.section_key] = row.content
      })
    } else if (pageKey === "home") {
      map.hero_eyebrow = "Avance Law Partners · Dhaka, Bangladesh"
      map.hero_title = "Clarity for the next move."
      map.hero_subtitle =
        "Clear legal judgment for businesses, institutions and individuals navigating consequential decisions."
      map.intro_heading = "Advice that gives the next decision a sound legal footing."
      map.intro_primary = defaultFirmIntro.primary
      map.intro_secondary = defaultFirmIntro.secondary
      map.approach_statement = defaultApproach.statement
      map.contact_heading = "Start with the matter at hand."
      map.contact_subtitle =
        "Tell us a little about the issue. We will help identify the right counsel and the next sensible step."
    }
    setContent(map)
    setLoading(false)
  }, [pageKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { content, loading, refresh }
}

// 6. LEGAL PAGES HOOK
export interface DBLegalPage {
  id?: string
  type: "privacy" | "disclaimer" | "terms"
  title: string
  body: string
  published: boolean
  updated_at?: string
}

function defaultLegalPage(type: DBLegalPage["type"]): DBLegalPage {
  return {
    type,
    title:
      type === "privacy"
        ? "Privacy Policy"
        : type === "disclaimer"
          ? "Legal Disclaimer"
          : "Terms of Use",
    body: "",
    published: true,
  }
}

export function useLegalPage(
  type: "privacy" | "disclaimer" | "terms",
  includeDrafts = false,
) {
  const [legal, setLegal] = useState<DBLegalPage>(() => defaultLegalPage(type))
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from("legal_pages", { useSession: includeDrafts })
      .select("*")
      .eq("type", type)
      .limit(1)
    if (!includeDrafts) query = query.eq("published", true)
    const { data, error } = await query
    const record =
      !error && data && data.length > 0 ? data[0] : defaultLegalPage(type)
    setLegal(
      includeDrafts || record.published
        ? record
        : { ...defaultLegalPage(type), published: false },
    )
    setLoading(false)
  }, [type, includeDrafts])

  useEffect(() => {
    setLegal(defaultLegalPage(type))
    void refresh()
  }, [refresh])

  return { legal, loading, refresh }
}
