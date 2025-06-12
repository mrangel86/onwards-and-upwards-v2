# 📚 Book Viewer Setup Guide

A mobile-friendly PDF flipbook viewer for the Onwards & Upwards blog that creates shareable links for PDFs with realistic page-turning animations.

## ✨ Features

- **Clean flipbook interface** with StPageFlip animations
- **Mobile-responsive** with touch/swipe support  
- **Dual URL patterns**:
  - Query param: `/book-viewer?file=https://...pdf`  
  - Clean slugs: `/book/the-giggle-tree`
- **Auto-slug generation** from PDF filenames
- **White background** with minimal UI chrome
- **PDF-to-canvas conversion** for optimal performance

## 🚀 Setup Instructions

### 1. Install Dependencies
The required dependencies have been added to `package.json`:
- `stpageflip`: Flipbook animations
- `pdfjs-dist`: PDF rendering

Run:
```bash
npm install
# or
bun install
```

### 2. Set Up Supabase Infrastructure

#### Option A: Use the SQL Script (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/setup-book-viewer.sql`
4. Run the script

#### Option B: Manual Setup
1. **Create Storage Bucket**:
   - Go to Storage in your Supabase dashboard
   - Click "Create new bucket"
   - Name: `books`
   - Make it **public**
   - Set file size limit: 50MB
   - Allowed MIME types: `application/pdf`

2. **Set Up Storage Policies**:
   ```sql
   CREATE POLICY "Public can view book files" ON storage.objects
       FOR SELECT USING (bucket_id = 'books');
   ```

3. **Create Books Table**:
   ```sql
   CREATE TABLE books (
       id SERIAL PRIMARY KEY,
       slug VARCHAR(255) UNIQUE NOT NULL,
       file_url TEXT NOT NULL,
       title VARCHAR(255) NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### 3. Upload Your First PDF

#### Upload "The Giggle Tree"
1. Go to Storage → books bucket in Supabase
2. Upload the PDF file as: `The Giggle Tree.pdf`
3. The public URL will be:
   ```
   https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/books/The%20Giggle%20Tree.pdf
   ```

## 📖 Usage Examples

### Query Parameter Method
```
https://onwardsandupwards.co/book-viewer?file=https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/books/The%20Giggle%20Tree.pdf
```

### Clean Slug Method  
```
https://onwardsandupwards.co/book/the-giggle-tree
```

### Auto-Slug Generation
The system automatically creates slugs from filenames:
- `The Giggle Tree.pdf` → `the-giggle-tree`
- `Adventure Guide 2024.pdf` → `adventure-guide-2024`
- `Mom's Recipe Book.pdf` → `moms-recipe-book`

## 🔧 Technical Implementation

### How It Works
1. **URL Routing**: React Router handles both `/book-viewer` and `/book/:slug` patterns
2. **PDF Processing**: PDF.js converts each page to high-quality canvas images
3. **Flipbook Creation**: StPageFlip creates realistic page-turning animations
4. **Database Integration**: Automatically saves book metadata for future slug-based access

### Key Components
- **BookViewer.tsx**: Main component handling PDF loading and flipbook initialization
- **Supabase Integration**: Automatic book metadata storage and retrieval
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Mobile Features
- Touch/swipe gestures for page turning
- Responsive sizing that adapts to screen size
- Optimized loading for mobile data connections

## 🎯 Example URLs

After setup, these URLs will work:

**Direct File Access:**
```
/book-viewer?file=https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/books/The%20Giggle%20Tree.pdf
```

**Clean Slug Access:**
```
/book/the-giggle-tree
```

The system will automatically:
- Convert the PDF to flipbook format
- Create a database entry with the slug
- Enable both URL patterns for future access

## 🛠 Future Enhancements

Potential improvements you could add:
- **Admin upload interface** for easier PDF management
- **Bookmarks/chapters** for longer books  
- **Full-screen mode** toggle
- **Reading progress** tracking
- **Social sharing** buttons
- **Download options** for offline reading

## 📱 Browser Support

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **Mobile devices** (iOS Safari, Android Chrome)
- **PDF.js compatibility** (automatically handles PDF rendering)

The viewer is designed to work on virtually any device that supports modern web standards!

---

**Ready to test?** Upload your PDF to the `books` bucket and visit:
`https://onwardsandupwards.co/book-viewer?file=[your-pdf-url]`