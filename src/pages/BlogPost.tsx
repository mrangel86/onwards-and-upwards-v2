
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import { navbarData } from "@/lib/navbarData";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import OtherPostsGrid from "@/components/OtherPostsGrid";
import PostImageGallery from "@/components/PostImageGallery";
import { supabase } from "@/integrations/supabase/client";
import { optimizeSupabaseImage, ImagePresets } from "@/lib/imageOptimization";
import { formatDate } from "@/lib/postUtils";
import NotFound from "./NotFound";
import LightboxModal from "@/components/LightboxModal";

const SectionDivider = () => <div className="my-14 flex justify-center">
    <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-accent via-peach to-accent opacity-65"></span>
  </div>;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [contentImageTitles, setContentImageTitles] = useState<string[]>([]);
  const [contentImageCaptions, setContentImageCaptions] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
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
      } = await supabase.from('posts').select('id, title, excerpt, hero_image_url, created_at, author, slug, content').eq('published', true).neq('id', post.id).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!post
  });

  // Extract all images from post content
  useEffect(() => {
    if (!post || !post.content) return;
    
    const extractImages = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(post.content, 'text/html');
      const imageElements = doc.querySelectorAll('img');
      
      const images: string[] = [];
      const titles: string[] = [];
      const captions: string[] = [];
      
      // Extract metadata from content images
      Array.from(imageElements).forEach(img => {
        images.push(img.src);
        titles.push(img.alt || img.title || post.title || '');
        
        // Try to find caption from parent figure or nearby text
        const parent = img.parentElement;
        let caption = '';
        if (parent?.tagName === 'FIGURE') {
          const figcaption = parent.querySelector('figcaption');
          caption = figcaption?.textContent || '';
        }
        captions.push(caption);
      });
      
      // Add hero image if it exists
      if (post.hero_image_url) {
        images.unshift(post.hero_image_url);
        titles.unshift(post.title || '');
        captions.unshift(post.excerpt || '');
      }
      
      setContentImages(images);
      setContentImageTitles(titles);
      setContentImageCaptions(captions);
    };
    
    extractImages();
  }, [post, slug]);

  // Handle image click to open lightbox
  const handleImageClick = (imageUrl: string) => {
    const imageIndex = contentImages.indexOf(imageUrl);
    setActiveImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setLightboxImageUrl(imageUrl);
    setLightboxOpen(true);
  };

  // Add click handlers to content images + mark 2-image grids
  useEffect(() => {
    if (!post) return;
    
    // Small delay to ensure content is rendered
    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.post-content');
      if (!contentElement) return;
      
      // Add click handlers to all images in content
      const images = contentElement.querySelectorAll('img');
      images.forEach(img => {
        img.classList.add('cursor-pointer', 'hover:opacity-90', 'transition');
        img.addEventListener('click', () => handleImageClick(img.src));
      });
      
      // Mark 2-image grids with data attribute for CSS targeting
      const imageGrids = contentElement.querySelectorAll('.image-grid');
      imageGrids.forEach(grid => {
        const imgCount = grid.querySelectorAll('img').length;
        (grid as HTMLElement).dataset.images = String(imgCount);
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
    }, 100);
    
    return () => clearTimeout(timer);
  }, [post, slug]);

  if (isLoading) {
    return <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar1 {...navbarData} />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading post...</p>
        </main>
        <Footer />
      </div>;
  }

  if (error || !post) {
    return <NotFound />;
  }

  const isGalleryPost = post.type === 'gallery' && post.gallery_description;

  return <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
      <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10">
        {/* Header */}
        <section className="pt-10 pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{post.title}</h1>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
            <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
          </div>
          <img
            src={post.hero_image_url ? optimizeSupabaseImage(post.hero_image_url, ImagePresets.featured) : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"}
            alt={post.title}
            className="w-full h-auto object-contain hero-image rounded-xl shadow mb-6 cursor-pointer"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />
        </section>

        {/* Content body */}
        {isGalleryPost ? (
          <PostImageGallery 
            postId={post.slug} 
            galleryDescription={post.gallery_description}
          />
        ) : (
          <section className="post-content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        )}

        {/* Section Divider */}
        <SectionDivider />

        {/* Other Posts */}
        <div className="max-w-6xl mx-auto">
          <OtherPostsGrid posts={relatedPosts || []} />
        </div>
      </main>
      
      {/* Image Lightbox Modal */}
      {!isGalleryPost && (
        <LightboxModal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={contentImages}
          initialIdx={activeImageIndex}
          titles={contentImageTitles}
          descs={contentImageCaptions}
        />
      )}
      
      <NewsletterSignup />
      <Footer />
    </div>;
};

export default BlogPost;
