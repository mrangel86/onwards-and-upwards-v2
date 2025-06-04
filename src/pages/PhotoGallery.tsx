import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import GalleryFilterBar from "@/components/GalleryFilterBar";
import InfiniteScrollPhotos from "@/components/InfiniteScrollPhotos";
import { usePhotos } from "@/hooks/usePhotos";
import { AlertCircle } from "lucide-react";

const PhotoGallery = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const { 
    photos, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    locations 
  } = usePhotos({ 
    locationFilter: selectedLocation === 'all' ? undefined : selectedLocation,
    pageSize: 30 
  });

  const handleOpenLightbox = (idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  // Prepare filter options
  const filterOptions = locations.map(location => ({
    label: location,
    value: location
  }));

  const filters = [{
    label: "Filter by location",
    options: filterOptions
  }];

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 pb-12 pt-6 max-w-6xl md:max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">
            Photo Gallery
          </h1>
          <p className="mb-6 text-gray-700 md:text-lg max-w-2xl">
            A curated collection of moments from our travels—captured across landscapes, cities, and family memories.
          </p>
        </header>

        {/* Filter Bar */}
        {filterOptions.length > 0 && (
          <GalleryFilterBar
            filters={filters}
            selectedFilter={selectedLocation}
            onFilterChange={handleLocationChange}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load photos: {error}</span>
          </div>
        )}

        {/* Loading State for Initial Load */}
        {loading && photos.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Photos Grid with Infinite Scroll */}
        {photos.length > 0 && (
          <InfiniteScrollPhotos
            photos={photos}
            onPhotoClick={handleOpenLightbox}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedLocation === 'all' 
                ? "No photos found in the gallery." 
                : `No photos found for ${selectedLocation}.`
              }
            </p>
          </div>
        )}

        {/* Lightbox Modal */}
        <LightboxModal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={photos.map((p) => p.url)}
          initialIdx={lightboxIdx}
          titles={photos.map((p) => p.title || '')}
          descs={photos.map((p) => p.caption || '')}
        />
      </main>
      <Footer />
    </div>
  );
};

export default PhotoGallery;