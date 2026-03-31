import React, { useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookData } from '@/hooks/useBookData';
import { usePdfPages } from '@/hooks/usePdfPages';
import { usePageFlip, calculateDimensions } from '@/hooks/usePageFlip';

// ── Loading screen ──────────────────────────────────────────────────────────

interface LoadingScreenProps {
  title?: string;
  pdfProcessing: boolean;
  processingProgress: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ title, pdfProcessing, processingProgress }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
      <p className="text-lg text-gray-600">
        {pdfProcessing ? 'Processing PDF pages...' : 'Loading book...'}
      </p>
      {title && <p className="text-sm text-gray-500 mt-2">{title}</p>}
      {pdfProcessing && (
        <div className="mt-4">
          <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{processingProgress}% complete</p>
        </div>
      )}
    </div>
  </div>
);

// ── Error screen ────────────────────────────────────────────────────────────

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-500 text-6xl mb-4">📚</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Loading Failed</h1>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="space-y-2">
        <button
          onClick={() => window.location.reload()}
          className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-colors mr-2"
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
            PDF.js version: {pdfjsLib.version}
            <br />
            Worker source: {pdfjsLib.GlobalWorkerOptions.workerSrc || 'Main thread (no worker)'}
          </p>
        </details>
      </div>
    </div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────

const BookViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const fileParam = searchParams.get('file');
  const bookRef = useRef<HTMLDivElement>(null);

  const { bookData, pdfUrl, loading: bookLoading, error: bookError } = useBookData(slug, fileParam);
  const { pages, pdfProcessing, processingProgress, error: pdfError } = usePdfPages(pdfUrl);
  const { currentPage, pageFlipInitialized, nextPage, prevPage, goToPage } = usePageFlip(
    pages,
    bookRef
  );

  const isLoading = bookLoading || (!!pdfUrl && pages.length === 0 && !pdfError);
  const error = bookError ?? pdfError;

  if (isLoading) {
    return (
      <LoadingScreen
        title={bookData?.title}
        pdfProcessing={pdfProcessing}
        processingProgress={processingProgress}
      />
    );
  }

  if (error) return <ErrorScreen message={error} />;

  const dims = calculateDimensions();

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      {bookData && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
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

      {/* Book display */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20"
            aria-label="Previous page"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === pages.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white rounded-full p-3 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-20"
            aria-label="Next page"
          >
            <ChevronRight size={28} />
          </button>

          <div
            ref={bookRef}
            className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: dims.containerWidth,
              height: dims.containerHeight,
              minWidth: '400px',
              minHeight: '300px',
            }}
          >
            {pages.length > 0 && !pageFlipInitialized && (
              <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                <div className="text-center px-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Initializing book viewer...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page navigation dots */}
      {pages.length > 1 && (
        <div className="flex justify-center pb-6 flex-shrink-0">
          <div className="flex gap-2 max-w-md overflow-x-auto">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage ? 'bg-accent w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
        Click page corners, use arrows, or swipe to turn pages
      </div>
    </div>
  );
};

export default BookViewer;
