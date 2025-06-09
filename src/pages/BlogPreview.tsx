import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();

  // Simplified: just fetch the post from post_previews table
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['blogPreview', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      try {
        // Fetch the specific preview post
        const { data, error } = await supabase
          .from('post_previews')
          .select('*')
          .eq('preview_slug', slug)
          .single();
        
        if (error) {
          console.error('Error fetching preview:', error);
          return null;
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching preview:', err);
        return null;
      }
    },
    enabled: !!slug
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Format content to handle line breaks and basic formatting
  const formatContent = (content: string) => {
    if (!content) return '';
    
    return content
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map((paragraph, index) => (
        <p key={index} className="mb-4 leading-relaxed">
          {paragraph}
        </p>
      ));
  };

  // Loading state
  if (postLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error or no post found
  if (postError || !post) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Preview Not Found</h1>
            <p className="text-gray-600 mb-4">
              No draft found with slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
            </p>
            <p className="text-gray-500 text-sm">
              Make sure you have a draft post in Notion and try again.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Display the preview
  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10">
        {/* Preview Notice */}
        <div className="pt-6 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-blue-600 mr-3">👁️</div>
              <div>
                <p className="text-blue-800 font-medium">Preview Mode</p>
                <p className="text-blue-700 text-sm">
                  You're viewing: <strong>{post.preview_slug}</strong> | This is a draft preview, not the live blog post.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <section className="pt-4 pb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
            <span className="text-sm text-gray-500">{formatDate(post.publish_date)}</span>
          </div>
          {post.featured_image_url && (
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="w-full h-auto object-contain rounded-xl shadow mb-6" 
            />
          )}
        </section>

        {/* Content */}
        <section className="prose prose-lg max-w-none">
          {post.content ? formatContent(post.content) : (
            <p className="text-gray-500 italic">No content yet...</p>
          )}
        </section>

        {/* Tags */}
        {post.tags_array && post.tags_array.length > 0 && (
          <section className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags_array.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Simple Preview Instructions */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-green-800 font-medium mb-2">📝 Simple Preview Workflow</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Make changes in Notion and ask Claude to update this preview</li>
              <li>• When ready to publish: Change Status to "Published" in Notion</li>
              <li>• Ask Claude to sync to live blog</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPreview;