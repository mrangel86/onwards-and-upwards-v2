import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Photo = Tables<'media'>;

export interface UsePhotosOptions {
  locationFilter?: string;
  pageSize?: number;
}

export interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  locations: string[];
}

export const usePhotos = ({ 
  locationFilter, 
  pageSize = 30 
}: UsePhotosOptions = {}): UsePhotosReturn => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [locations, setLocations] = useState<string[]>([]);

  // Reset when filter changes
  useEffect(() => {
    setPhotos([]);
    setOffset(0);
    setHasMore(true);
    loadPhotos(0, true);
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
        .eq('media_type', 'photo')
        .not('location', 'is', null);

      if (error) throw error;

      const uniqueLocations = [...new Set(data.map(item => item.location))].filter(Boolean);
      setLocations(uniqueLocations.sort());
    } catch (err) {
      console.error('Error loading locations:', err);
    }
  };

  const loadPhotos = async (currentOffset: number = offset, isReset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('media')
        .select('*')
        .eq('media_type', 'photo')
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + pageSize - 1);

      // Apply location filter if provided
      if (locationFilter && locationFilter !== 'all') {
        query = query.eq('location', locationFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (isReset) {
        setPhotos(data || []);
      } else {
        setPhotos(prev => [...prev, ...(data || [])]);
      }

      // Check if we have more data
      setHasMore((data || []).length === pageSize);
      setOffset(currentOffset + pageSize);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPhotos();
    }
  };

  return {
    photos,
    loading,
    error,
    hasMore,
    loadMore,
    locations
  };
};