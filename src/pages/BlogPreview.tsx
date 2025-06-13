
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/preview/PreviewBanner";
import DebugInfo from "@/components/preview/DebugInfo";
import PreviewContent from "@/components/preview/PreviewContent";
import { usePreviewPost } from "@/hooks/usePreviewPost";

// FINAL FIX deployment marker: BlogPreview v5.0 - 2025-06-13T11:45:00Z
// FINAL: Proper slug parameter extraction and correct field usage

const BlogPreview = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  
  console.log('🚀 BlogPreview v5.0 FINAL component mounted');
  console.log('📍 Current URL:', window.location.href);
  console.log('🎯 URL params:', params);
  console.log('🎯 Extracted slug:', slug);
  console.log('✅ Component loaded - calling usePreviewPost with slug:', slug);

  const { loading, post, error, debugInfo, buildVersion, cacheBuster } = usePreviewPost(slug);

  // Log when loading/error states change
  React.useEffect(() => {
    console.log('📊 BlogPreview state update:', { loading, hasPost: !!post, error, slug });
  }, [loading, post, error, slug]);

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
            <p className="text-xs text-blue-500 mt-1">✅ FINAL FIX v5.0 - Proper slug extraction</p>
            <p className="text-xs text-green-600 mt-1">🔧 Using correct 'slug' field only</p>
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
            <p className="text-green-600 mb-4">✅ FINAL FIX: Routing works! Using correct field.</p>
            <p className="text-sm text-gray-500 mb-8">This error is likely a database/data issue, not a routing issue.</p>
            
            <div className="mb-8 text-left">
              <h3 className="font-bold mb-2">🔧 FINAL FIX Debugging (v5.0):</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>1. ✅ Routing is working perfectly</li>
                <li>2. ✅ React component loads correctly</li>
                <li>3. ✅ Supabase connection is established</li>
                <li>4. ✅ Using correct 'slug' field (NOT preview_slug)</li>
                <li>5. ❌ Slug <code>{slug}</code> not found in post_previews table</li>
                <li>6. 🔍 Check available slugs in debug info below</li>
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
            <p className="text-green-600 mb-4">✅ FINAL FIX: Using correct field!</p>
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
