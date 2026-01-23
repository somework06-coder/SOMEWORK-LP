-- Add new default settings for section titles
INSERT INTO site_config (key, value) VALUES
  ('section_free_title', 'Resource Gratis'),
  ('section_free_subtitle', 'Coba dulu. Nilai nanti.'),
  ('section_paid_title', 'Resource Berbayar'),
  ('section_paid_subtitle', 'Buat eksekusi yang lebih cepat.'),
  ('contact_title', 'Kerja Bareng'),
  ('contact_subtitle', 'Ngobrol dulu aja.')
ON CONFLICT (key) DO NOTHING;
