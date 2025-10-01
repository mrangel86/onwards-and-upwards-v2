import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { type Photo } from '@/hooks/usePhotos';
import { optimizeSupabaseImage, ImagePresets } from '@/lib/imageOptimization';

interface InfiniteScrollPhotosProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const InfiniteScrollPhotos: React.FC<InfiniteScrollPhotosProps> = ({
  photos,
  onPhotoClick,
  hasMore,
  loading,
  onLoadMore
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className="space-y-8">
      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
            onClick={() => onPhotoClick(index)}
          >
            <img
              src={optimizeSupabaseImage(photo.url, ImagePresets.gallery)}
              alt={photo.title || photo.caption || 'Photo'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {photo.title && (
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {photo.title}
                  </h3>
                )}
                {photo.caption && (
                  <p className="text-sm text-white/90 line-clamp-2">
                    {photo.caption}
                  </p>
                )}
                {photo.location && (
                  <p className="text-xs text-white/80 mt-1 italic">
                    {photo.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div ref={observerRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more photos...</span>
          </div>
        )}
        {!hasMore && photos.length > 0 && (
          <p className="text-gray-500 text-center">
            You've reached the end! {photos.length} photos total.
          </p>
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollPhotos;