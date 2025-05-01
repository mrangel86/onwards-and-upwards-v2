
import React from "react";
import { useParams, Link } from "react-router-dom";
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
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = React.useState("");
  const [contentImages, setContentImages] = React.useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

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
  
  // Extract all images from post content - only for regular posts
  React.useEffect(() => {
    if (!post || !post.content || slug === 'japan-highlights' || (post.type === 'gallery' && post.gallery_description)) return;
    
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
  }, [post, slug]);

  // Function to handle image clicks for lightbox
  const handleImageClick = (imageUrl: string) => {
    const imageIndex = contentImages.indexOf(imageUrl);
    setActiveImageIndex(imageIndex >= 0 ? imageIndex : 0);
    setLightboxImageUrl(imageUrl);
    setLightboxOpen(true);
  };

  // Add click handlers to content images (for regular posts)
  React.useEffect(() => {
    if (!post || slug === 'japan-highlights' || (post.type === 'gallery' && post.gallery_description)) return;
    
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
      heroImage.addEventListener('click', () => {
        const img = heroImage as HTMLImageElement;
        handleImageClick(img.src);
      });
    }
  }, [post, slug]);

  if (isLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-5xl mx-auto w-full px-4 pb-10 pt-16">
          <p className="text-center">Loading post preview...</p>
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
      <PreviewBanner isPublished={post.published} />
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
            className="w-full h-60 md:h-96 object-cover cursor-pointer hero-image" 
            onClick={() => handleImageClick(post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80")}
          />
        </section>

        {/* Optional Map Block */}
        {post.location && slug !== 'japan-highlights' && !isGalleryPost && (
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
        {slug === 'japan-highlights' || isGalleryPost ? (
          <PostImageGallery 
            postId={post.id}
            galleryDescription={isGalleryPost ? post.gallery_description : undefined} 
          />
        ) : (
          <section 
            className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: post.content || "" }} 
          />
        )}

        {/* Section Divider */}
        <SectionDivider />

        {/* Other Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <OtherPostsGrid posts={relatedPosts} />
        )}
      </main>
      
      {/* Image Lightbox Modal - only for regular posts */}
      {slug !== 'japan-highlights' && !isGalleryPost ? (
        <LightboxModal
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={contentImages.length > 0 ? contentImages : [lightboxImageUrl]}
          initialIdx={activeImageIndex}
        />
      ) : null}
      
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default BlogPostPreview;
