/**
 * Optimizes Supabase Storage image URLs by adding transformation parameters
 * This reduces file size and improves loading performance
 */

interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'origin' | 'webp';
}

export const optimizeSupabaseImage = (
  url: string,
  options: ImageTransformOptions = {}
): string => {
  // Only optimize Supabase storage URLs
  if (!url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }

  const params = new URLSearchParams();
  
  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

// Preset sizes for common use cases
export const ImagePresets = {
  thumbnail: { width: 400, quality: 75 },
  gallery: { width: 800, quality: 80 },
  featured: { width: 1200, quality: 85 },
  hero: { width: 1920, quality: 85 },
  full: {} // No transformation
};
