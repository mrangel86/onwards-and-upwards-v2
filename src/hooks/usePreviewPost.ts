import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const usePreviewPost = (slug: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      let actualSlug = slug;

      // Fall back to parsing the URL if the router slug param isn't populated
      if (!slug || slug === ':slug' || slug === 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const previewIndex = pathParts.indexOf('preview-posts');
        if (previewIndex !== -1 && pathParts[previewIndex + 1]) {
          actualSlug = pathParts[previewIndex + 1];
        }
      }

      if (!actualSlug || actualSlug === ':slug') {
        setError('No valid slug provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error: queryError } = await supabase
          .from('preview_posts')
          .select('*')
          .eq('slug', actualSlug)
          .single();

        if (!queryError && data) {
          setPost(data);
          return;
        }

        // Fallback: try case-insensitive match
        const { data: allPreviews } = await supabase
          .from('preview_posts')
          .select('slug, title, id')
          .limit(20);

        const match = allPreviews?.find(
          p => p.slug.toLowerCase() === actualSlug!.toLowerCase()
        );

        if (match) {
          const { data: matchedData, error: matchedError } = await supabase
            .from('preview_posts')
            .select('*')
            .eq('slug', match.slug)
            .single();

          if (matchedData && !matchedError) {
            setPost(matchedData);
          } else {
            setError(`No preview found for: ${actualSlug}`);
          }
        } else {
          setError(`No preview found for: ${actualSlug}`);
        }
      } catch (err: any) {
        setError(`Error: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [slug]);

  return { loading, post, error };
};
