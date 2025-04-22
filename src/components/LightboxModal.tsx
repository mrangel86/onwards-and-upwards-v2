
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
      <div className="relative max-w-lg w-full rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt={titles?.[idx] || ""} className="w-full max-h-[70vh] object-contain rounded-t-xl" />
        <div className="bg-white px-6 py-4 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-playfair font-semibold text-lg">{titles?.[idx]}</h3>
              <p className="text-gray-600 text-sm">{descs?.[idx]}</p>
            </div>
            <button className="text-sm text-accent hover:text-primary font-semibold" onClick={onClose}>Close</button>
          </div>
          <div className="flex justify-between mt-3">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-accent hover:text-white"
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous"
            >
              <ChevronLeft />
            </button>
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-accent hover:text-white"
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              aria-label="Next"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
