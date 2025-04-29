
import React, { useState, useEffect } from "react";
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

  // Fetch published posts from Supabase
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['publishedPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, hero_image_url, created_at, author, slug')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (posts && el.scrollTop + el.clientHeight + 50 >= el.scrollHeight && visiblePosts < posts.length) {
      setVisiblePosts((v) => Math.min(posts.length, v + PAGE_SIZE));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main
        className="flex-1 max-w-6xl mx-auto w-full px-4 pb-16 pt-10 overflow-y-auto"
        style={{ minHeight: "80vh" }}
        onScroll={onScroll}
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
                    excerpt={post.excerpt || "Read more about this travel adventure..."}
                    date={formatDate(post.created_at)}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
