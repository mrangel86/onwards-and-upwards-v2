
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LightboxModal from "./LightboxModal";
import { Separator } from "@/components/ui/separator";

type MediaItem = {
  id: string;
  url: string;
  title: string;
  caption: string;
  sort_order?: number | null;
  created_at: string;
};

type PostImageGalleryProps = {
  postId: string;
  galleryDescription?: string;
};

const PostImageGallery: React.FC<PostImageGalleryProps> = ({ postId, galleryDescription }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['postMedia', postId],
    queryFn: async () => {
      // Fix the build error by removing nullsLast which isn't supported
      const { data, error } = await supabase
        .from('media')
        .select('id, url, title, caption, sort_order, created_at')
        .eq('post_id', postId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching media items:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading gallery...</div>;
  }

  if (!mediaItems || mediaItems.length === 0) {
    return <div className="py-8 text-center">No images found for this post.</div>;
  }

  return (
    <div className="py-10">
      {/* Gallery description if available - with separators and improved spacing */}
      {galleryDescription && (
        <>
          <Separator className="max-w-3xl mx-auto my-8 bg-gray-200" />
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <div 
              className="text-muted-foreground text-lg"
              dangerouslySetInnerHTML={{ __html: galleryDescription }}
            />
          </div>
          <Separator className="max-w-3xl mx-auto my-8 bg-gray-200" />
        </>
      )}
      
      {/* Masonry-style gallery */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {mediaItems.map((item: MediaItem, index: number) => (
          <div 
            key={item.id}
            className="break-inside-avoid mb-4 relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
            {/* Hover overlay - only shows on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center px-4">
                <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reuse the LightboxModal component from homepage */}
      <LightboxModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={mediaItems.map((item) => item.url)}
        initialIdx={currentImageIndex}
        titles={mediaItems.map((item) => item.title)}
        descs={mediaItems.map((item) => item.caption)}
      />
    </div>
  );
};

export default PostImageGallery;
