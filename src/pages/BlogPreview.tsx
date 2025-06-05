import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const correctPassword = "Valentina711!";

  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const authenticated = sessionStorage.getItem('preview-authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('preview-authenticated', 'true');
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  // Sync previews and fetch the post
  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['blogPreview', slug],
    queryFn: async () => {
      if (!slug || !isAuthenticated) return null;
      
      try {
        // First sync the previews
        const syncResponse = await fetch('https://zrtgkvpbptxueetuqlmb.supabase.co/functions/v1/sync-notion-previews');
        
        if (!syncResponse.ok) {
          console.warn('Preview sync failed, continuing with existing data');
        }
        
        // Then fetch the specific preview post
        const { data, error } = await supabase
          .from('post_previews')
          .select('*')
          .eq('preview_slug', slug)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No post found, try to get the latest draft for this author
            const authorName = slug.split('-draft-')[0];
            const { data: latestDraft, error: latestError } = await supabase
              .from('post_previews')
              .select('*')
              .eq('author', authorName)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            
            if (latestError || !latestDraft) {
              return null;
            }
            return latestDraft;
          }
          throw error;
        }
        
        return data;
      } catch (err) {
        console.error('Error fetching preview:', err);
        throw err;
      }
    },
    enabled: isAuthenticated && !!slug
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

  // Password form
  if (!isAuthenticated) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-bold text-center mb-6 text-primary">
                Preview Access
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Enter the password to view blog post previews
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div className="mb-4 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full bg-accent text-white py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Checking...' : 'Access Previews'}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state
  if (postLoading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl md:max-w-6xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-gray-600">Syncing and loading preview...</p>
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">⚠️</div>
              <div>
                <p className="text-yellow-800 font-medium">Preview Mode</p>
                <p className="text-yellow-700 text-sm">
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

        {/* Preview Instructions */}
        <section className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">Preview Instructions</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Make changes in Notion and refresh this page to see updates</li>
              <li>• Change Status to "Published" in Notion when ready to go live</li>
              <li>• Let Michael know to run the publish sync</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPreview;