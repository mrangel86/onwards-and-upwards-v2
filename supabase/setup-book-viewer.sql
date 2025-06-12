-- Book Viewer Setup Script for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create the books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    file_url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public read access
CREATE POLICY "Books are publicly readable" ON books
    FOR SELECT USING (true);

-- 4. Create policy for authenticated insert/update (optional - for future admin features)
CREATE POLICY "Authenticated users can insert books" ON books
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update books" ON books
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 5. Create storage bucket (this needs to be done via Supabase Dashboard)
-- Go to Storage -> Create new bucket
-- Bucket name: books
-- Make it public
-- Allow file uploads

-- 6. Create storage policies for the books bucket
-- This allows public read access to files in the books bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('books', 'books', true, 52428800, array['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies
CREATE POLICY "Public can view book files" ON storage.objects
    FOR SELECT USING (bucket_id = 'books');

CREATE POLICY "Authenticated can upload book files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'books' AND auth.role() = 'authenticated');

-- 8. Insert sample book data (replace with your actual files)
INSERT INTO books (slug, file_url, title) VALUES
    ('the-giggle-tree', 'https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/books/The%20Giggle%20Tree.pdf', 'The Giggle Tree')
ON CONFLICT (slug) DO NOTHING;

-- Verify setup
SELECT 'Books table created successfully' as status;
SELECT COUNT(*) as book_count FROM books;