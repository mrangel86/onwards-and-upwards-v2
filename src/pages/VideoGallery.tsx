import React, { useState } from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import Footer from "@/components/Footer";
import GalleryFilterBar from "@/components/GalleryFilterBar";
import InfiniteScrollVideos from "@/components/InfiniteScrollVideos";
import { useVideos } from "@/hooks/useVideos";
import { AlertCircle } from "lucide-react";

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

  const navbarData = {
    logo: {
      url: "/",
      src: "/placeholder.svg",
      alt: "Onwards & Upwards",
      title: "ONWARDS & UPWARDS",
    },
    menu: [
      { title: "Home", url: "/" },
      {
        title: "Gallery",
        url: "#",
        items: [
          {
            title: "Photography",
            description: "Glimpses of life, frame by frame",
            url: "/gallery/photos",
          },
          {
            title: "Videography", 
            description: "Little films from the road",
            url: "/gallery/videos",
          },
        ],
      },
      { title: "Blog", url: "/blog" },
      { title: "About Us", url: "/about" },
    ],
    auth: {
      login: { text: "Newsletter", url: "/newsletter" },
      signup: { text: "", url: "#" },
    },
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
      <main className="flex-1 px-4 pb-12 pt-6 max-w-5xl md:max-w-6xl mx-auto w-full">
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

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load videos: {error}</span>
          </div>
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
        {!loading && videos.length === 0 && !error && (
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