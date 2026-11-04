// Single source of truth for Avance Law Partners content.
// In production these records are CMS-backed (SiteSettings, Services, Lawyers).
// Facts here are limited to those supplied in the brief; unknowns are left empty.

export const siteSettings = {
  firmName: "Avance Law Partners",
  tagline: "Legal excellence. Practical solutions.",
  established: "1998",
  location: "Dhaka, Bangladesh",
  address: [
    "House 5, Block A, Road No. 2",
    "Mohanagar Project, Hatirjheel",
    "Dhaka, Bangladesh",
  ],
  // Contact channels are intentionally empty until supplied by the firm.
  phone: "",
  email: "",
  whatsapp: "",
  officeHours: "",
  social: [] as { label: string; href: string }[],
  copyright: "© Avance Law Partners. All rights reserved.",
} as const

export const firmOfficeAddress = siteSettings.address.join(", ")

export type Service = {
  slug: string
  index: string
  title: string
  summary: string
  intro?: string
  detail?: string
  items: string[]
}

export const services: Service[] = [
  {
    slug: "corporate-company-law",
    index: "01",
    title: "Corporate & Company Law",
    summary:
      "Incorporation, structuring, governance and the everyday corporate decisions that keep a company sound.",
    items: [
      "Company incorporation and registration in Bangladesh",
      "Corporate structuring and restructuring",
      "Corporate governance and regulatory compliance",
      "Preparation of corporate documents and resolutions",
      "Share transfers, changes in directorship and other corporate matters",
      "Legal advice on company management, rights and obligations",
      "RJSC-related filings and corporate documentation",
    ],
  },
  {
    slug: "contract-drafting-review-vetting",
    index: "02",
    title: "Contract Drafting, Review & Vetting",
    summary:
      "Agreements drafted, reviewed and negotiated so obligations are clear and risk is understood.",
    items: [
      "Drafting, reviewing and vetting commercial agreements",
      "Sale and purchase agreements",
      "Joint venture and shareholders' agreements",
      "Construction and development agreements",
      "Consultancy, service and procurement agreements",
      "Lease, tenancy and property-related agreements",
      "Non-disclosure agreements and memoranda of understanding",
      "Contractual risk assessment, negotiation and legal advisory",
    ],
  },
  {
    slug: "commercial-business-advisory",
    index: "03",
    title: "Commercial & Business Advisory",
    summary:
      "Commercially focused opinions, due diligence and approvals that support confident business decisions.",
    items: [
      "Corporate and commercial legal opinions",
      "Legal due diligence and risk assessment",
      "Business transactions and commercial arrangements",
      "Regulatory compliance and government approvals",
      "Employment and labour-related legal matters",
      "Legal notices, negotiations and settlement advisory",
      "Intellectual property and other business-related legal matters",
    ],
  },
  {
    slug: "litigation-and-dispute-resolution",
    index: "04",
    title: "Litigation and Dispute Resolution",
    summary:
      "Comprehensive legal representation and advisory for litigation, appeals, and dispute resolution across Bangladesh.",
    intro:
      "We provide comprehensive legal representation and advisory services in litigation, appeals, and dispute resolution before the courts and tribunals of Bangladesh. Our practice encompasses matters before the subordinate courts, the High Court Division and the Appellate Division of the Supreme Court of Bangladesh, as well as relevant tribunals and regulatory forums.",
    detail:
      "Our services include civil and commercial disputes, constitutional and writ matters, appellate proceedings, and other contentious legal matters, with a focus on protecting our clients' interests and pursuing effective legal remedies.",
    items: [],
  },
  {
    slug: "berc-energy-regulatory",
    index: "05",
    title: "BERC & Energy Regulatory Matters",
    summary:
      "Regulatory advice, licensing and disputes across Bangladesh's energy sector.",
    items: [
      "Regulatory and licensing-related legal issues",
      "Legal advisory on energy-sector compliance",
      "Challenges to regulatory decisions and orders",
      "Regulatory disputes and proceedings before BERC",
      "Appeals, reviews and appropriate proceedings before the High Court Division",
      "Legal opinions on energy laws, regulations and regulatory obligations",
    ],
  },
  {
    slug: "arbitration-adr",
    index: "06",
    title: "Arbitration & Alternative Dispute Resolution",
    summary:
      "Commercial and infrastructure arbitration, mediation and strategic dispute management.",
    items: [
      "Commercial and corporate arbitration",
      "Energy and infrastructure-related arbitration",
      "Arbitration agreement drafting and review",
      "Representation in arbitration proceedings",
      "Arbitration-related applications before the High Court Division",
      "Mediation, negotiation and settlement",
      "Dispute prevention and strategic dispute management",
    ],
  },
  {
    slug: "litigation-dispute-resolution",
    index: "07",
    title: "Civil, Commercial & Administrative Disputes",
    summary:
      "Civil, commercial and administrative disputes managed from notice through to hearing.",
    items: [
      "Civil, commercial and corporate disputes",
      "Labour and employment disputes",
      "Regulatory and administrative disputes",
      "Land and property litigation",
      "Legal notices, pleadings and court applications",
      "Litigation strategy and case management",
      "Coordination of proceedings before relevant courts and tribunals",
    ],
  },
  {
    slug: "retained-external-counsel",
    index: "08",
    title: "Retained & External Legal Counsel",
    summary:
      "An ongoing legal partner for organisations that need counsel on call, not only in a crisis.",
    items: [
      "Day-to-day corporate and commercial legal advice",
      "Contract drafting, review and negotiation",
      "Legal risk assessment and regulatory support",
      "Corporate governance and compliance",
      "Transactional and operational legal support",
      "Dispute management and litigation coordination",
      "Strategic legal opinions and business advisory",
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export type Lawyer = {
  slug: string
  // Display name shown publicly. Internal placeholders remain unpublished.
  name: string
  // Internal-only label surfaced in design review for an unnamed record.
  placeholderLabel?: string
  designation?: string
  professional_title?: string
  photo_url?: string
  biography?: string
  education?: string[]
  qualifications?: string[]
  court_memberships?: string[]
  bar_memberships?: string[]
  practice_areas?: string[]
  chamber_address?: string
  email?: string
  phone?: string
  published: boolean
  initials: string
}

// Exactly three initial lawyer profiles. Missing facts remain blank until supplied.
export const lawyers: Lawyer[] = [
  {
    slug: "lawyer-one",
    name: "Israt Nayeer Enayet Arni",
    designation: "Managing Partner",
    professional_title:
      "Barrister-at-Law, Lincoln's Inn · Advocate, Supreme Court of Bangladesh",
    photo_url: "/images/lawyers/israt-nayeer-enayet-arni.webp",
    biography:
      "Israt Nayeer Enayet Arni is the Managing Partner of Avance Law Partners and an Advocate of the Supreme Court of Bangladesh. She is a Barrister-at-Law of Lincoln's Inn, UK, and holds a PGDL and an LLM from Northumbria University, as well as an LLB (Hons) from the University of London, UK.",
    education: [
      "PGDL, Northumbria University",
      "LLM, Northumbria University",
      "LLB (Hons), University of London, UK",
    ],
    qualifications: [
      "Barrister-at-Law, Lincoln's Inn, UK",
      "Advocate, Supreme Court of Bangladesh",
    ],
    email: "isratarni1422@gmail.com",
    phone: "+88 01628 781 222",
    chamber_address: firmOfficeAddress,
    practice_areas: [
      "Corporate & Commercial Law",
      "Commercial Contracts & Agreements",
      "Corporate Governance & Regulatory Compliance",
      "Power & Energy Law",
      "BERC Matters & Regulatory Proceedings",
      "Writ Petitions & High Court Litigation",
      "Civil & Commercial Litigation",
      "Arbitration & Alternative Dispute Resolution (ADR)",
      "RAJUK & Real Estate Regulatory Matters",
      "Construction & Infrastructure Disputes",
      "Employment & Labour Law",
      "Corporate Transactions & Due Diligence",
      "Legal Advisory & Risk Assessment",
      "Contractual Disputes & Recovery Proceedings",
    ],
    published: true,
    initials: "I",
  },
  {
    slug: "farzana-alam",
    name: "Farzana Alam",
    designation: "Senior Partner",
    professional_title: "Advocate · Criminal Law & Supreme Court Practice",
    photo_url: "/images/lawyers/farzana-alam.webp",
    biography:
      "Advocate Farzana Alam provides general litigation and legal representation. Her practice includes criminal law matters and advocacy before the Supreme Court of Bangladesh.",
    qualifications: ["Advocate, Supreme Court of Bangladesh"],
    practice_areas: [
      "Criminal Law & Litigation",
      "Criminal Defence",
      "Bail & Anticipatory Bail",
      "Criminal Appeals & Revisions",
      "Family Law & Matrimonial Disputes",
      "Divorce & Separation Matters",
      "Child Custody & Guardianship",
      "Maintenance & Dower Claims",
      "Domestic Violence & Family Disputes",
      "General Civil & Criminal Practice",
      "General Court Practice",
      "Legal Advisory & Documentation",
      "Alternative Dispute Resolution (ADR)",
      "Writ Petitions & Constitutional Matters",
    ],
    chamber_address: firmOfficeAddress,
    phone: "01685013675",
    published: true,
    initials: "FA",
  },
  {
    slug: "fakhrul-islam-mozumder",
    name: "Md. Fakhrul Islam Mozumder",
    designation: "Partner",
    professional_title:
      "Barrister-at-Law, Lincoln's Inn · Advocate, Supreme Court of Bangladesh",
    photo_url: "/images/lawyers/fakhrul-islam-mozumder.webp",
    biography:
      "Barrister Md. Fakhrul Islam Mozumder is an Advocate of the Supreme Court of Bangladesh and a Barrister-at-Law of Lincoln's Inn. He holds the Bar Professional Training Course (BPTC) and PGDL from Northumbria University, UK, and an LLB (Honours) from the University of Greenwich, London.",
    education: [
      "Bar Professional Training Course (BPTC) and PGDL, Northumbria University, UK",
      "LLB (Honours), University of Greenwich, London",
    ],
    qualifications: [
      "Barrister-at-Law, Lincoln's Inn",
      "Advocate, Supreme Court of Bangladesh",
    ],
    practice_areas: [
      "Banking & Financial Institutions",
      "Banking Litigation & Loan Recovery",
      "Financial & Commercial Disputes",
      "Company & Corporate Law",
      "Commercial Transactions & Contracts",
      "Corporate Governance & Regulatory Compliance",
      "Civil Litigation & Dispute Resolution",
      "General Court Practice",
      "Land & Property Disputes",
      "Contractual Disputes",
      "Cheque Dishonour Cases",
      "Legal Advisory & Documentation",
      "Alternative Dispute Resolution (ADR)",
      "Writ Petitions & Constitutional Matters",
      "Criminal Litigation & Defence",
    ],
    chamber_address: firmOfficeAddress,
    email: "mozumder.fakhrul@gmail.com",
    phone: "01784-397467, 01611-669273",
    published: true,
    initials: "FM",
  },
]

export function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug)
}

export const firmIntro = {
  primary:
    "Avance Law Partners provides comprehensive legal services to companies, businesses, institutions and individuals, combining sound legal expertise with practical, commercially focused advice.",
  secondary:
    "Our practice encompasses corporate and commercial law, contract drafting and negotiation, regulatory compliance, corporate governance, litigation, arbitration, and dispute resolution. We advise clients on a wide range of legal matters, helping them navigate complex legal issues, manage risks, and protect their interests.",
  tertiary:
    "We are committed to delivering clear, effective, and strategic legal solutions tailored to each client's needs, with an emphasis on professional integrity, practical judgment, and long-term client relationships.",
}

export const approach = {
  statement:
    "We aim to deliver responsive, practical and commercially sound legal solutions, helping clients manage legal risks, protect their interests and achieve their business objectives.",
  principles: [
    {
      title: "Responsive",
      body: "We stay close to the matter and to you, so advice arrives when a decision is actually being made.",
    },
    {
      title: "Practical",
      body: "We translate legal complexity into clear steps a business can act on with confidence.",
    },
    {
      title: "Commercially sound",
      body: "We weigh legal risk against commercial objectives, protecting your interests without stalling your progress.",
    },
  ],
}
