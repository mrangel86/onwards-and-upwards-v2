import React, { useEffect, useState, useRef } from 'react';
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

// Enhanced PDF.js worker configuration with multiple fallbacks
const configurePdfWorker = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    console.log('Configuring PDF.js worker, version:', pdfjsLib.version);
    
    try {
      // First, try the standard build path for newer versions
      const workerUrls = [
        // Option 1: Standard build path
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        // Option 2: Legacy build path
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`,
        // Option 3: Different CDN
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        // Option 4: Mozilla CDN (most reliable)
        `https://mozilla.github.io/pdf.js/build/pdf.worker.min.js`
      ];
      
      // Set the first option as primary
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrls[0];
      console.log('PDF.js worker configured with primary URL:', workerUrls[0]);
      
      // Store fallback URLs for potential runtime switching
      (window as any).pdfWorkerFallbacks = workerUrls.slice(1);
      
    } catch (error) {
      console.warn('PDF.js worker configuration failed, disabling worker:', error);
      // Fallback to main thread processing (no worker)
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
    }
  }
};

// Initialize worker configuration once
configurePdfWorker();

// Function to try alternative worker URLs
const tryAlternativeWorker = async () => {
  const fallbacks = (window as any).pdfWorkerFallbacks || [];
  
  for (const workerUrl of fallbacks) {
    try {
      console.log('Trying alternative worker URL:', workerUrl);
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      
      // Test if this worker URL works by creating a simple document
      const testTask = pdfjsLib.getDocument({ data: new Uint8Array() });
      await testTask.promise.catch(() => {}); // We expect this to fail, just testing worker
      testTask.destroy();
      
      console.log('Alternative worker URL working:', workerUrl);
      return true;
    } catch (error) {
      console.log('Alternative worker failed:', workerUrl, error);
      continue;
    }
  }
  
  // If all workers fail, disable worker
  console.log('All worker URLs failed, disabling worker');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  return false;
};

// Utility function to generate slug from filename
const generateSlug = (filename: string): string => {
  return filename
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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
  const [processingProgress, setProcessingProgress] = useState(0);

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Load book data based on slug or file parameter
  const loadBookData = async (): Promise<string | null> => {
    if (!isMountedRef.current) return null;
    
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

        if (!isMountedRef.current) return null;

        if (data && !dbError) {
          setBookData(data);
          return data.file_url;
        }

        // If not found in database, try to construct URL from slug
        const potentialFileName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + '.pdf';
        const constructedUrl = `${supabase.storage.from(BOOKS_BUCKET).getPublicUrl(potentialFileName).data.publicUrl}`;
        
        // Check if file exists
        try {
          const response = await fetch(constructedUrl, { 
            method: 'HEAD',
            signal: abortControllerRef.current?.signal 
          });
          
          if (!isMountedRef.current) return null;
          
          if (response.ok) {
            const newBookData = {
              slug,
              file_url: constructedUrl,
              title: potentialFileName.replace('.pdf', '')
            };
            setBookData(newBookData);
            
            // Save to database for future use (don't await to avoid blocking)
            supabase.from('books').insert(newBookData).select().single().catch(console.warn);
            return constructedUrl;
          }
        } catch (fetchError) {
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            return null;
          }
          // File doesn't exist, continue to error
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
        
        if (!isMountedRef.current) return null;
        setBookData(newBookData);
        
        // Try to save to database (don't block on this)
        supabase.from('books').upsert(newBookData, { onConflict: 'slug' }).catch(console.warn);
        
        return fileParam;
      } else {
        throw new Error('No book specified. Please provide either a slug or file parameter.');
      }
    } catch (err) {
      if (!isMountedRef.current) return null;
      const errorMessage = err instanceof Error ? err.message : 'Failed to load book data';
      setError(errorMessage);
      return null;
    }
  };

  // Convert PDF to images with enhanced worker fallback
  const convertPdfToImages = async (pdfUrl: string): Promise<string[]> => {
    if (!isMountedRef.current) return [];
    
    setPdfProcessing(true);
    setProcessingProgress(0);
    
    let retryAttempt = 0;
    const maxRetries = 2;
    
    while (retryAttempt <= maxRetries) {
      try {
        console.log(`Loading PDF attempt ${retryAttempt + 1}/${maxRetries + 1} from:`, pdfUrl);
        
        // Create abort controller for this operation
        abortControllerRef.current = new AbortController();
        
        // Configure loading task
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
          disableStream: true,
          disableFontFace: false,
          maxImageSize: 1024 * 1024 * 2, // 2MB to prevent memory issues
        });

        // Set up timeout
        const TIMEOUT_MS = 15000; // 15 seconds timeout
        const timeoutId = setTimeout(() => {
          loadingTask.destroy();
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, TIMEOUT_MS);

        let pdf;
        try {
          pdf = await loadingTask.promise;
          clearTimeout(timeoutId);
        } catch (loadError) {
          clearTimeout(timeoutId);
          throw loadError;
        }

        if (!isMountedRef.current) {
          pdf?.destroy();
          return [];
        }

        console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`);
        
        const pageImages: string[] = [];
        const totalPages = pdf.numPages;

        // Process pages sequentially to avoid memory issues
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          if (!isMountedRef.current) {
            pdf?.destroy();
            return [];
          }

          try {
            const page = await pdf.getPage(pageNum);
            
            if (!isMountedRef.current) {
              page.cleanup();
              pdf?.destroy();
              return [];
            }

            const scale = 1.5; // Balanced scale for quality vs performance
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) {
              page.cleanup();
              throw new Error('Could not get canvas context');
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };

            await page.render(renderContext).promise;
            
            if (!isMountedRef.current) {
              page.cleanup();
              pdf?.destroy();
              return [];
            }

            pageImages.push(canvas.toDataURL('image/jpeg', 0.85)); // Use JPEG for smaller size
            page.cleanup(); // Clean up page resources
            
            // Update progress
            const progress = Math.round((pageNum / totalPages) * 100);
            setProcessingProgress(progress);
            
            console.log(`Processed page ${pageNum}/${totalPages}`);
            
          } catch (pageError) {
            console.error(`Error processing page ${pageNum}:`, pageError);
            
            // Create error placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 600;
            const context = canvas.getContext('2d');
            
            if (context) {
              context.fillStyle = '#f3f4f6';
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.fillStyle = '#374151';
              context.font = '16px Arial';
              context.textAlign = 'center';
              context.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2 - 10);
              context.fillText('Failed to load', canvas.width / 2, canvas.height / 2 + 20);
            }
            
            pageImages.push(canvas.toDataURL('image/jpeg', 0.85));
          }
        }

        // Clean up PDF document
        pdf?.destroy();
        return pageImages;
        
      } catch (err) {
        console.error(`PDF processing error (attempt ${retryAttempt + 1}):`, err);
        
        // Check if it's a worker-related error and we have retries left
        if (retryAttempt < maxRetries && err instanceof Error && 
            (err.message.includes('worker') || err.message.includes('fetch') || 
             err.message.includes('Setting up fake worker failed'))) {
          
          console.log('Worker error detected, trying alternative worker...');
          const workerWorking = await tryAlternativeWorker();
          
          if (workerWorking || retryAttempt === maxRetries - 1) {
            retryAttempt++;
            continue; // Retry with new worker configuration
          }
        }
        
        // Provide specific error messages
        let errorMessage = 'Failed to process PDF';
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'PDF loading was cancelled';
          } else if (err.message.includes('InvalidPDFException')) {
            errorMessage = 'The file is not a valid PDF document.';
          } else if (err.message.includes('MissingPDFException')) {
            errorMessage = 'PDF file not found or cannot be accessed.';
          } else if (err.message.includes('UnexpectedResponseException')) {
            errorMessage = 'Network error while loading PDF. Please check your connection.';
          } else if (err.message.includes('timeout') || err.message.includes('Loading')) {
            errorMessage = 'PDF loading timed out. The file might be too large.';
          } else if (err.message.includes('worker') || err.message.includes('fetch')) {
            errorMessage = 'PDF worker configuration error. Please try refreshing the page.';
          } else {
            errorMessage = `PDF processing error: ${err.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }
    }
    
    throw new Error('Failed to process PDF after multiple attempts');
  };

  // Main effect to load and process book
  useEffect(() => {
    let cancelled = false;
    
    const loadBook = async () => {
      if (cancelled) return;
      
      try {
        const pdfUrl = await loadBookData();
        if (cancelled || !pdfUrl) return;

        const pageImages = await convertPdfToImages(pdfUrl);
        if (cancelled) return;

        setPages(pageImages);
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load book';
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setPdfProcessing(false);
          setProcessingProgress(0);
        }
      }
    };

    loadBook();

    // Cleanup function
    return () => {
      cancelled = true;
    };
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
          {pdfProcessing && (
            <div className="mt-4">
              <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {processingProgress}% complete
              </p>
            </div>
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