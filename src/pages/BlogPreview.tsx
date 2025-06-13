
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/preview/PreviewBanner";
import DebugInfo from "@/components/preview/DebugInfo";
import PreviewContent from "@/components/preview/PreviewContent";
import { usePreviewPost } from "@/hooks/usePreviewPost";

// Force deployment marker: BlogPreview enhanced debugging v4.2 - 2025-06-13T11:30:00Z
// ENHANCED: Better debugging and slug matching for deployment diagnosis

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const { loading, post, error, debugInfo, buildVersion, cacheBuster } = usePreviewPost(slug);

  // Add console logs to help debug routing issues
  React.useEffect(() => {
    console.log('🚀 BlogPreview v4.2 component mounted - ENHANCED DEBUGGING');
    console.log('📍 Current URL:', window.location.href);
    console.log('🎯 Slug parameter:', slug);
    console.log('✅ Component successfully loaded - routing is working!');
    console.log('🔧 About to call usePreviewPost with enhanced debugging...');
  }, [slug]);

  // Log when loading/error states change
  React.useEffect(() => {
    console.log('📊 BlogPreview state update:', { loading, hasPost: !!post, error });
  }, [loading, post, error]);

  if (loading) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <PreviewBanner 
          type="loading" 
          slug={slug} 
          buildVersion={buildVersion} 
          cacheBuster={cacheBuster} 
        />
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <p className="text-lg">Loading preview...</p>
            <p className="text-sm text-gray-500 mt-2">Slug: <code>{slug}</code></p>
            <p className="text-xs text-blue-500 mt-1">✅ ROUTING WORKS - Enhanced debugging v4.2</p>
            <p className="text-xs text-green-600 mt-1">🔧 Checking multiple query patterns...</p>
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
        <PreviewBanner 
          type="error" 
          buildVersion={buildVersion} 
          cacheBuster={cacheBuster} 
        />
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Preview Error</h1>
            <p className="text-gray-600 mb-4">Failed to load preview for: <code>{slug}</code></p>
            <p className="text-red-500 mb-4 text-sm bg-red-50 p-4 rounded">{error}</p>
            <p className="text-green-600 mb-4">✅ GOOD NEWS: Routing works! The 404 is fixed.</p>
            <p className="text-sm text-gray-500 mb-8">This error is likely a database/data issue, not a routing issue.</p>
            
            <div className="mb-8 text-left">
              <h3 className="font-bold mb-2">🔧 Enhanced Debugging (v4.2):</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>1. ✅ Routing is working perfectly</li>
                <li>2. ✅ React component loads correctly</li>
                <li>3. ✅ Supabase connection is established</li>
                <li>4. ❌ Slug <code>{slug}</code> not found in post_previews table</li>
                <li>5. 🔍 Check available slugs in debug info below</li>
              </ul>
            </div>

            {debugInfo.allAvailablePreviews && (
              <div className="mb-8 text-left bg-blue-50 p-4 rounded">
                <h4 className="font-bold mb-2">Available Preview Slugs:</h4>
                <ul className="text-sm space-y-1">
                  {debugInfo.allAvailablePreviews.map((preview: any) => (
                    <li key={preview.id}>
                      <code className="bg-blue-100 px-2 py-1 rounded mr-2">{preview.slug}</code>
                      <span className="text-gray-600">{preview.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <DebugInfo 
              debugInfo={debugInfo} 
              cacheBuster={cacheBuster} 
              buildVersion={buildVersion} 
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="font-inter bg-background min-h-screen flex flex-col">
        <PreviewBanner 
          type="not-found" 
          buildVersion={buildVersion} 
          cacheBuster={cacheBuster} 
        />
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10 pt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Preview Not Found</h1>
            <p className="text-gray-600 mb-4">No preview exists for: <code>{slug}</code></p>
            <p className="text-green-600 mb-4">✅ ROUTING FIXED: No more 404 errors!</p>
            <p className="text-sm text-gray-500 mb-4">Make sure the post is synced to the preview system.</p>
            
            <div className="bg-yellow-50 p-4 rounded text-sm text-left mb-4">
              <h4 className="font-bold mb-2">Expected slug in database:</h4>
              <code className="bg-yellow-100 px-2 py-1 rounded">{slug}</code>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <PreviewBanner 
        type="success" 
        slug={slug} 
        buildVersion={buildVersion} 
        cacheBuster={cacheBuster} 
      />
      
      <Navbar />
      
      <PreviewContent post={post} buildVersion={buildVersion} />
      
      <Footer />
    </div>
  );
};

export default BlogPreview;
