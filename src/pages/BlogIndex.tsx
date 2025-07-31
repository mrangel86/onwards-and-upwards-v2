import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const PAGE_SIZE = 6;

const BlogIndex = () => {
  const [filter, setFilter] = useState('all');
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
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

  // Fetch all posts
  const { data: allPosts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Load more posts when needed
  const loadMorePosts = useCallback(() => {
    if (!allPosts || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    
    setTimeout(() => {
      const filteredPosts = filter === 'all' 
        ? allPosts 
        : allPosts.filter(post => post.type === filter);
      
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = page * PAGE_SIZE;
      const newPosts = filteredPosts.slice(startIndex, endIndex);
      
      if (newPosts.length > 0) {
        setVisiblePosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
      
      // Check if there are more posts to load
      setHasMore(endIndex < filteredPosts.length);
      setIsLoadingMore(false);
    }, 500);
  }, [allPosts, filter, page, isLoadingMore, hasMore]);

  // Reset pagination when filter changes
  useEffect(() => {
    if (!allPosts) return;

    const filteredPosts = filter === 'all' 
      ? allPosts 
      : allPosts.filter(post => post.type === filter);
    
    const initialPosts = filteredPosts.slice(0, PAGE_SIZE);
    setVisiblePosts(initialPosts);
    setPage(2);
    setHasMore(filteredPosts.length > PAGE_SIZE);
  }, [filter, allPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMorePosts, hasMore, isLoadingMore]);

  // Utility to get preview text
  const getPreviewText = (post: any) => {
    if (post.excerpt && post.excerpt.trim()) {
      return post.excerpt;
    }
    
    return "Click to see more about this adventure...";
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
      <main
        ref={null}
        className="flex-1 max-w-6xl md:max-w-7xl mx-auto w-full px-4 pb-16 pt-10 overflow-y-auto"
        style={{ minHeight: "80vh" }}
        tabIndex={0}
      >
        {/* Header */}
        <header className="mb-5 md:mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">Blog</h1>
          <p className="mb-7 text-gray-700 md:text-lg max-w-2xl">Stories from the road, city corners, rainy afternoons—and all the little moments that make our journey memorable.</p>
        </header>
        {/* Filter Bar */}
        <FilterBar />

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading posts...</p>
          </div>
        ) : (
          <>
            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visiblePosts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  author={post.author || "Anonymous"}
                  date={post.created_at ? format(new Date(post.created_at), 'MMMM d, yyyy') : ''}
                  excerpt={getPreviewText(post)}
                  image={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"}
                />
              ))}
            </div>

            {/* Loading indicator and infinite scroll trigger */}
            {hasMore && (
              <div 
                ref={loaderRef}
                className="text-center py-8"
              >
                {isLoadingMore ? (
                  <p className="text-gray-500">Loading more posts...</p>
                ) : (
                  <p className="text-gray-400">Scroll down for more posts</p>
                )}
              </div>
            )}

            {/* No more posts message */}
            {!hasMore && visiblePosts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You've reached the end of our stories</p>
              </div>
            )}

            {/* No posts found */}
            {!isLoading && visiblePosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found for this filter</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;