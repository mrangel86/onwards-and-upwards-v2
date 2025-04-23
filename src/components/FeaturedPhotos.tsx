import React, { useState } from "react";
import LightboxModal from "./LightboxModal";

const photoData = [
  {
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    title: "Foggy Summit",
    desc: "A quiet morning above the clouds.",
  },
  {
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
    title: "Sunlit Forest",
    desc: "Sunbeams painting the woods.",
  },
  {
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    title: "Mountain View",
    desc: "Endless green and winding trails.",
  },
  {
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80",
    title: "Rocky Ascent",
    desc: "Bold steps, wild terrain.",
  },
  {
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
    title: "Deer Standstill",
    desc: "Unexpected wildlife encounters.",
  },
  {
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600&q=80",
    title: "Sea Dance",
    desc: "Waves leaping under a golden sky.",
  },
];

const FeaturedPhotos = () => {
  const [open, setOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  const openLightbox = (idx: number) => {
    setPhotoIdx(idx);
    setOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-primary animate-slide-in">
        Featured <span className="text-accent">// Photos</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-7">
        {photoData.map((photo, i) => (
          <div
            key={i}
            className="group relative cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-xl transition"
            onClick={() => openLightbox(i)}
            tabIndex={0}
            aria-label={`Open photo: ${photo.title}`}
          >
            <img
              src={photo.image}
              alt={photo.title}
              className="w-full h-56 object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <div className="text-center px-4">
                <h3 className="text-white font-semibold text-lg mb-1">{photo.title}</h3>
                <p className="text-white/80 text-sm">{photo.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <LightboxModal
        open={open}
        onClose={() => setOpen(false)}
        images={photoData.map((p) => p.image)}
        initialIdx={photoIdx}
        titles={photoData.map((p) => p.title)}
        descs={photoData.map((p) => p.desc)}
      />
    </section>
  );
};

export default FeaturedPhotos;
