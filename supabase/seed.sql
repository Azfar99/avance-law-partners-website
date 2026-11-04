-- Avance Law Partners (avancelawpartners.info)
-- Complete Seed Data

-- 1. SITE SETTINGS
INSERT INTO site_settings (
  firm_name, tagline, established, location,
  address_line_1, address_line_2, address_line_3,
  phone, email, whatsapp, office_hours,
  logo_url, footer_text, social_links
) VALUES (
  'Avance Law Partners',
  'Legal excellence. Practical solutions.',
  '1998',
  'Dhaka, Bangladesh',
  'House 5, Block A, Road No. 2',
  'Mohanagar Project, Hatirjheel',
  'Dhaka, Bangladesh',
  '',
  '',
  '',
  '',
  '/assets/alp-logo.jpeg',
  '© Avance Law Partners. All rights reserved.',
  '[]'::jsonb
);

-- 2. LAWYERS (Initially 2: Admin/Partner + Rishad)
INSERT INTO lawyers (
  name, slug, designation, photo_url, biography,
  education, qualifications, court_memberships, bar_memberships,
  experience, languages, practice_areas, email, phone, linkedin,
  published, display_order
) VALUES
(
  'Senior Partner (Admin)',
  'managing-partner',
  'Partner & Advocate',
  '',
  'Senior Advocate and Partner at Avance Law Partners, advising corporations, commercial entities, and individuals on complex legal, regulatory, and corporate matters across Bangladesh.',
  '["LL.B (Honours)", "LL.M"]'::jsonb,
  '["Enrolled Advocate, Supreme Court of Bangladesh"]'::jsonb,
  '["High Court Division, Supreme Court of Bangladesh"]'::jsonb,
  '["Supreme Court Bar Association", "Dhaka Bar Association"]'::jsonb,
  'Extensive experience in corporate counseling, commercial dispute resolution, and regulatory compliance.',
  '["English", "Bangla"]'::jsonb,
  '["corporate-company-law", "contract-drafting-review-vetting", "commercial-business-advisory"]'::jsonb,
  '',
  '',
  '',
  true,
  1
),
(
  'Rishad',
  'rishad',
  'Associate',
  '',
  'Counsel at Avance Law Partners specializing in commercial agreements, corporate compliance, and regulatory advisory.',
  '["LL.B (Honours)"]'::jsonb,
  '["Enrolled Advocate"]'::jsonb,
  '["District & Sessions Court, Dhaka"]'::jsonb,
  '["Dhaka Bar Association"]'::jsonb,
  'Focused on contract drafting, commercial advisory, and judicial review proceedings.',
  '["English", "Bangla"]'::jsonb,
  '["corporate-company-law", "litigation-dispute-resolution"]'::jsonb,
  '',
  '',
  '',
  true,
  2
);

-- 3. SERVICES (All 8 Practice Areas from Brief)
INSERT INTO services (index_number, title, slug, summary, intro, items, published, display_order) VALUES
(
  '01',
  'Corporate & Company Law',
  'corporate-company-law',
  'Incorporation, structuring, governance and the everyday corporate decisions that keep a company sound.',
  '',
  '[
    "Company incorporation and registration in Bangladesh",
    "Corporate structuring and restructuring",
    "Corporate governance and regulatory compliance",
    "Preparation of corporate documents and resolutions",
    "Share transfers, changes in directorship and other corporate matters",
    "Legal advice on company management, rights and obligations",
    "RJSC-related filings and corporate documentation"
  ]'::jsonb,
  true,
  1
),
(
  '02',
  'Contract Drafting, Review & Vetting',
  'contract-drafting-review-vetting',
  'Agreements drafted, reviewed and negotiated so obligations are clear and risk is understood.',
  '',
  '[
    "Drafting, reviewing and vetting commercial agreements",
    "Sale and purchase agreements",
    "Joint venture and shareholders'' agreements",
    "Construction and development agreements",
    "Consultancy, service and procurement agreements",
    "Lease, tenancy and property-related agreements",
    "Non-disclosure agreements and memoranda of understanding",
    "Contractual risk assessment, negotiation and legal advisory"
  ]'::jsonb,
  true,
  2
),
(
  '03',
  'Commercial & Business Advisory',
  'commercial-business-advisory',
  'Commercially focused opinions, due diligence and approvals that support confident business decisions.',
  '',
  '[
    "Corporate and commercial legal opinions",
    "Legal due diligence and risk assessment",
    "Business transactions and commercial arrangements",
    "Regulatory compliance and government approvals",
    "Employment and labour-related legal matters",
    "Legal notices, negotiations and settlement advisory",
    "Intellectual property and other business-related legal matters"
  ]'::jsonb,
  true,
  3
),
(
  '04',
  'High Court Division Practice',
  'high-court-division-practice',
  'Representation and advisory before the High Court Division of the Supreme Court of Bangladesh.',
  'We provide legal representation and advisory services in matters falling within the jurisdiction of the High Court Division of the Supreme Court of Bangladesh, including:',
  '[
    "Writ petitions and constitutional remedies",
    "Civil and commercial litigation",
    "Company and corporate matters",
    "Regulatory and administrative law matters",
    "Appeals, revisions and other appropriate proceedings",
    "Judicial review of decisions, orders and actions of public authorities",
    "Legal opinions, case preparation and litigation strategy"
  ]'::jsonb,
  true,
  4
),
(
  '05',
  'BERC & Energy Regulatory Matters',
  'berc-energy-regulatory',
  'Regulatory advice, licensing and disputes across Bangladesh''s energy sector.',
  '',
  '[
    "Regulatory and licensing-related legal issues",
    "Legal advisory on energy-sector compliance",
    "Challenges to regulatory decisions and orders",
    "Regulatory disputes and proceedings before BERC",
    "Appeals, reviews and appropriate proceedings before the High Court Division",
    "Legal opinions on energy laws, regulations and regulatory obligations"
  ]'::jsonb,
  true,
  5
),
(
  '06',
  'Arbitration & Alternative Dispute Resolution',
  'arbitration-adr',
  'Commercial and infrastructure arbitration, mediation and strategic dispute management.',
  '',
  '[
    "Commercial and corporate arbitration",
    "Energy and infrastructure-related arbitration",
    "Arbitration agreement drafting and review",
    "Representation in arbitration proceedings",
    "Arbitration-related applications before the High Court Division",
    "Mediation, negotiation and settlement",
    "Dispute prevention and strategic dispute management"
  ]'::jsonb,
  true,
  6
),
(
  '07',
  'Litigation & Dispute Resolution',
  'litigation-dispute-resolution',
  'Civil, commercial and administrative disputes managed from notice through to hearing.',
  '',
  '[
    "Civil, commercial and corporate disputes",
    "Labour and employment disputes",
    "Regulatory and administrative disputes",
    "Land and property litigation",
    "Legal notices, pleadings and court applications",
    "Litigation strategy and case management",
    "Coordination of proceedings before relevant courts and tribunals"
  ]'::jsonb,
  true,
  7
),
(
  '08',
  'Retained & External Legal Counsel',
  'retained-external-counsel',
  'An ongoing legal partner for organisations that need counsel on call, not only in a crisis.',
  '',
  '[
    "Day-to-day corporate and commercial legal advice",
    "Contract drafting, review and negotiation",
    "Legal risk assessment and regulatory support",
    "Corporate governance and compliance",
    "Transactional and operational legal support",
    "Dispute management and litigation coordination",
    "Strategic legal opinions and business advisory"
  ]'::jsonb,
  true,
  8
);

