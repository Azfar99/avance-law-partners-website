-- Avance Law Partners (avancelawpartners.info)
-- Complete Database Schema with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SITE SETTINGS (Single-row configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firm_name TEXT NOT NULL DEFAULT 'Avance Law Partners',
  tagline TEXT NOT NULL DEFAULT 'Legal excellence. Practical solutions.',
  established TEXT NOT NULL DEFAULT '1998',
  location TEXT NOT NULL DEFAULT 'Dhaka, Bangladesh',
  address_line_1 TEXT NOT NULL DEFAULT 'House 5, Block A, Road No. 2',
  address_line_2 TEXT NOT NULL DEFAULT 'Mohanagar Project, Hatirjheel',
  address_line_3 TEXT NOT NULL DEFAULT 'Dhaka, Bangladesh',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  office_hours TEXT DEFAULT '',
  logo_url TEXT DEFAULT '/assets/alp-logo.jpeg',
  favicon_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT '© Avance Law Partners. All rights reserved.',
  social_links JSONB DEFAULT '[]'::jsonb,
  map_location JSONB DEFAULT NULL,
  notification_email TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LAWYERS
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  designation TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  biography TEXT DEFAULT '',
  education JSONB DEFAULT '[]'::jsonb,
  qualifications JSONB DEFAULT '[]'::jsonb,
  court_memberships JSONB DEFAULT '[]'::jsonb,
  bar_memberships JSONB DEFAULT '[]'::jsonb,
  experience TEXT DEFAULT '',
  languages JSONB DEFAULT '["English", "Bangla"]'::jsonb,
  practice_areas JSONB DEFAULT '[]'::jsonb,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  other_social JSONB DEFAULT '[]'::jsonb,
  additional_info TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES (PRACTICE AREAS)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  index_number TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL DEFAULT '',
  intro TEXT DEFAULT '',
  items JSONB DEFAULT '[]'::jsonb,
  icon TEXT DEFAULT '',
  associated_lawyers JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENQUIRIES (CONTACT SUBMISSIONS)
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Closed')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PAGE CONTENT (EDITABLE CMS BLOCKS)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content TEXT DEFAULT '',
  content_json JSONB DEFAULT NULL,
  image_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, section_key)
);

-- 7. LEGAL PAGES (PRIVACY, DISCLAIMER, TERMS)
CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE CHECK (type IN ('privacy', 'disclaimer', 'terms')),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  published BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  focal_point JSONB DEFAULT '{"x": 50, "y": 34}'::jsonb,
  file_size INTEGER DEFAULT 0,
  mime_type TEXT DEFAULT 'image/jpeg',
  usage_refs JSONB DEFAULT '[]'::jsonb,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SEO METADATA
CREATE TABLE IF NOT EXISTS seo_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  og_title TEXT DEFAULT '',
  og_description TEXT DEFAULT '',
  og_image_url TEXT DEFAULT '',
  canonical_slug TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

-- Site Settings policies
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Lawyers policies
CREATE POLICY "Public can view published lawyers" ON lawyers
  FOR SELECT USING (published = true);
CREATE POLICY "Admins have full access to lawyers" ON lawyers
  FOR ALL USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Public can view published services" ON services
  FOR SELECT USING (published = true);
CREATE POLICY "Admins have full access to services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries policies (Strict security: public can insert enquiry, only admin can read/manage)
CREATE POLICY "Anyone can submit enquiry" ON enquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view enquiries" ON enquiries
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can update enquiries" ON enquiries
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can delete enquiries" ON enquiries
  FOR DELETE USING (auth.role() = 'authenticated');

-- Page Content policies
CREATE POLICY "Public can view page content" ON page_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage page content" ON page_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Legal Pages policies
CREATE POLICY "Public can view published legal pages" ON legal_pages
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage legal pages" ON legal_pages
  FOR ALL USING (auth.role() = 'authenticated');

-- Media policies
CREATE POLICY "Public can view media" ON media
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

-- SEO Metadata policies
CREATE POLICY "Public can view SEO metadata" ON seo_metadata
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage SEO metadata" ON seo_metadata
  FOR ALL USING (auth.role() = 'authenticated');
