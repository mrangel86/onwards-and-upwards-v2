
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryFilterBar from "@/components/GalleryFilterBar";
import VideoList from "@/components/VideoList";

const videos = [
  // Newest to oldest
  {
    title: "Chasing Sunsets",
    description: "Following golden hours from mountaintop to valley—a family tradition in the making.",
    youtubeId: "a3ICNMQW7Ok",
    thumb: "https://img.youtube.com/vi/a3ICNMQW7Ok/hqdefault.jpg",
  },
  {
    title: "Market Day",
    description: "Strolling local markets for produce, laughter, and candid moments.",
    youtubeId: "L1Zb0BLCR5U",
    thumb: "https://img.youtube.com/vi/L1Zb0BLCR5U/hqdefault.jpg",
  },
  {
    title: "Trailblazers",
    description: "Tracing old footpaths and discovering new stories together.",
    youtubeId: "ItWvZu3Kww0",
    thumb: "https://img.youtube.com/vi/ItWvZu3Kww0/hqdefault.jpg",
  },
  {
    title: "Winter Wander",
    description: "From snowy rooftops to cozy cafes—capturing wonder in the chill.",
    youtubeId: "4BSn0jI5ZHY",
    thumb: "https://img.youtube.com/vi/4BSn0jI5ZHY/hqdefault.jpg",
  },
];

const VideoGallery = () => {
  // Video lightbox state
  const [modalIdx, setModalIdx] = useState<number | null>(null);

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-12 pt-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">Video Gallery</h1>
          <p className="mb-6 text-gray-700 md:text-lg max-w-2xl">A glimpse into our journey through motion—family moments, behind-the-scenes, and scenic stories.</p>
        </header>

        {/* Filter Bar */}
        <GalleryFilterBar filters={[{ label: "Filter by location" }]} />

        {/* Video List */}
        <VideoList
          videos={videos}
          onOpenLightbox={setModalIdx}
          modalIdx={modalIdx}
          onCloseLightbox={() => setModalIdx(null)}
        />
      </main>
      <Footer />
    </div>
  );
};

export default VideoGallery;