-- 4. PAGE CONTENT
INSERT INTO page_content (page_key, section_key, content) VALUES
('home', 'hero_eyebrow', 'AVANCE LAW PARTNERS · DHAKA, BANGLADESH'),
('home', 'hero_title', 'Legal excellence. Practical solutions.'),
('home', 'hero_subtitle', 'Providing trusted legal counsel and representation since 1998.'),
('home', 'intro_heading', 'Established in 1998. Focused on your next step.'),
('home', 'intro_primary', 'Avance Law Partners provides comprehensive legal services to companies, businesses, institutions and individuals, combining sound legal expertise with practical, commercially focused advice.'),
('home', 'intro_secondary', 'Our practice covers corporate and commercial matters, contractual arrangements, regulatory issues, litigation and dispute resolution.'),
('home', 'approach_statement', 'We aim to deliver responsive, practical and commercially sound legal solutions, helping clients manage legal risks, protect their interests and achieve their business objectives.'),
('home', 'contact_heading', 'Start with a conversation.'),
('home', 'contact_subtitle', 'Tell us a little about the matter. We will point you to the right counsel and the sensible next step — no obligation.');

-- 5. LEGAL PAGES
INSERT INTO legal_pages (type, title, body, published) VALUES
('privacy', 'Privacy Policy', 'This Privacy Policy sets out how Avance Law Partners collects, uses, and protects personal information submitted through avancelawpartners.info. We respect the confidentiality of all enquiries and handle data in accordance with applicable laws in Bangladesh.', true),
('disclaimer', 'Legal Disclaimer', 'The information provided on this website is for general informational purposes only and does not constitute formal legal advice. Accessing or submitting an enquiry through this site does not establish an attorney-client relationship until formally engaged.', true),
('terms', 'Terms of Use', 'By using this website, you agree to these Terms of Use. All content, trademarks, and intellectual property remain the property of Avance Law Partners.', true);

-- 6. SEO METADATA
INSERT INTO seo_metadata (page_key, title, description, og_title, og_description, canonical_slug) VALUES
('home', 'Avance Law Partners | Legal Excellence Since 1998 | Dhaka, Bangladesh', 'Providing trusted legal counsel and representation for companies, institutions and individuals across corporate, commercial, regulatory and dispute matters.', 'Avance Law Partners | Legal Excellence Since 1998', 'Providing trusted legal counsel and representation since 1998 in Dhaka, Bangladesh.', '/'),
('about', 'About Us | Avance Law Partners', 'Established in 1998, Avance Law Partners combines sound legal expertise with practical, commercially focused advice.', 'About Avance Law Partners', 'Legal excellence and trusted counsel in Dhaka since 1998.', '/about'),
('services', 'Legal Practice Areas | Avance Law Partners', 'Eight focused practice areas including Corporate Law, Contract Drafting, Commercial Advisory, High Court Practice, BERC, Arbitration and Dispute Resolution.', 'Legal Practice Areas | Avance Law Partners', 'Comprehensive legal services tailored to business objectives.', '/services'),
('lawyers', 'Our Lawyers | Avance Law Partners', 'Direct access to experienced counsel at Avance Law Partners in Dhaka, Bangladesh.', 'Our Lawyers | Avance Law Partners', 'Meet the legal professionals at Avance Law Partners.', '/lawyers'),
('contact', 'Contact Us | Avance Law Partners', 'Contact Avance Law Partners in Hatirjheel, Dhaka. Start with a consultation regarding your corporate or legal matter.', 'Contact Avance Law Partners', 'Reach our chamber at Mohanagar Project, Hatirjheel, Dhaka.', '/contact'),
('approach', 'Our Approach | Avance Law Partners', 'Responsive. Practical. Commercially sound. How Avance Law Partners delivers legal solutions.', 'Our Approach | Avance Law Partners', 'Responsive, practical and commercially sound legal solutions.', '/approach');
