import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import OtherPostsGrid from "@/components/OtherPostsGrid";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";
import LightboxModal from "@/components/LightboxModal";

const SectionDivider = () => <div className="my-14 flex justify-center">
    <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-accent via-peach to-accent opacity-65"></span>
  </div>;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = React.useState("");
  
  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      if (!slug) return null;
      const {
        data,
        error
      } = await supabase.from('posts').select('*').eq('slug', slug).eq('published', true).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No row found
        }
        throw error;
      }
      return data;
    }
  });

  // Fetch related posts
  const {
    data: relatedPosts
  } = useQuery({
    queryKey: ['relatedPosts', post?.id],
    queryFn: async () => {
      if (!post) return [];
      const {
        data,
        error
      } = await supabase.from('posts').select('id, title, excerpt, hero_image_url, created_at, author, slug').eq('published', true).neq('id', post.id).order('created_at', {
        ascending: false
      }).limit(3);
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

  // Function to handle image clicks for lightbox
  const handleImageClick = (imageUrl: string) => {
    setLightboxImageUrl(imageUrl);
    setLightboxOpen(true);
  };

  // This function will be used by a MutationObserver to add click handlers to images
  React.useEffect(() => {
    if (!post) return;
    
    const contentElement = document.querySelector('.prose');
    if (!contentElement) return;
    
    // Add click handlers to all images in the content
    const images = contentElement.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('cursor-pointer', 'hover:opacity-90', 'transition');
      img.addEventListener('click', () => handleImageClick(img.src));
    });
    
    // Also add click handler to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.addEventListener('click', () => {
        const img = heroImage as HTMLImageElement;
        handleImageClick(img.src);
      });
    }
  }, [post]);

  if (isLoading) {
    return <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-5xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading post...</p>
        </main>
        <Footer />
      </div>;
  }

  if (error || !post) {
    return <NotFound />;
  }

  return <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl md:max-w-5xl mx-auto w-full px-4 pb-10">
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
            className="w-full h-60 md:h-96 object-cover cursor-pointer hero-image rounded-xl shadow mb-6" 
            onClick={() => handleImageClick(post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80")}
          />
        </section>

        {/* Content body */}
        <section className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content || "" }} />

        {/* Section Divider */}
        <SectionDivider />

        {/* Other Posts */}
        <OtherPostsGrid posts={relatedPosts || []} />
      </main>
      
      {/* Image Lightbox Modal */}
      <LightboxModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={[lightboxImageUrl]}
        initialIdx={0}
      />
      
      <NewsletterSignup />
      <Footer />
    </div>;
};

export default BlogPost;
