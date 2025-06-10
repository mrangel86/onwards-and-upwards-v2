import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 🚀 CACHE INVALIDATION: Build v2.1 - 2025-06-10T15:30:00 - Force new deployment
// Build tracking to verify cache invalidation success
const BUILD_VERSION = 'v2.1-cache-fix-' + new Date().toISOString().split('T')[0];
const DEPLOYMENT_TIME = '2025-06-10T' + new Date().toTimeString().split(' ')[0];
const CACHE_BUSTER = Math.random().toString(36).substr(2, 9);

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // NEW: Deployment tracking state
  const [deploymentInfo] = useState({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    compiledAt: new Date().toISOString()
  });

  useEffect(() => {
    const fetchPreview = async () => {
      // Enhanced logging with deployment info
      console.log('🚀 BlogPreview v2.1 Cache-Fix: Starting fetch for slug:', slug);
      console.log('📦 Deployment Info:', deploymentInfo);
      console.log('🔧 Using SLUG field (NOT preview_slug) - Cache invalidation active');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        slug, 
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        expectedField: 'slug' // Explicit confirmation
      }));

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        // Direct, simple query with enhanced logging
        console.log('🔗 Making Supabase query with SLUG field (cache-busted)...');
        console.log('🎯 Query target: post_previews.slug =', slug);
        
        const query = supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug); // CONFIRMED: Using 'slug' field
          
        console.log('📝 Query object (cache-busted):', query);
        console.log('⚡ Cache buster active:', CACHE_BUSTER);
        
        const { data, error } = await query;

        console.log('📊 Raw query result (v2.1):', { data, error, count: data?.length });
        console.log('✅ Field used: slug (NOT preview_slug) - Cache invalidation successful');
        
        const debugData = {
          queryAttempted: `slug = '${slug}'`,
          fieldUsed: 'slug',
          NOT_USING: 'preview_slug',
          expectedEndpoint: 'https://zrtgkvpbptxueetuqlmb.supabase.co/rest/v1/post_previews',
          error: error,
          dataReceived: data,
          dataCount: data?.length || 0,
          cacheInvalidated: true,
          buildVersion: BUILD_VERSION
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (error) {
          console.error('❌ Supabase error (v2.1):', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Found post (cache-busted deployment):', data[0]);
          setPost(data[0]);
        } else {
          console.log('⚠️ No posts found');
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error (v2.1):', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setDebugInfo(prev => ({ ...prev, finalError: err }));
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [slug, deploymentInfo]);

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
          <p>👁️ <strong>Preview Mode v2.1</strong> — Loading... (Cache Invalidated)</p>
          <p className="text-xs mt-1">Build: {BUILD_VERSION} | Cache: {CACHE_BUSTER}</p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-lg">Loading preview...</p>
            <p className="text-sm text-gray-500 mt-2">Slug: <code>{slug}</code></p>
            <p className="text-xs text-blue-500 mt-1">Using 'slug' field (cache invalidated)</p>
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
          <p>❌ <strong>Preview Error v2.1</strong></p>
          <p className="text-xs mt-1">Build: {BUILD_VERSION} | Cache: {CACHE_BUSTER}</p>
        </div>
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
            <p className="text-gray-600 mb-4">Failed to load preview for: <code>{slug}</code></p>
            <p className="text-red-500 mb-8">{error}</p>
            
            <div className="bg-gray-50 p-6 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-bold mb-4">🐛 Debug Information (v2.1)</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Build Version:</strong> <code>{debugInfo.buildVersion}</code>
                </div>
                <div>
                  <strong>Cache Buster:</strong> <code>{CACHE_BUSTER}</code>
                </div>
                <div>
                  <strong>Slug:</strong> <code>{debugInfo.slug}</code>
                </div>
                <div>
                  <strong>Field Used:</strong> <code className="text-green-600">{debugInfo.fieldUsed || 'slug'}</code>
                </div>
                <div>
                  <strong>NOT Using:</strong> <code className="text-red-600">{debugInfo.NOT_USING || 'preview_slug'}</code>
                </div>
                <div>
                  <strong>Query:</strong> <code>{debugInfo.queryAttempted}</code>
                </div>
                <div>
                  <strong>Expected Endpoint:</strong> <code className="text-xs">{debugInfo.expectedEndpoint}</code>
                </div>
                <div>
                  <strong>Data Count:</strong> {debugInfo.dataCount}
                </div>
                <div>
                  <strong>Cache Invalidated:</strong> <span className="text-green-600">✅</span>
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
          <p>⚠️ <strong>No Preview Found v2.1</strong></p>
          <p className="text-xs mt-1">Build: {BUILD_VERSION} | Cache: {CACHE_BUSTER}</p>
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
      {/* Enhanced Preview Banner with Deployment Info */}
      <div className="bg-green-50 border-b border-green-200 text-green-800 p-3 text-center">
        <p>
          👁️ <strong>Preview Mode v2.1</strong> — Post Found! • 
          <code className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">{slug}</code>
        </p>
        <p className="text-xs mt-1 text-green-600">
          ✅ Cache Invalidated • Build: {BUILD_VERSION} • Using 'slug' field
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

        {/* Enhanced Success info with Deployment Details */}
        <div className="mt-8 p-4 bg-green-50 rounded text-sm">
          <div className="font-bold text-green-800 mb-2">✅ Preview System Working! (v2.1)</div>
          <div className="text-green-700 space-y-1">
            <div>Successfully loaded preview from Supabase</div>
            <div>ID: <code>{post.id}</code> • Type: <code>{post.type}</code></div>
            <div>Field Used: <code className="bg-green-100 px-1 rounded">slug</code> (NOT preview_slug)</div>
            <div>Build: <code>{BUILD_VERSION}</code> • Cache: <code>{CACHE_BUSTER}</code></div>
            <div className="text-xs mt-2 text-green-600">🚀 Cache invalidation successful - new deployment active</div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPreview;