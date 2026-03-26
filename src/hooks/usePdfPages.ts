import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export interface PDFDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// Configure PDF.js worker once at module load
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    (window as Window & { pdfWorkerFallbacks?: string[] }).pdfWorkerFallbacks = [
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`,
      `https://mozilla.github.io/pdf.js/build/pdf.worker.min.mjs`,
      '',
    ];
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  }
}

const tryAlternativeWorker = (): boolean => {
  const fallbacks =
    (window as Window & { pdfWorkerFallbacks?: string[] }).pdfWorkerFallbacks ?? [];
  if (fallbacks.length === 0) return false;
  pdfjsLib.GlobalWorkerOptions.workerSrc = fallbacks[0];
  (window as Window & { pdfWorkerFallbacks?: string[] }).pdfWorkerFallbacks = fallbacks.slice(1);
  return true;
};

const isWorkerError = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  return (
    err.message.includes('worker') ||
    err.message.includes('fetch') ||
    err.message.includes('dynamically imported module') ||
    err.message.includes('Setting up fake worker failed')
  );
};

const friendlyErrorMessage = (err: unknown): string => {
  if (!(err instanceof Error)) return 'Failed to process PDF';
  if (err.name === 'AbortError') return 'PDF loading was cancelled';
  if (err.message.includes('InvalidPDFException')) return 'The file is not a valid PDF document.';
  if (err.message.includes('MissingPDFException'))
    return 'PDF file not found or cannot be accessed.';
  if (err.message.includes('UnexpectedResponseException'))
    return 'Network error while loading PDF. Please check your connection.';
  if (err.message.includes('timeout') || err.message.includes('Loading'))
    return 'PDF loading timed out. The file might be too large.';
  return `PDF processing error: ${err.message}`;
};

const renderPageToDataUrl = async (
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNum: number
): Promise<string> => {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    page.cleanup();
    throw new Error('Could not get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
  page.cleanup();
  return canvas.toDataURL('image/jpeg', 0.85);
};

const makeErrorPlaceholder = (pageNum: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#374151';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Page ${pageNum}`, canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('Failed to load', canvas.width / 2, canvas.height / 2 + 20);
  }
  return canvas.toDataURL('image/jpeg', 0.85);
};

export const usePdfPages = (pdfUrl: string | null) => {
  const [pages, setPages] = useState<string[]>([]);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [pdfDimensions, setPdfDimensions] = useState<PDFDimensions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;
    setPages([]);
    setError(null);
    setPdfProcessing(true);
    setProcessingProgress(0);

    const convert = async () => {
      let retryAttempt = 0;
      const maxRetries = 3;

      while (retryAttempt <= maxRetries) {
        try {
          abortControllerRef.current = new AbortController();

          const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
            cMapPacked: true,
            disableStream: true,
            disableFontFace: false,
            maxImageSize: 1024 * 1024 * 2,
          });

          const timeoutId = setTimeout(() => {
            loadingTask.destroy();
            abortControllerRef.current?.abort();
          }, 15000);

          let pdf: pdfjsLib.PDFDocumentProxy;
          try {
            pdf = await loadingTask.promise;
            clearTimeout(timeoutId);
          } catch (loadError) {
            clearTimeout(timeoutId);
            throw loadError;
          }

          if (cancelled) { pdf.destroy(); return; }

          const totalPages = pdf.numPages;
          const pageImages: string[] = [];

          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            if (cancelled) { pdf.destroy(); return; }

            // Capture dimensions from first page
            if (pageNum === 1) {
              const firstPage = await pdf.getPage(1);
              const vp = firstPage.getViewport({ scale: 1.0 });
              if (!cancelled) {
                setPdfDimensions({
                  width: vp.width,
                  height: vp.height,
                  aspectRatio: vp.width / vp.height,
                });
              }
              firstPage.cleanup();
            }

            try {
              pageImages.push(await renderPageToDataUrl(pdf, pageNum));
            } catch {
              pageImages.push(makeErrorPlaceholder(pageNum));
            }

            if (!cancelled) {
              setProcessingProgress(Math.round((pageNum / totalPages) * 100));
            }
          }

          pdf.destroy();
          if (!cancelled) setPages(pageImages);
          return;

        } catch (err) {
          if (cancelled) return;

          if (retryAttempt < maxRetries && isWorkerError(err)) {
            tryAlternativeWorker();
            retryAttempt++;
            continue;
          }

          if (!cancelled) setError(friendlyErrorMessage(err));
          return;
        }
      }

      if (!cancelled) setError('Failed to process PDF after multiple attempts');
    };

    convert().finally(() => {
      if (!cancelled) {
        setPdfProcessing(false);
        setProcessingProgress(0);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return { pages, pdfProcessing, processingProgress, pdfDimensions, error };
};
