import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Database } from "@/integrations/supabase/types";

type PostPreview = Database['public']['Tables']['post_previews']['Row'];

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('BlogPreview: Starting fetch for slug:', slug);
      setDebugInfo(prev => ({ ...prev, slug, startTime: new Date().toISOString() }));

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        // Test basic Supabase connection first
        console.log('Testing basic Supabase connection...');
        const { data: connectionTest, error: connectionError } = await supabase
          .from('posts')
          .select('count')
          .limit(1);

        console.log('Connection test result:', { connectionTest, connectionError });
        setDebugInfo(prev => ({ ...prev, connectionTest: { data: connectionTest, error: connectionError } }));

        if (connectionError) {
          throw new Error(`Connection test failed: ${connectionError.message}`);
        }

        // Test first without .single() to see if we get data
        console.log('Fetching from post_previews with slug (without single):', slug);
        const { data: listData, error: listError } = await supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug);

        console.log('List fetch result:', { listData, listError });
        setDebugInfo(prev => ({ 
          ...prev, 
          listResult: { data: listData, error: listError },
          expectedUrl: `${supabase.supabaseUrl}/rest/v1/post_previews?select=*&slug=eq.${slug}`
        }));

        if (listError) {
          console.error('List query failed:', listError);
          throw listError;
        }

        if (listData && listData.length > 0) {
          setPost(listData[0]); // Take first result
        } else {
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('BlogPreview error:', err);
        setError(err.message || 'Unknown error occurred');
        setDebugInfo(prev => ({ ...prev, finalError: err }));
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [slug]);

  // Format content with line breaks
  const formatContent = (content: string) => {
    return content?.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        paragraph.startsWith('- ') ? (
          <li key={index} className="ml-4">{paragraph.substring(2)}</li>
        ) : (
          <p key={index} className="mb-4">{paragraph}</p>
        )
      ) : null
    ));
  };

  if (loading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <div className="bg-blue-50 border-b border-blue-200 text-blue-800 p-3 text-center">
          <p>👁️ <strong>Preview Mode</strong> — Not Yet Published</p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-lg">Loading preview...</p>
            <p className="text-sm text-gray-500 mt-2">Slug: <code>{slug}</code></p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <div className="bg-red-50 border-b border-red-200 text-red-800 p-3 text-center">
          <p>❌ <strong>Preview Error</strong></p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
            <p className="text-gray-600 mb-4">Failed to load preview for: <code>{slug}</code></p>
            <p className="text-red-500 mb-8">{error}</p>
            
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <h3 className="font-bold mb-4">Debug Information:</h3>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 p-3 text-center">
          <p>⚠️ <strong>Preview Not Found</strong></p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Preview Not Found</h1>
            <p className="text-gray-600 mb-4">No preview exists for: <code>{slug}</code></p>
            <p className="text-sm text-gray-500">Make sure the post is synced to the preview system.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      {/* Preview Banner */}
      <div className="bg-blue-50 border-b border-blue-200 text-blue-800 p-3 text-center">
        <p>
          👁️ <strong>Preview Mode</strong> — Not Yet Published • 
          <code className="ml-2 bg-blue-100 px-2 py-1 rounded text-sm">{slug}</code>
        </p>
      </div>
      
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10">
        {/* Header */}
        <section className="pt-10 pb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
            {post.title}
          </h1>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          {post.hero_image_url && (
            <img 
              src={post.hero_image_url} 
              alt={post.title} 
              className="w-full h-auto object-contain rounded-xl shadow mb-6" 
            />
          )}
        </section>

        {/* Content */}
        <section className="prose prose-lg max-w-none">
          {post.content && formatContent(post.content)}
        </section>

        {/* Debug info (only in preview) */}
        <div className="mt-8 p-4 bg-gray-50 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-bold">Debug Info (Preview Only)</summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap">
              {JSON.stringify({ post, debugInfo }, null, 2)}
            </pre>
          </details>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPreview;