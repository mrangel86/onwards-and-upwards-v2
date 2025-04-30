
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIdx: number;
  titles?: string[];
  descs?: string[];
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  open,
  onClose,
  images,
  initialIdx,
  titles,
  descs,
}) => {
  const [idx, setIdx] = useState(initialIdx);

  useEffect(() => {
    if (open) setIdx(initialIdx);
  }, [open, initialIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-2 animate-fade-in" onClick={onClose}>
      <div className="relative max-w-5xl w-full rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <img 
          src={images[idx]} 
          alt={titles?.[idx] || ""} 
          className="w-full max-h-[80vh] object-contain mx-auto"
        />
        
        {titles?.[idx] && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4 text-white">
            <h3 className="font-playfair font-semibold text-lg">{titles?.[idx]}</h3>
            {descs?.[idx] && <p className="text-white/80 text-sm">{descs?.[idx]}</p>}
          </div>
        )}

        {/* Navigation arrows - semi-transparent and vertically centered */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setIdx((i) => (i - 1 + images.length) % images.length);
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setIdx((i) => (i + 1) % images.length);
              }}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
