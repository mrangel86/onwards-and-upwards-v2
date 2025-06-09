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
  <>
    {/* Robots meta tag to prevent indexing */}
    <meta name="robots" content="noindex, nofollow" />
    <div className="bg-blue-50 border-b border-blue-200 text-blue-800 p-3 text-center shadow-sm">
      <div className="max-w-4xl mx-auto">
        <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
          <span className="text-lg">👁️</span>
          <strong>Preview Mode</strong>
          <span className="hidden sm:inline">—</span>
          <span className="text-blue-600">
            Not Yet Published
          </span>
          <span className="hidden sm:inline">•</span>
          <code className="bg-blue-100 px-2 py-1 rounded text-xs sm:text-sm font-mono">
            {slug}
          </code>
        </p>
      </div>
    </div>
  </>
);

// Helper function to format content with proper paragraphs and line breaks
const formatContentToHTML = (content: string): string => {
  if (!content) return '';
  
  return content
    .split('\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => {
      // Check if it's a list item starting with -
      if (paragraph.startsWith('- ')) {
        return `<li>${paragraph.substring(2)}</li>`;
      }
      // Check if it's a numbered list
      if (/^\d+\.\s/.test(paragraph)) {
        return `<li>${paragraph.replace(/^\d+\.\s/, '')}</li>`;
      }
      // Regular paragraph
      return `<p>${paragraph}</p>`;
    })
    .join('\n')
    // Wrap consecutive list items in ul tags
    .replace(/(<li>.*?<\/li>\s*)+/g, match => `<ul>\n${match}</ul>\n`);
};

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Add debug logging
  console.log('BlogPreview: slug from params:', slug);

  // Fetch from post_previews table with improved error handling
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['preview', slug],
    queryFn: async () => {
      console.log('BlogPreview: Starting query for slug:', slug);
      
      if (!slug) {
        console.log('BlogPreview: No slug provided');
        return null;
      }

      try {
        console.log('BlogPreview: Querying post_previews for slug:', slug);
        
        const { data, error } = await supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug)
          .single();

        console.log('BlogPreview: Supabase response:', { data, error });

        if (error) {
          console.error('BlogPreview: Supabase error:', error);
          if (error.code === 'PGRST116') {
            console.log('BlogPreview: No row found for slug:', slug);
            return null; // No row found
          }
          throw error;
        }
        
        console.log('BlogPreview: Successfully fetched post:', data);
        return data;
      } catch (err) {
        console.error('BlogPreview: Query error:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000
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

  // Debug logging
  console.log('BlogPreview: Current state:', { post, isLoading, error });

  if (isLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading preview...</p>
          {slug && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Looking for: <code>{slug}</code>
            </p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    console.error('BlogPreview: Rendering error state:', error);
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
            <p className="text-gray-600 mb-2">Failed to load preview for: <code>{slug}</code></p>
            <p className="text-sm text-red-500">{error.message}</p>
            <div className="mt-4 p-4 bg-gray-100 rounded text-left">
              <pre className="text-xs overflow-auto">{JSON.stringify(error, null, 2)}</pre>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    console.log('BlogPreview: No post found, rendering NotFound');
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Preview Not Found</h1>
            <p className="text-gray-600 mb-2">No preview found for: <code>{slug}</code></p>
            <p className="text-sm text-gray-500">
              Make sure the post is synced to the preview system.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isGalleryPost = post.type === 'gallery' && post.gallery_description;

  // Format content for display
  const formattedContent = formatContentToHTML(post.content || '');

  console.log('BlogPreview: Rendering post:', post.title);

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
          {post.hero_image_url && (
            <img 
              src={post.hero_image_url} 
              alt={post.title} 
              className="w-full h-auto object-contain hero-image rounded-xl shadow mb-6 cursor-pointer" 
            />
          )}
        </section>

        {/* Content body - using exact same logic as BlogPost */}
        {slug === 'japan-highlights' || isGalleryPost ? (
          <PostImageGallery 
            postId={post.id} 
            galleryDescription={isGalleryPost ? post.gallery_description : undefined}
          />
        ) : (
          <section 
            className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: formattedContent }} 
          />
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