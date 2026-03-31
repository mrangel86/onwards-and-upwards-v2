import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import { navbarData } from "@/lib/navbarData";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

const PAGE_SIZE = 6;

type Post = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  created_at: string;
  excerpt: string | null;
  hero_image_url: string | null;
  type: string | null;
};

const BlogIndex = () => {
  const [filter, setFilter] = useState('all');
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['blogPosts', filter],
    queryFn: async ({ pageParam }) => {
      const from = (pageParam - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('posts')
        .select('id, slug, title, author, created_at, excerpt, hero_image_url, type')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Post[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGE_SIZE ? undefined : allPages.length + 1,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load blog posts. Please try again.");
  }, [isError]);

  // Intersection Observer triggers the next server-side page fetch
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const visiblePosts = data?.pages.flat() ?? [];

  const getPreviewText = (post: Post) =>
    post.excerpt?.trim() || "Click to see more about this adventure...";

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
      <main
        className="flex-1 max-w-6xl md:max-w-7xl mx-auto w-full px-4 pb-16 pt-10 overflow-y-auto"
        style={{ minHeight: "80vh" }}
        tabIndex={0}
      >
        {/* Header */}
        <header className="mb-5 md:mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">Blog</h1>
          <p className="mb-7 text-gray-700 md:text-lg max-w-2xl">Stories from the road, city corners, rainy afternoons—and all the little moments that make our journey memorable.</p>
        </header>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading posts...</p>
          </div>
        ) : (
          <>
            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visiblePosts.map((post) => (
                <Link key={post.id} to={`/posts/${post.slug}`}>
                  <BlogCard
                    title={post.title}
                    author={post.author || "Anonymous"}
                    date={post.created_at ? format(new Date(post.created_at), 'MMMM d, yyyy') : ''}
                    excerpt={getPreviewText(post)}
                    image={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80"}
                  />
                </Link>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={loaderRef} className="text-center py-8">
                {isFetchingNextPage ? (
                  <p className="text-gray-500">Loading more posts...</p>
                ) : (
                  <p className="text-gray-400">Scroll down for more posts</p>
                )}
              </div>
            )}

            {!hasNextPage && visiblePosts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You've reached the end of our stories</p>
              </div>
            )}

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
