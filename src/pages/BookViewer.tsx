import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageFlip } from 'stpageflip';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const BOOKS_BUCKET = 'books';

interface BookData {
  slug: string;
  file_url: string;
  title: string;
}

// Utility function to generate slug from filename
const generateSlug = (filename: string): string => {
  return filename
    .replace(/\.pdf$/i, '') // Remove .pdf extension
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

const BookViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const fileParam = searchParams.get('file');
  
  const flipBookRef = useRef<PageFlip | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [pages, setPages] = useState<string[]>([]);

  // Initialize books table if it doesn't exist
  const initializeBooksTable = async () => {
    try {
      // Try to create the books table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS books (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            file_url TEXT NOT NULL,
            title VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (createError && !createError.message.includes('already exists')) {
        console.warn('Could not create books table:', createError);
      }
    } catch (err) {
      console.warn('Books table initialization failed:', err);
    }
  };

  // Load book data based on slug or file parameter
  const loadBookData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (slug) {
        // Try to load from database first
        const { data, error: dbError } = await supabase
          .from('books')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data && !dbError) {
          setBookData(data);
          return data.file_url;
        }

        // If not found in database, try to construct URL from slug and check if file exists
        const potentialFileName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + '.pdf';
        const constructedUrl = `${supabase.storage.from(BOOKS_BUCKET).getPublicUrl(potentialFileName).data.publicUrl}`;
        
        // Check if file exists by attempting to fetch it
        try {
          const response = await fetch(constructedUrl, { method: 'HEAD' });
          if (response.ok) {
            const newBookData = {
              slug,
              file_url: constructedUrl,
              title: potentialFileName.replace('.pdf', '')
            };
            setBookData(newBookData);
            
            // Save to database for future use
            await supabase.from('books').insert(newBookData).select().single();
            return constructedUrl;
          }
        } catch {
          // File doesn't exist
        }
        
        throw new Error(`Book with slug "${slug}" not found`);
      } else if (fileParam) {
        // Direct file URL provided
        const url = new URL(fileParam);
        const filename = url.pathname.split('/').pop() || 'Unknown Book';
        const title = filename.replace('.pdf', '');
        const generatedSlug = generateSlug(filename);
        
        const newBookData = {
          slug: generatedSlug,
          file_url: fileParam,
          title
        };
        setBookData(newBookData);
        
        // Try to save to database
        try {
          await supabase.from('books').upsert(newBookData, { onConflict: 'slug' });
        } catch (err) {
          console.warn('Could not save book to database:', err);
        }
        
        return fileParam;
      } else {
        throw new Error('No book specified. Please provide either a slug or file parameter.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book data');
      return null;
    }
  };

  // Convert PDF to images for flipbook
  const convertPdfToImages = async (pdfUrl: string) => {
    try {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const pageImages: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const scale = 2; // Higher scale for better quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        pageImages.push(canvas.toDataURL('image/png'));
      }

      return pageImages;
    } catch (err) {
      throw new Error(`Failed to process PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Initialize flipbook
  const initializeFlipbook = () => {
    if (!containerRef.current || pages.length === 0) return;

    // Clean up existing flipbook
    if (flipBookRef.current) {
      flipBookRef.current.destroy();
    }

    // Clear container
    containerRef.current.innerHTML = '';

    try {
      const flipBook = new PageFlip(containerRef.current, {
        width: 400,
        height: 600,
        size: 'stretch',
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false,
        clickEventForward: true,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      // Add pages to flipbook
      pages.forEach((pageImage, index) => {
        const pageElement = document.createElement('div');
        pageElement.className = 'page';
        pageElement.innerHTML = `
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: white;">
            <img src="${pageImage}" alt="Page ${index + 1}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
          </div>
        `;
        flipBook.loadFromHTML([pageElement]);
      });

      flipBookRef.current = flipBook;
    } catch (err) {
      setError(`Failed to initialize flipbook: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Main effect to load and process book
  useEffect(() => {
    const loadBook = async () => {
      await initializeBooksTable();
      
      const pdfUrl = await loadBookData();
      if (!pdfUrl) return;

      try {
        const pageImages = await convertPdfToImages(pdfUrl);
        setPages(pageImages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [slug, fileParam]);

  // Initialize flipbook when pages are ready
  useEffect(() => {
    if (pages.length > 0 && !loading) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeFlipbook, 100);
    }
  }, [pages, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flipBookRef.current) {
        flipBookRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading book...</p>
          {bookData && <p className="text-sm text-gray-500 mt-2">{bookData.title}</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {bookData && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">{bookData.title}</h1>
            <button 
              onClick={() => window.history.back()} 
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Flipbook Container */}
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div 
          ref={containerRef}
          className="book-container"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
        Click corners to flip pages • Swipe on mobile
      </div>
    </div>
  );
};

export default BookViewer;