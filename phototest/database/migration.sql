-- Run this SQL in the Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anon access (or use Supabase RLS policies as needed)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON photos
  FOR ALL
  USING (true)
  WITH CHECK (true);
