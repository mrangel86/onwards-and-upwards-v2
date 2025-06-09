import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import OtherPostsGrid from "@/components/OtherPostsGrid";
import PostImageGallery from "@/components/PostImageGallery";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "./NotFound";
import LightboxModal from "@/components/LightboxModal";

const SectionDivider = () => (
  <div className="my-14 flex justify-center">
    <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-accent via-peach to-accent opacity-65"></span>
  </div>
);

const PreviewBanner = ({ slug }: { slug: string }) => (
  <div className="bg-blue-50 border-b border-blue-200 text-blue-800 p-3 text-center">
    <p>
      👁️ <strong>Preview Mode</strong> – Viewing draft: <code className="bg-blue-100 px-2 py-1 rounded text-sm">{slug}</code>
      {" "}| This is how your post will look when published
    </p>
  </div>
);

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch draft post (published = false) from posts table
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPreview', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', false) // Only fetch unpublished drafts for preview
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

  // Fetch some related posts for the bottom section (from live posts)
  const { data: relatedPosts } = useQuery({
    queryKey: ['previewRelatedPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, hero_image_url, created_at, author, slug, content')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    }
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Extract all images from post content 
  useEffect(() => {
    if (!post || !post.content) return;
    
    const extractImages = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, 'text/html');
      const imageElements = doc.querySelectorAll('img');
      const images = Array.from(imageElements).map(img => img.src);
      
      // Add hero image if it exists
      if (post.hero_image_url) {
        images.unshift(post.hero_image_url);
      }
      
      setContentImages(images);
    };
    
    extractImages();
  }, [post]);

  // Handle image click to open lightbox
  const handleImageClick = (imageUrl: string) => {
    const imageIndex = contentImages.indexOf(imageUrl);
    setActiveImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setLightboxImageUrl(imageUrl);
    setLightboxOpen(true);
  };

  // Add click handlers to content images
  useEffect(() => {
    if (!post) return;
    
    const contentElement = document.querySelector('.prose');
    if (!contentElement) return;
    
    // Add click handlers to all images in content
    const images = contentElement.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('cursor-pointer', 'hover:opacity-90', 'transition');
      img.addEventListener('click', () => handleImageClick(img.src));
    });
    
    // Add click handler to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      heroImage.classList.add('cursor-pointer');
      heroImage.addEventListener('click', () => {
        const img = heroImage as HTMLImageElement;
        handleImageClick(img.src);
      });
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading preview...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <NotFound />;
  }

  const isGalleryPost = post.type === 'gallery' && post.gallery_description;

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <PreviewBanner slug={slug || ''} />
      <Navbar />
      <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10">
        {/* Header - exact same styling as BlogPost */}
        <section className="pt-10 pb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
            <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
          </div>
          <img 
            src={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"} 
            alt={post.title} 
            className="w-full h-auto object-contain hero-image rounded-xl shadow mb-6 cursor-pointer" 
          />
        </section>

        {/* Content body - using exact same logic as BlogPost */}
        {slug === 'japan-highlights' || isGalleryPost ? (
          <PostImageGallery 
            postId={post.id} 
            galleryDescription={isGalleryPost ? post.gallery_description : undefined}
          />
        ) : (
          <section className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        )}

        {/* Section Divider */}
        <SectionDivider />

        {/* Other Posts */}
        <div className="max-w-6xl mx-auto">
          <OtherPostsGrid posts={relatedPosts || []} />
        </div>
      </main>
      
      {/* Image Lightbox Modal - only for regular posts */}
      {slug !== 'japan-highlights' && !isGalleryPost && (
        <LightboxModal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={contentImages}
          initialIdx={activeImageIndex}
        />
      )}
      
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default BlogPreview;
