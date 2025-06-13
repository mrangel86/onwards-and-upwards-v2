
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreviewBanner from "@/components/preview/PreviewBanner";
import DebugInfo from "@/components/preview/DebugInfo";
import PreviewContent from "@/components/preview/PreviewContent";
import { usePreviewPost } from "@/hooks/usePreviewPost";

// Force deployment marker: BlogPreview route fix - 2025-06-13T11:08:00Z
// CRITICAL: Ensure preview routes work on deployed site

const BlogPreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const { loading, post, error, debugInfo, buildVersion, cacheBuster } = usePreviewPost(slug);

  // Add console logs to help debug routing issues
  React.useEffect(() => {
    console.log('🚀 BlogPreview component mounted');
    console.log('📍 Current URL:', window.location.href);
    console.log('🎯 Slug parameter:', slug);
    console.log('✅ Component successfully loaded - routing is working!');
  }, [slug]);

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
            <p className="text-xs text-blue-500 mt-1">✅ ROUTING WORKS - Using 'slug' field (v3.0 NEW DEPLOYMENT)</p>
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
            <p className="text-red-500 mb-8">{error}</p>
            <p className="text-green-600 mb-4">✅ GOOD NEWS: Routing works! The 404 is fixed.</p>
            <p className="text-sm text-gray-500 mb-8">This error is likely a data issue, not a routing issue.</p>
            
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
            <p className="text-sm text-gray-500">Make sure the post is synced to the preview system.</p>
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
