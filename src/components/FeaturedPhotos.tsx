
import React, { useState, useEffect } from "react";
import LightboxModal from "./LightboxModal";
import { supabase } from "@/integrations/supabase/client";

type FeaturedPhoto = {
  media_url: string;
  title: string | null;
  caption: string | null;
};

const FeaturedPhotos = () => {
  const [open, setOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [featuredPhotos, setFeaturedPhotos] = useState<FeaturedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('featured_media')
          .select('media_url, title, caption')
          .eq('media_type', 'photo')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(6);

        if (error) {
          console.error('Error fetching featured photos:', error);
          return;
        }

        if (data && data.length > 0) {
          setFeaturedPhotos(data);
        } else {
          // Fallback photos if none are found
          setFeaturedPhotos([
            {
              media_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
              title: "Foggy Summit",
              caption: "A quiet morning above the clouds."
            },
            {
              media_url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
              title: "Sunlit Forest",
              caption: "Sunbeams painting the woods."
            },
            {
              media_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
              title: "Mountain View",
              caption: "Endless green and winding trails."
            },
            {
              media_url: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80",
              title: "Rocky Ascent",
              caption: "Bold steps, wild terrain."
            },
            {
              media_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
              title: "Deer Standstill",
              caption: "Unexpected wildlife encounters."
            },
            {
              media_url: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600&q=80",
              title: "Sea Dance",
              caption: "Waves leaping under a golden sky."
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching featured photos:', err);
        setLoading(false);
      }
    };

    fetchFeaturedPhotos();
  }, []);

  const openLightbox = (idx: number) => {
    setPhotoIdx(idx);
    setOpen(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-primary animate-slide-in">
        Featured <span className="text-accent">// Photos</span>
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading featured photos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-7">
          {featuredPhotos.map((photo, i) => (
            <div
              key={i}
              className="group relative cursor-pointer rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              onClick={() => openLightbox(i)}
              tabIndex={0}
              aria-label={`Open photo: ${photo.title || 'Featured photo'}`}
            >
              <img
                src={photo.media_url}
                alt={photo.title || 'Featured photo'}
                className="w-full h-56 object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="text-center px-4">
                  <h3 className="text-white font-semibold text-lg mb-1">{photo.title || 'Featured photo'}</h3>
                  <p className="text-white/80 text-sm">{photo.caption || ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LightboxModal
        open={open}
        onClose={() => setOpen(false)}
        images={featuredPhotos.map((p) => p.media_url)}
        initialIdx={photoIdx}
        titles={featuredPhotos.map((p) => p.title || '')}
        descs={featuredPhotos.map((p) => p.caption || '')}
      />
    </section>
  );
};

export default FeaturedPhotos;
