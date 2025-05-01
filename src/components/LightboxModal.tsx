
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIdx?: number;
  titles?: string[];
  descs?: string[];
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  open,
  onClose,
  images,
  initialIdx = 0,
  titles = [],
  descs = [],
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (open) setCurrentIdx(initialIdx);
  }, [open, initialIdx]);

  if (!open) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev(e as unknown as React.MouseEvent);
    if (e.key === "ArrowRight") handleNext(e as unknown as React.MouseEvent);
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4 md:px-8 py-10 animate-fade-in"
      onClick={onClose}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div
        className="relative max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={images[currentIdx]}
            alt={titles[currentIdx] || `Image ${currentIdx + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Caption */}
          {(titles[currentIdx] || descs[currentIdx]) && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-center">
              {titles[currentIdx] && (
                <h3 className="text-lg font-semibold">{titles[currentIdx]}</h3>
              )}
              {descs[currentIdx] && <p className="text-sm opacity-90">{descs[currentIdx]}</p>}
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/80 bg-black/40 px-2 py-1 rounded text-sm">
            {currentIdx + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
