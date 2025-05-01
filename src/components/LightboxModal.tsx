
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LightboxModalProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  initialIdx?: number;
  titles?: string[];
  descs?: string[];
  postIds?: (string | null)[];
}

type LinkedPost = {
  title: string;
  slug: string;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  open,
  onClose,
  images,
  initialIdx = 0,
  titles = [],
  descs = [],
  postIds = [],
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [imageError, setImageError] = useState(false);
  const [linkedPost, setLinkedPost] = useState<LinkedPost | null>(null);

  // Reset to initial index when modal opens and fetch linked post if available
  useEffect(() => {
    if (open) {
      setCurrentIdx(initialIdx);
      setImageError(false);
      fetchLinkedPost(postIds[initialIdx]);
    }
  }, [open, initialIdx, postIds]);

  // Fetch linked post when current index changes
  useEffect(() => {
    if (open && postIds[currentIdx]) {
      fetchLinkedPost(postIds[currentIdx]);
    } else {
      setLinkedPost(null);
    }
  }, [currentIdx, open, postIds]);

  const fetchLinkedPost = async (postId: string | null) => {
    if (!postId) {
      setLinkedPost(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('title, slug')
        .eq('id', postId)
        .single();

      if (error || !data) {
        console.error('Error fetching linked post:', error);
        setLinkedPost(null);
        return;
      }

      setLinkedPost(data);
    } catch (err) {
      console.error('Unexpected error fetching linked post:', err);
      setLinkedPost(null);
    }
  };

  if (!open) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
    setImageError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev(e as unknown as React.MouseEvent);
    if (e.key === "ArrowRight") handleNext(e as unknown as React.MouseEvent);
    if (e.key === "Escape") onClose();
  };

  const handleImageError = () => {
    console.error(`Failed to load image in lightbox:`, images[currentIdx]);
    setImageError(true);
  };

  const fallbackImageUrl = "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80";

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
        <div className="relative w-full h-[75%] flex items-center justify-center overflow-hidden">
          <img
            src={imageError ? fallbackImageUrl : images[currentIdx]}
            alt={titles[currentIdx] || `Image ${currentIdx + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={handleImageError}
          />
        </div>
        
        {/* Caption & Post Link */}
        <div className="w-full max-w-2xl mx-auto text-center mt-4 px-4 text-white">
          {titles[currentIdx] && (
            <h3 className="text-xl font-semibold mb-2">
              {imageError ? `${titles[currentIdx]} (Fallback Image)` : titles[currentIdx]}
            </h3>
          )}
          {descs[currentIdx] && <p className="text-base opacity-90 mb-3">{descs[currentIdx]}</p>}
          
          {linkedPost && (
            <Link 
              to={`/posts/${linkedPost.slug}`} 
              className="inline-block text-accent hover:underline my-2"
            >
              See more from this trip → {linkedPost.title}
            </Link>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="text-white/80 mt-4 text-sm">
              {currentIdx + 1} / {images.length}
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
      </div>
    </div>
  );
};

export default LightboxModal;
