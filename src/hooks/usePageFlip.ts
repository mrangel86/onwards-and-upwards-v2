import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { PageFlip } from 'page-flip';

const calculateDimensions = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight * 0.85;
  const maxWidth = Math.min(viewportWidth * 0.6, 700);
  const containerHeight = maxWidth * 0.75;

  let finalWidth = maxWidth;
  let finalHeight = containerHeight;

  if (containerHeight > viewportHeight) {
    finalHeight = viewportHeight;
    finalWidth = finalHeight * 0.75;
  }

  return {
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
    containerWidth: `${Math.round(finalWidth)}px`,
    containerHeight: `${Math.round(finalHeight)}px`,
  };
};

export { calculateDimensions };

export const usePageFlip = (pages: string[], bookRef: RefObject<HTMLDivElement>) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageFlipInitialized, setPageFlipInitialized] = useState(false);
  const pageFlipRef = useRef<PageFlip | null>(null);

  // Reset when pages change
  useEffect(() => {
    setPageFlipInitialized(false);
    setCurrentPage(0);
    if (pageFlipRef.current) {
      pageFlipRef.current.destroy();
      pageFlipRef.current = null;
    }
  }, [pages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
      }
    };
  }, []);

  const initializePageFlip = useCallback(() => {
    if (!bookRef.current || !pages.length || pageFlipRef.current) return;

    try {
      const dims = calculateDimensions();

      const pageFlip = new PageFlip(bookRef.current, {
        width: dims.width,
        height: dims.height,
        size: 'fixed',
        minWidth: Math.min(400, dims.width),
        maxWidth: Math.max(700, dims.width),
        minHeight: Math.min(300, dims.height),
        maxHeight: Math.max(600, dims.height),
        drawShadow: true,
        flippingTime: 800,
        usePortrait: true,
        startZIndex: 0,
        autoSize: false,
        maxShadowOpacity: 0.4,
        showCover: false,
        mobileScrollSupport: true,
        swipeDistance: 30,
        clickEventForward: true,
        useMouseEvents: true,
        startPage: 0,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      const pageElements: HTMLElement[] = pages.map((pageImage, index) => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';
        pageDiv.setAttribute('data-density', 'hard');
        pageDiv.style.cssText =
          'background-color:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;width:100%;height:100%;position:relative;';

        const img = document.createElement('img');
        img.src = pageImage;
        img.alt = `Page ${index + 1}`;
        img.style.cssText =
          'max-width:100%;max-height:100%;object-fit:contain;display:block;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';

        pageDiv.appendChild(img);
        return pageDiv;
      });

      pageFlip.loadFromHTML(pageElements);
      pageFlip.on('flip', (e) => setCurrentPage(e.data));
      pageFlip.on('init', () => setPageFlipInitialized(true));

      pageFlipRef.current = pageFlip;
    } catch (error) {
      console.error('Failed to initialize StPageFlip:', error);
    }
  }, [pages, bookRef]);

  // Initialize after pages load (small delay for DOM readiness)
  useEffect(() => {
    if (!pages.length) return;
    const timer = setTimeout(initializePageFlip, 100);
    return () => clearTimeout(timer);
  }, [pages, initializePageFlip]);

  const nextPage = useCallback(() => pageFlipRef.current?.flipNext(), []);
  const prevPage = useCallback(() => pageFlipRef.current?.flipPrev(), []);
  const goToPage = useCallback(
    (index: number) => {
      if (index >= 0 && index < pages.length) {
        pageFlipRef.current?.turnToPage(index);
      }
    },
    [pages.length]
  );

  return { currentPage, pageFlipInitialized, nextPage, prevPage, goToPage };
};
