
import React, { useState } from "react";
import LightboxModal from "./LightboxModal";

const videoId = "a3ICNMQW7Ok"; // example video ID

const FeaturedVideo = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="max-w-6xl mx-auto px-4 py-14 lg:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      <div className="flex-1 flex justify-center">
        <div className="relative group w-80 h-44 rounded-2xl overflow-hidden shadow cursor-pointer" onClick={() => setOpen(true)}>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube Video Thumbnail"
            className="object-cover w-full h-full group-hover:scale-105 transition"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="bg-white/80 rounded-full p-4 shadow-lg animate-fade-in">
              <svg width="40" height="40" fill="#9b87f5" viewBox="0 0 24 24"><path d="M7 6v12l10-6z"></path></svg>
            </div>
          </div>
        </div>
        {/* Video Lightbox */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-2 animate-fade-in" onClick={() => setOpen(false)}>
            <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
              <iframe
                title="Travel Video"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="w-full aspect-video rounded-t-xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button className="absolute top-2 right-2 text-sm text-accent hover:text-primary font-bold bg-white/80 rounded-full px-3 py-1" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-3 animate-fade-in">Featured <span className="text-accent">// Video</span></h2>
        <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">“Chasing Sunsets: Chapter 4”</h3>
        <p className="mb-4 text-gray-600">Moments from our month crossing mountain passes, discovering hidden lakes, and meeting kindred spirits along the way.</p>
        <a href="#" className="text-accent font-semibold underline hover:text-primary transition" tabIndex={0}>See all videos</a>
      </div>
    </section>
  );
};

export default FeaturedVideo;
