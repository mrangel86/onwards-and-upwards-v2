
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
};

const PostImageGallery: React.FC<PostImageGalleryProps> = ({ postId }) => {
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['postMedia', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('id, url, title, caption, sort_order, created_at')
        .eq('post_id', postId)
        .order('sort_order', { ascending: true, nullsLast: true })
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching media items:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  if (isLoading) {
    return <div className="py-8 text-center">Loading gallery...</div>;
  }

  if (!mediaItems || mediaItems.length === 0) {
    return <div className="py-8 text-center">No images found for this post.</div>;
  }

  return (
    <div className="py-6">
      <div className="flex flex-wrap justify-center">
        {mediaItems.map((item: MediaItem) => (
          <figure key={item.id} style={{ width: '30%', margin: '12px' }}>
            <img
              src={item.url}
              alt={item.title}
              style={{ width: '100%', objectFit: 'cover' }}
              className="rounded-lg shadow-md"
            />
            <figcaption className="mt-2 text-center">
              <strong className="text-primary">{item.title}</strong><br />
              <span className="text-gray-600">{item.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default PostImageGallery;
