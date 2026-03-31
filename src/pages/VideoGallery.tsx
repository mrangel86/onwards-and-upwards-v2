import React, { useState, useEffect } from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import { navbarData } from "@/lib/navbarData";
import Footer from "@/components/Footer";
import GalleryFilterBar from "@/components/GalleryFilterBar";
import InfiniteScrollVideos from "@/components/InfiniteScrollVideos";
import { useVideos } from "@/hooks/useVideos";
import { toast } from "sonner";

const VideoGallery = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const { 
    videos, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    locations 
  } = useVideos({ 
    locationFilter: selectedLocation === 'all' ? undefined : selectedLocation,
    pageSize: 30 
  });

  useEffect(() => {
    if (error) toast.error("Failed to load videos. Please try again.");
  }, [error]);

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
      <Navbar1 {...navbarData} />
      <main className="flex-1 px-4 pb-12 pt-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="mb-5 md:mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">
            Video Gallery
          </h1>
          <p className="mb-6 text-gray-700 md:text-lg max-w-2xl">
            A glimpse into our journey through motion—family moments, behind-the-scenes, and scenic stories.
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

        {/* Loading State for Initial Load */}
        {loading && videos.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Videos List with Infinite Scroll */}
        {videos.length > 0 && (
          <InfiniteScrollVideos
            videos={videos}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedLocation === 'all' 
                ? "No videos found in the gallery." 
                : `No videos found for ${selectedLocation}.`
              }
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VideoGallery;