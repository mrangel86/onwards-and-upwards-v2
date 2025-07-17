import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import { type Video, getYouTubeId, getYouTubeThumbnail } from '@/hooks/useVideos';

interface InfiniteScrollVideosProps {
  videos: Video[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const InfiniteScrollVideos: React.FC<InfiniteScrollVideosProps> = ({
  videos,
  hasMore,
  loading,
  onLoadMore
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [modalIdx, setModalIdx] = useState<number | null>(null);

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

  const handleOpenLightbox = (idx: number) => {
    setModalIdx(idx);
  };

  const handleCloseLightbox = () => {
    setModalIdx(null);
  };

  return (
    <div className="space-y-8">
      {/* Video List */}
      <div className="flex flex-col gap-7">
        {videos.map((video, idx) => {
          const youtubeId = getYouTubeId(video.url);
          const thumbnail = youtubeId ? getYouTubeThumbnail(youtubeId) : null;

          return (
            <div
              key={video.id}
              className="flex flex-col md:flex-row items-center gap-5 md:gap-10 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Thumbnail - left */}
              <button
                className="group relative w-full max-w-md aspect-video flex-shrink-0 bg-gray-100 overflow-hidden transition"
                onClick={() => handleOpenLightbox(idx)}
                type="button"
                aria-label={`Play ${video.title}`}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={video.title || 'Video thumbnail'}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Play size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 group-active:bg-black/60 transition">
                  <div className="bg-white/90 rounded-full p-4 shadow-md">
                    <Play size={36} color="#C5D4F9" />
                  </div>
                </div>
              </button>

              {/* Right Side - Text */}
              <div className="flex-1 w-full px-4 py-4 md:px-0 md:py-0 text-left">
                <h3 className="font-playfair text-xl font-bold text-primary mb-1">
                  {video.title || 'Untitled Video'}
                </h3>
                <p className="text-gray-700 text-base mb-2">
                  {video.caption || 'No description available.'}
                </p>
                {video.location && (
                  <p className="text-sm text-gray-500">
                    📍 {video.location}
                  </p>
                )}
              </div>

              {/* Video modal lightbox */}
              {modalIdx === idx && youtubeId && (
                <div
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-2 animate-fade-in"
                  onClick={handleCloseLightbox}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <iframe
                      title={video.title || 'Video'}
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                      className="w-full aspect-video rounded-t-xl"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                    <button
                      className="absolute top-2 right-2 text-sm text-accent hover:text-primary font-bold bg-white/80 rounded-full px-3 py-1"
                      onClick={handleCloseLightbox}
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loading indicator and intersection observer target */}
      <div ref={observerRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more videos...</span>
          </div>
        )}
        {!hasMore && videos.length > 0 && (
          <p className="text-gray-500 text-center">
            You've reached the end! {videos.length} videos total.
          </p>
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollVideos;