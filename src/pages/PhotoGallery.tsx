
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import GalleryFilterBar from "@/components/GalleryFilterBar";
import PhotoGrid from "@/components/PhotoGrid";

const photos = [
  // newest first
  {
    title: "Lake Sunrise",
    subtitle: "Waking up by the water's edge",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Forest Path",
    subtitle: "Quiet walks through green canopies",
    src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Mountain View",
    subtitle: "Endless vistas, endless wonder",
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Old Bridge",
    subtitle: "Where journeys cross paths",
    src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Golden Light",
    subtitle: "Evenings in new places",
    src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Family Hike",
    subtitle: "Steps together, memories forever",
    src: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=700&q=80",
  },
];

const PhotoGallery = () => {
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const handleOpenLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-12 pt-6 max-w-6xl md:max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">Photo Gallery</h1>
          <p className="mb-6 text-gray-700 md:text-lg max-w-2xl">A curated collection of moments from our travels—captured across landscapes, cities, and family memories.</p>
        </header>

        {/* Filter Bar */}
        <GalleryFilterBar filters={[{ label: "Filter by location" }]} />

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          onPhotoClick={handleOpenLightbox}
        />

        {/* Lightbox Modal */}
        <LightboxModal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={photos.map((p) => p.src)}
          initialIdx={lightboxIdx}
          titles={photos.map((p) => p.title)}
          descs={photos.map((p) => p.subtitle)}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PhotoGallery;
