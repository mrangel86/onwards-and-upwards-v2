import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🔍 BlogPreview: Starting fetch for slug:', slug);
      setDebugInfo(prev => ({ ...prev, slug, startTime: new Date().toISOString() }));

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        // Direct, simple query without any complex typing
        console.log('🔗 Making direct Supabase query...');
        
        const query = supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug);
          
        console.log('📝 Query object:', query);
        
        const { data, error } = await query;

        console.log('📊 Raw query result:', { data, error, count: data?.length });
        
        const debugData = {
          queryAttempted: `slug = '${slug}'`,
          supabaseUrl: supabase.supabaseUrl,
          expectedEndpoint: `${supabase.supabaseUrl}/rest/v1/post_previews`,
          error: error,
          dataReceived: data,
          dataCount: data?.length || 0
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (error) {
          console.error('❌ Supabase error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Found post:', data[0]);
          setPost(data[0]);
        } else {
          console.log('⚠️ No posts found');
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error:', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setDebugInfo(prev => ({ ...prev, finalError: err }));
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [slug]);

  // Format content with line breaks
  const formatContent = (content: string) => {
    if (!content) return null;
    return content.split('\n').map((paragraph, index) => (
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
          <p>👁️ <strong>Preview Mode</strong> — Loading...</p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-lg">Loading preview...</p>
            <p className="text-sm text-gray-500 mt-2">Slug: <code>{slug}</code></p>
            <div className="mt-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
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
            
            <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-bold mb-4">🐛 Debug Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Slug:</strong> <code>{debugInfo.slug}</code>
                </div>
                <div>
                  <strong>Query:</strong> <code>{debugInfo.queryAttempted}</code>
                </div>
                <div>
                  <strong>Supabase URL:</strong> <code className="text-xs">{debugInfo.supabaseUrl}</code>
                </div>
                <div>
                  <strong>Data Count:</strong> {debugInfo.dataCount}
                </div>
                {debugInfo.error && (
                  <div>
                    <strong>Error:</strong>
                    <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto">
                      {JSON.stringify(debugInfo.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
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
          <p>⚠️ <strong>No Preview Found</strong></p>
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
      <div className="bg-green-50 border-b border-green-200 text-green-800 p-3 text-center">
        <p>
          👁️ <strong>Preview Mode</strong> — Post Found! • 
          <code className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">{slug}</code>
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
          {formatContent(post.content)}
        </section>

        {/* Success info */}
        <div className="mt-8 p-4 bg-green-50 rounded text-sm">
          <div className="font-bold text-green-800 mb-2">✅ Preview System Working!</div>
          <div className="text-green-700">
            Successfully loaded preview from Supabase • 
            ID: <code>{post.id}</code> • 
            Type: <code>{post.type}</code>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPreview;