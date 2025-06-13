import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageFlip } from 'page-flip';

const BOOKS_BUCKET = 'books';

interface BookData {
  slug: string;
  file_url: string;
  title: string;
}

// Fixed PDF.js worker configuration for v4+ (uses .mjs files)
const configurePdfWorker = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    console.log('Configuring PDF.js worker, version:', pdfjsLib.version);
    
    try {
      // For PDF.js v4+, use .mjs worker files
      const workerUrls = [
        // Option 1: unpkg CDN with .mjs extension
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
        // Option 2: jsDelivr CDN
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
        // Option 3: Mozilla CDN (fallback)
        `https://mozilla.github.io/pdf.js/build/pdf.worker.min.mjs`,
        // Option 4: Disable worker (main thread processing)
        ''
      ];
      
      // Set the first option as primary
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrls[0];
      console.log('PDF.js worker configured with URL:', workerUrls[0]);
      
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
      console.log('Trying alternative worker URL:', workerUrl || 'main thread (no worker)');
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      return true;
    } catch (error) {
      console.log('Alternative worker failed:', workerUrl, error);
      continue;
    }
  }
  
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

  // StPageFlip refs
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
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
    const maxRetries = 3;
    
    while (retryAttempt <= maxRetries) {
      try {
        console.log(`Loading PDF attempt ${retryAttempt + 1}/${maxRetries + 1} from:`, pdfUrl);
        console.log('Current worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc || 'main thread');
        
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
            (err.message.includes('worker') || 
             err.message.includes('fetch') || 
             err.message.includes('dynamically imported module') ||
             err.message.includes('Setting up fake worker failed'))) {
          
          console.log('Worker error detected, trying alternative worker...');
          const workerWorking = await tryAlternativeWorker();
          
          retryAttempt++;
          continue; // Retry with new worker configuration
        }
        
        // If not a worker error or no more retries, throw the error
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
          } else if (err.message.includes('worker') || 
                     err.message.includes('fetch') || 
                     err.message.includes('dynamically imported module')) {
            errorMessage = 'PDF worker configuration error. The PDF will be processed using the main thread (slower but functional).';
          } else {
            errorMessage = `PDF processing error: ${err.message}`;
          }
        }
        
        throw new Error(errorMessage);
      }
    }
    
    throw new Error('Failed to process PDF after multiple attempts');
  };

  // NEW: Initialize StPageFlip
  const initializePageFlip = useCallback(() => {
    if (!bookRef.current || !pages.length || pageFlipRef.current) {
      return;
    }

    try {
      console.log('Initializing StPageFlip with', pages.length, 'pages');
      
      const pageFlip = new PageFlip(bookRef.current, {
        width: 400,
        height: 600,
        size: 'stretch',
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 400,
        maxHeight: 1000,
        drawShadow: true,
        flippingTime: 1000,
        usePortrait: true,
        startZIndex: 0,
        autoSize: true,
        maxShadowOpacity: 0.5,
        showCover: false,
        mobileScrollSupport: true,
        swipeDistance: 30,
        clickEventForward: true,
        useMouseEvents: true
      });

      // Create HTML elements for each page
      const pageElements: HTMLElement[] = [];
      
      pages.forEach((pageImage, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.style.backgroundColor = '#fff';
        pageDiv.style.display = 'flex';
        pageDiv.style.alignItems = 'center';
        pageDiv.style.justifyContent = 'center';
        pageDiv.style.overflow = 'hidden';
        
        const img = document.createElement('img');
        img.src = pageImage;
        img.alt = `Page ${index + 1}`;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        
        pageDiv.appendChild(img);
        pageElements.push(pageDiv);
      });

      pageFlip.loadFromHTML(pageElements);

      pageFlip.on('flip', (e) => {
        setCurrentPage(e.data);
        console.log('Page flipped to:', e.data);
      });

      pageFlip.on('changeState', (e) => {
        console.log('PageFlip state changed:', e.data);
      });

      pageFlipRef.current = pageFlip;
      console.log('StPageFlip initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize StPageFlip:', error);
      setError('Failed to initialize page flip animation. Please try refreshing the page.');
    }
  }, [pages]);

  // NEW: Navigation functions
  const nextPage = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  }, []);

  const prevPage = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  }, []);

  const goToPage = useCallback((pageIndex: number) => {
    if (pageFlipRef.current && pageIndex >= 0 && pageIndex < pages.length) {
      pageFlipRef.current.turnToPage(pageIndex);
    }
  }, [pages.length]);

  // Initialize PageFlip when pages are loaded
  useEffect(() => {
    if (pages.length > 0) {
      const timer = setTimeout(() => {
        initializePageFlip();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [pages, initializePageFlip]);

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

      {/* Book Display with StPageFlip - REPLACED SECTION */}
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

          {/* StPageFlip Container - THIS REPLACES THE OLD 3D CSS ANIMATION */}
          <div 
            ref={bookRef}
            className="relative bg-white shadow-2xl rounded-lg overflow-hidden mx-auto"
            style={{ maxWidth: '800px', minHeight: '600px' }}
          >
            {/* Fallback content while StPageFlip initializes */}
            {pages.length > 0 && !pageFlipRef.current && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Initializing page flip...</p>
                </div>
              </div>
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

      {/* Updated Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
        Click page corners, use arrows, or swipe to turn pages
      </div>
    </div>
  );
};

export default BookViewer;