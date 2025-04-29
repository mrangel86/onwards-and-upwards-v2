import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import OtherPostsGrid from "@/components/OtherPostsGrid";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";

const SectionDivider = () => (
  <div className="my-14 flex justify-center">
    <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-accent via-peach to-accent opacity-65"></span>
  </div>
);

const PreviewBanner = ({ isPublished }: { isPublished: boolean }) => (
  <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 p-3 text-center">
    <p>⚠️ Preview Mode – {isPublished ? "This post is published. " : "This post is not published. "}
      {isPublished && (
        <Link to={`/posts/${useParams().slug}`} className="underline font-medium">
          View published version
        </Link>
      )}
    </p>
  </div>
);

const BlogPostPreview = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['previewPost', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No row found
        }
        throw error;
      }
      
      return data;
    }
  });

  // Fetch some other posts to show at the bottom
  const { data: relatedPosts } = useQuery({
    queryKey: ['previewRelatedPosts', post?.id],
    queryFn: async () => {
      if (!post) return [];

      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, hero_image_url, created_at, author, slug, published')
        .eq('published', true)
        .limit(3);

      if (error) throw error;
      return data || [];
    },
    enabled: !!post
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading post preview...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <PreviewBanner isPublished={post.published} />
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-10">
        {/* Header */}
        <section className="pt-10 pb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">{post.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
            <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
          </div>
          <img 
            src={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"} 
            alt={post.title} 
            className="w-full h-60 md:h-80 object-cover rounded-xl shadow mb-6" 
          />
        </section>

        {/* Optional Map Block */}
        {post.location && (
          <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="flex-1 text-center md:text-left text-lg text-gray-700">
              The winding roads led us to {post.location}. Every turn was a new discovery—and a fresh story.
            </div>
            <div className="flex-1 max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80" 
                alt="Map placeholder" 
                className="w-full h-56 object-cover rounded-lg bg-gray-100 border" 
              />
            </div>
          </section>
        )}

        {/* Content body */}
        <section 
          className="prose prose-lg max-w-none" 
          dangerouslySetInnerHTML={{ __html: post.content || "" }} 
        />

        {/* Section Divider */}
        <SectionDivider />

        {/* Other Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <OtherPostsGrid posts={relatedPosts} />
        )}
      </main>
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default BlogPostPreview;
