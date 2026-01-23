-- =============================================
-- Somework Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('free', 'paid')),
  link TEXT NOT NULL,
  button_label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Config Table (key-value store)
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Allow public read" ON resources
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON site_config
  FOR SELECT USING (true);

-- Policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON resources
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON resources
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON resources
  FOR DELETE USING (true);

CREATE POLICY "Allow authenticated upsert" ON site_config
  FOR ALL USING (true);

-- Insert default settings
INSERT INTO site_config (key, value) VALUES
  ('hero_name', 'Althur'),
  ('hero_tagline', 'Meta Ads marketer yang suka ngoding & bikin tools pake AI.'),
  ('hero_description', 'Gue sharing hal-hal praktis soal AI coding, Facebook Ads, automation, dan internal tools. Halaman ini isinya resource yang udah dikurasi — simpel, berguna, tanpa basa-basi.'),
  ('contact_whatsapp', 'https://wa.me/628123456789'),
  ('contact_email', 'hello@somework.id'),
  ('contact_threads', 'https://threads.net/@somework'),
  ('footer_quote', 'Tools dan AI harusnya bikin hidup lebih simpel, bukan makin ribet.')
ON CONFLICT (key) DO NOTHING;

-- Insert sample resources
INSERT INTO resources (title, description, type, link, button_label) VALUES
  ('Template Testing FB Ads', 'Framework simpel buat testing iklan tanpa nebak-nebak.', 'free', '/free/fb-ads-testing', 'Ambil Gratis'),
  ('AI Prompts buat Marketer & Builder', 'Prompt siap pakai buat riset, copywriting, logika automation.', 'free', '/free/ai-prompts', 'Ambil Gratis'),
  ('Panduan Automation Simpel', 'Automation untuk pemula dan tim kecil.', 'free', '/free/automation-guide', 'Ambil Gratis'),
  ('AI Automation Starter Pack', 'Bikin workflow bisnis pake AI.', 'paid', 'https://lynk.id/your-link', 'Lihat'),
  ('Framework Scaling FB Ads', 'Dari testing ke scaling yang lebih aman.', 'paid', 'https://lynk.id/your-link', 'Lihat'),
  ('Blueprint Internal Tools', 'Cara mikir dan bikin internal apps yang simpel.', 'paid', 'https://lynk.id/your-link', 'Lihat');
