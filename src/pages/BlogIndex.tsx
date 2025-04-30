
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const PAGE_SIZE = 6;

const BlogIndex = () => {
  const [visiblePosts, setVisiblePosts] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch published posts from Supabase
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['publishedPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, hero_image_url, created_at, author, slug, content')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const loadMorePosts = useCallback(() => {
    if (loading || !posts || !hasMore) return;
    
    setLoading(true);
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      if (posts.length > visiblePosts) {
        setVisiblePosts(prev => Math.min(posts.length, prev + PAGE_SIZE));
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 300);
  }, [visiblePosts, loading, posts, hasMore]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loaderRef, loadMorePosts, hasMore]);

  // Update hasMore when posts data changes
  useEffect(() => {
    if (posts) {
      setHasMore(visiblePosts < posts.length);
    }
  }, [posts, visiblePosts]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Function to create excerpt from post content
  const createExcerpt = (post: any) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content) {
      // Strip HTML tags and limit to ~120 chars
      const strippedContent = post.content.replace(/<[^>]*>/g, '');
      return strippedContent.length > 120 
        ? `${strippedContent.substring(0, 120)}...` 
        : strippedContent;
    }
    
    return "Click to see more about this adventure...";
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main
        ref={containerRef}
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

        {/* Blog grid */}
        <section>
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading posts. Please try again later.</p>
            </div>
          )}
          
          {posts && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No posts found.</p>
            </div>
          )}
          
          {posts && posts.length > 0 && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-7 md:gap-10">
              {posts.slice(0, visiblePosts).map((post) => (
                <Link to={`/posts/${post.slug}`} key={post.id} className="no-underline">
                  <BlogCard 
                    title={post.title}
                    author={post.author || "Anonymous"}
                    image={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80"}
                    excerpt={createExcerpt(post)}
                    date={formatDate(post.created_at)}
                  />
                </Link>
              ))}
            </div>
          )}
          
          {/* Loader reference element - when visible, load more posts */}
          <div 
            ref={loaderRef} 
            className="h-10 w-full flex justify-center items-center my-8"
          >
            {loading && (
              <div className="text-center">
                <p className="text-gray-500">Loading more posts...</p>
              </div>
            )}
          </div>
          
          {/* End of posts message */}
          {posts && !hasMore && posts.length > 0 && (
            <div className="text-center pb-8">
              <p className="text-gray-500">You've reached the end of our posts.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
