
// Sync test
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LightboxModal from "./LightboxModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FeaturedPhoto = {
  media_url: string;
  title: string | null;
  caption: string | null;
  linked_post_id: string | null;
};

const FeaturedPhotos = () => {
  const [open, setOpen] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [featuredPhotos, setFeaturedPhotos] = useState<FeaturedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('featured_media')
          .select('media_url, title, caption, linked_post_id')
          .eq('media_type', 'photo')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(6);

        if (error) {
          console.error('Error fetching featured photos:', error);
          toast.error("Failed to load featured photos");
          return;
        }

        if (data && data.length > 0) {
          console.log('Fetched featured photos:', data);
          setFeaturedPhotos(data);
        } else {
          console.log('No featured photos found, using fallbacks');
          // Fallback photos if none are found
          setFeaturedPhotos([
            {
              media_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
              title: "Foggy Summit",
              caption: "A quiet morning above the clouds.",
              linked_post_id: null
            },
            {
              media_url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=80",
              title: "Sunlit Forest",
              caption: "Sunbeams painting the woods.",
              linked_post_id: null
            },
            {
              media_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
              title: "Mountain View",
              caption: "Endless green and winding trails.",
              linked_post_id: null
            },
            {
              media_url: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=80",
              title: "Rocky Ascent",
              caption: "Bold steps, wild terrain.",
              linked_post_id: null
            },
            {
              media_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
              title: "Deer Standstill",
              caption: "Unexpected wildlife encounters.",
              linked_post_id: null
            },
            {
              media_url: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?w=600&q=80",
              title: "Sea Dance",
              caption: "Waves leaping under a golden sky.",
              linked_post_id: null
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching featured photos:', err);
        toast.error("Failed to load featured photos");
        setLoading(false);
      }
    };

    fetchFeaturedPhotos();
  }, []);

  const openLightbox = (idx: number) => {
    setPhotoIdx(idx);
    setOpen(true);
  };

  // Handle image load errors
  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}:`, featuredPhotos[index]?.media_url);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    
    // Update the media_url for the errored image to use a fallback
    setFeaturedPhotos(photos => 
      photos.map((photo, i) => 
        i === index ? 
          { 
            ...photo, 
            media_url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600&q=80",
            title: photo.title ? `${photo.title} (Fallback Image)` : "Featured photo (Fallback)",
          } : photo
      )
    );
  };

  // Navigate to photo gallery and scroll to top
  const handleSeeMoreClick = () => {
    navigate('/gallery/photos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-primary animate-slide-in">
        Featured <span className="text-accent">// Photos</span>
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading featured photos...</p>
        </div>
      ) : (
        <>
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
                  onError={() => handleImageError(i)}
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

          <div className="mt-10 text-center">
            <button 
              onClick={handleSeeMoreClick}
              className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3 rounded-full shadow transition"
            >
              See More
            </button>
          </div>
        </>
      )}

      <LightboxModal
        open={open}
        onClose={() => setOpen(false)}
        images={featuredPhotos.map((p) => p.media_url)}
        initialIdx={photoIdx}
        titles={featuredPhotos.map((p) => p.title || '')}
        descs={featuredPhotos.map((p) => p.caption || '')}
        postIds={featuredPhotos.map((p) => p.linked_post_id)}
      />
    </section>
  );
};

export default FeaturedPhotos;
