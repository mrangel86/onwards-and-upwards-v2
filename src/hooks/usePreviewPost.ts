
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface DeploymentInfo {
  buildVersion: string;
  deploymentTime: string;
  cacheKey: string;
  commitHash: string;
  compiledAt: string;
  forceDeployed: boolean;
}

export const usePreviewPost = (slug: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // PREVIEW SYSTEM v2.0 - Clean preview_posts table and new route
  const BUILD_VERSION = 'v2.0-PREVIEW-SYSTEM-V2-' + new Date().toISOString();
  const DEPLOYMENT_TIME = new Date().toISOString();
  const CACHE_BUSTER = 'preview-system-v2-' + Math.random().toString(36).substr(2, 9);
  const SUPABASE_URL = 'https://zrtgkvpbptxueetuqlmb.supabase.co';

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: 'preview-system-v2-' + Date.now(),
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🚀 PREVIEW SYSTEM v2.0: Starting fetch from preview_posts table');
      console.log('📦 Raw slug parameter received:', slug);
      console.log('🔧 Current URL:', window.location.href);
      console.log('🎯 URL pathname:', window.location.pathname);
      
      // Extract slug from URL path if the parameter is still :slug (now checking for preview-posts)
      let actualSlug = slug;
      if (!slug || slug === ':slug' || slug === 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const previewIndex = pathParts.indexOf('preview-posts');
        if (previewIndex !== -1 && pathParts[previewIndex + 1]) {
          actualSlug = pathParts[previewIndex + 1];
        }
      }
      
      console.log('✅ Final extracted slug:', actualSlug);
      console.log('🔧 PREVIEW SYSTEM v2.0: Using preview_posts table');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        rawSlug: slug,
        extractedSlug: actualSlug,
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        fieldUsed: 'slug',
        tableUsed: 'preview_posts',
        oldTable: 'post_previews',
        previewSystemVersion: 'v2.0'
      }));

      if (!actualSlug || actualSlug === ':slug') {
        console.log('❌ No valid slug found');
        setError('No valid slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 PREVIEW SYSTEM v2.0: Using preview_posts table');
        console.log('🎯 Query: preview_posts WHERE slug =', actualSlug);
        console.log('⚡ EXECUTING QUERY ON CLEAN TABLE');
        
        // Use new preview_posts table
        const { data: primaryData, error: primaryError, count } = await supabase
          .from('preview_posts')
          .select('*', { count: 'exact' })
          .eq('slug', actualSlug);

        console.log('📊 Query Result (PREVIEW SYSTEM v2.0):', { 
          data: primaryData, 
          error: primaryError, 
          count,
          dataLength: primaryData?.length,
          actualSlugUsed: actualSlug,
          queryField: 'slug',
          tableUsed: 'preview_posts'
        });

        let finalData = primaryData;
        let finalError = primaryError;
        let queryUsed = `slug = '${actualSlug}' FROM preview_posts`;

        // Fallback: Get all previews to see what's available
        if (primaryError || !primaryData || primaryData.length === 0) {
          console.log('🔄 Primary query unsuccessful, trying fallback...');
          
          const { data: allPreviews, error: allError } = await supabase
            .from('preview_posts')
            .select('slug, title, id')
            .limit(10);

          console.log('📋 All available previews in preview_posts:', allPreviews);

          if (allPreviews && allPreviews.length > 0) {
            const exactMatch = allPreviews.find(p => p.slug === actualSlug);
            const caseInsensitiveMatch = allPreviews.find(p => 
              p.slug.toLowerCase() === actualSlug.toLowerCase()
            );

            if (exactMatch || caseInsensitiveMatch) {
              const matchedSlug = (exactMatch || caseInsensitiveMatch)?.slug;
              console.log('✅ Found match, fetching for slug:', matchedSlug);
              
              const { data: matchedData, error: matchedError } = await supabase
                .from('preview_posts')
                .select('*')
                .eq('slug', matchedSlug)
                .single();

              if (matchedData && !matchedError) {
                finalData = [matchedData];
                finalError = null;
                queryUsed = `Found match: '${matchedSlug}' FROM preview_posts`;
              }
            }
          }

          setDebugInfo(prev => ({ 
            ...prev, 
            fallbackAttempted: true,
            allAvailablePreviews: allPreviews
          }));
        }
        
        const debugData = {
          queryAttempted: queryUsed,
          fieldUsed: 'slug',
          tableUsed: 'preview_posts',
          oldTable: 'post_previews',
          error: finalError,
          dataReceived: finalData,
          dataCount: finalData?.length || 0,
          totalCount: count,
          previewSystemVersion: 'v2.0',
          buildVersion: BUILD_VERSION,
          supabaseUrl: SUPABASE_URL,
          actualSlugProcessed: actualSlug
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (finalError) {
          console.error('❌ Supabase error (PREVIEW SYSTEM v2.0):', finalError);
          setError(`Database Error: ${finalError.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }

        if (finalData && finalData.length > 0) {
          console.log('✅ Found post (PREVIEW SYSTEM v2.0):', finalData[0]);
          setPost(finalData[0]);
        } else {
          console.log('⚠️ No posts found for slug:', actualSlug);
          setError(`No preview found for slug: ${actualSlug}`);
        }

      } catch (err: any) {
        console.error('💥 Preview System v2.0 error:', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setDebugInfo(prev => ({ ...prev, previewSystemV2Error: err }));
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [slug, deploymentInfo]);

  return {
    loading,
    post,
    error,
    debugInfo,
    deploymentInfo,
    cacheBuster: CACHE_BUSTER,
    buildVersion: BUILD_VERSION
  };
};
