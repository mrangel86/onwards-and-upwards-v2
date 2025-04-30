
import React from "react";

interface PhotoItem {
  title: string;
  subtitle: string;
  src: string;
}

const PhotoGrid: React.FC<{
  photos: PhotoItem[];
  onPhotoClick: (idx: number) => void;
}> = ({ photos, onPhotoClick }) => (
  <div
    className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in mx-auto max-w-6xl"
    aria-label="Photo Gallery"
  >
    {photos.map((photo, idx) => (
      <button
        key={photo.src}
        className="group block aspect-[4/3] w-full rounded-xl shadow bg-gray-100 overflow-hidden relative focus:outline-none"
        tabIndex={0}
        onClick={() => onPhotoClick(idx)}
        aria-label={`${photo.title}: ${photo.subtitle}`}
        type="button"
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200 cursor-pointer"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition bg-black/60">
          <div className="text-center">
            <h3 className="font-semibold text-lg text-white mb-1 drop-shadow">{photo.title}</h3>
            <div className="text-white text-sm opacity-90">{photo.subtitle}</div>
          </div>
        </div>
      </button>
    ))}
  </div>
);

export default PhotoGrid;
