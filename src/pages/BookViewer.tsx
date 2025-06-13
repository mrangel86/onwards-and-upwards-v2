import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BOOKS_BUCKET = 'books';

interface BookData {
  slug: string;
  file_url: string;
  title: string;
}

// Multi-fallback PDF.js worker configuration
const configurePdfWorker = () => {
  try {
    // Primary: Use worker from local bundle (Vite will handle this)
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url
    ).toString();
    console.log('PDF.js worker configured: Local bundle');
  } catch (localError) {
    try {
      // Fallback 1: Use unpkg CDN (more reliable than cdnjs for Vercel)
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
      console.log('PDF.js worker configured: unpkg CDN fallback');
    } catch (unpkgError) {
      try {
        // Fallback 2: Use jsDelivr CDN
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
        console.log('PDF.js worker configured: jsDelivr CDN fallback');
      } catch (jsDelivrError) {
        // Fallback 3: Disable worker (slower but most compatible)
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
        console.warn('PDF.js worker disabled - using main thread (slower performance)');
      }
    }
  }
};

// Initialize worker configuration
configurePdfWorker();

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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pdfProcessing, setPdfProcessing] = useState(false);

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

  // Convert PDF to images for display with enhanced error handling
  const convertPdfToImages = async (pdfUrl: string) => {
    setPdfProcessing(true);
    try {
      console.log('Loading PDF from:', pdfUrl);
      
      // Enhanced PDF loading with timeout and better error handling
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        // Disable streaming for better compatibility
        disableStream: true,
        // Disable font face rendering for faster loading
        disableFontFace: false,
        // Set max image size to prevent memory issues
        maxImageSize: 1024 * 1024 * 4, // 4MB
      });

      // Add timeout protection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF loading timeout after 30 seconds')), 30000);
      });

      const pdf = await Promise.race([loadingTask.promise, timeoutPromise]) as any;
      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
      
      const pageImages: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
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
          console.log(`Processed page ${pageNum}/${pdf.numPages}`);
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          // Create a placeholder for failed pages
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 600;
          const context = canvas.getContext('2d');
          if (context) {
            context.fillStyle = '#f3f4f6';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#374151';
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2 - 10);
            context.fillText('Failed to load', canvas.width / 2, canvas.height / 2 + 20);
          }
          pageImages.push(canvas.toDataURL('image/png'));
        }
      }

      return pageImages;
    } catch (err) {
      console.error('PDF processing error:', err);
      
      // Enhanced error messages based on error type
      let errorMessage = 'Failed to process PDF';
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'PDF loading timed out. The file might be too large or the connection is slow.';
        } else if (err.message.includes('InvalidPDFException')) {
          errorMessage = 'The file is not a valid PDF document.';
        } else if (err.message.includes('MissingPDFException')) {
          errorMessage = 'PDF file not found or cannot be accessed.';
        } else if (err.message.includes('UnexpectedResponseException')) {
          errorMessage = 'Network error while loading PDF. Please check your connection.';
        } else if (err.message.includes('worker')) {
          errorMessage = 'PDF worker configuration error. Trying alternative loading method...';
          
          // Attempt to reconfigure worker and retry once
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
            console.log('Retrying PDF processing without worker...');
            return await convertPdfToImages(pdfUrl);
          } catch (retryError) {
            errorMessage = 'PDF processing failed even with fallback method.';
          }
        } else {
          errorMessage = `PDF processing error: ${err.message}`;
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setPdfProcessing(false);
    }
  };

  // Main effect to load and process book
  useEffect(() => {
    const loadBook = async () => {
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

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            {pdfProcessing ? 'Processing PDF pages...' : 'Loading book...'}
          </p>
          {bookData && <p className="text-sm text-gray-500 mt-2">{bookData.title}</p>}
          {pdfProcessing && pages.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Processed {pages.length} pages...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Loading Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-2"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            <details>
              <summary className="cursor-pointer">Technical Details</summary>
              <p className="mt-2 text-left">
                PDF.js version: {pdfjsLib.version}<br/>
                Worker source: {pdfjsLib.GlobalWorkerOptions.workerSrc || 'Main thread (no worker)'}
              </p>
            </details>
          </div>
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Page {currentPage + 1} of {pages.length}
              </span>
              <button 
                onClick={() => window.history.back()} 
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Display */}
      <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="relative max-w-4xl w-full">
          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Previous page"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
            aria-label="Next page"
          >
            <ChevronRight size={24} />
          </button>

          {/* Page Display */}
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            {pages.length > 0 && (
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation Dots */}
      {pages.length > 1 && (
        <div className="flex justify-center pb-6">
          <div className="flex gap-2 max-w-md overflow-x-auto">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
        Use arrow buttons or click dots to navigate • Swipe on mobile
      </div>
    </div>
  );
};

export default BookViewer;
