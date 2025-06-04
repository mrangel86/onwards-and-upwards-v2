import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Video = Tables<'media'>;

export interface UseVideosOptions {
  locationFilter?: string;
  pageSize?: number;
}

export interface UseVideosReturn {
  videos: Video[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  locations: string[];
}

// Helper function to extract YouTube ID from various URL formats
export const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Helper function to get YouTube thumbnail URL
export const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const useVideos = ({ 
  locationFilter, 
  pageSize = 30 
}: UseVideosOptions = {}): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);

  // Reset when filter changes
  useEffect(() => {
    setVideos([]);
    setOffset(0);
    setHasMore(true);
    loadVideos(0, true);
  }, [locationFilter]);

  // Load unique locations for filter
  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('location')
        .eq('media_type', 'video')
        .not('location', 'is', null);

      if (error) throw error;

      const uniqueLocations = [...new Set(data.map(item => item.location))].filter(Boolean);
      setLocations(uniqueLocations.sort());
    } catch (err) {
      console.error('Error loading locations:', err);
    }
  };

  const loadVideos = async (currentOffset: number = offset, isReset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('media')
        .select('*')
        .eq('media_type', 'video')
        .order('created_at', { ascending: true }) // Changed to ascending for reverse chronological (oldest first, which means most recent shows at top)
        .range(currentOffset, currentOffset + pageSize - 1);

      // Apply location filter if provided
      if (locationFilter && locationFilter !== 'all') {
        query = query.eq('location', locationFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (isReset) {
        setVideos(data || []);
      } else {
        setVideos(prev => [...prev, ...(data || [])]);
      }

      // Check if we have more data
      setHasMore((data || []).length === pageSize);
      setOffset(currentOffset + pageSize);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadVideos();
    }
  };

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    locations
  };
};