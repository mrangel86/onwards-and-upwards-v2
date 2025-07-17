
import React from "react";
import { Play } from "lucide-react";

interface VideoBlock {
  title: string;
  description: string;
  youtubeId: string;
  thumb: string;
}

interface VideoListProps {
  videos: VideoBlock[];
  onOpenLightbox: (idx: number) => void;
  modalIdx: number | null;
  onCloseLightbox: () => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  onOpenLightbox,
  modalIdx,
  onCloseLightbox,
}) => (
  <div className="flex flex-col gap-7">
    {videos.map((video, idx) => (
      <div
        key={video.youtubeId}
        className="flex flex-col md:flex-row items-center gap-5 md:gap-10 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Thumbnail - left */}
        <button
          className="group relative w-full max-w-md aspect-video flex-shrink-0 bg-gray-100 overflow-hidden transition"
          onClick={() => onOpenLightbox(idx)}
          type="button"
          aria-label={`Play ${video.title}`}
        >
          <img
            src={video.thumb}
            alt={video.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 group-active:bg-black/60 transition">
            <div className="bg-white/90 rounded-full p-4 shadow-md">
              <Play size={36} color="#C5D4F9" />
            </div>
          </div>
        </button>
        {/* Right Side - Text */}
        <div className="flex-1 w-full px-4 py-4 md:px-0 md:py-0 text-left">
          <h3 className="font-playfair text-xl font-bold text-primary mb-1">{video.title}</h3>
          <p className="text-gray-700 text-base">{video.description}</p>
        </div>
        {/* Video modal lightbox */}
        {modalIdx === idx && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-2 animate-fade-in"
            onClick={onCloseLightbox}
            aria-modal="true"
            role="dialog"
          >
            <div
              className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                title={video.title}
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                className="w-full aspect-video rounded-t-xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                className="absolute top-2 right-2 text-sm text-accent hover:text-primary font-bold bg-white/80 rounded-full px-3 py-1"
                onClick={onCloseLightbox}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default VideoList;
