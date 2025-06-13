
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
  
  // COMPLETE REWRITE: v6.0 - Fix slug extraction and force correct field usage
  const BUILD_VERSION = 'v6.0-COMPLETE-REWRITE-' + new Date().toISOString();
  const DEPLOYMENT_TIME = new Date().toISOString();
  const CACHE_BUSTER = 'complete-rewrite-' + Math.random().toString(36).substr(2, 9);
  const SUPABASE_URL = 'https://zrtgkvpbptxueetuqlmb.supabase.co';

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: 'complete-rewrite-' + Date.now(),
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🚀 BlogPreview v6.0 COMPLETE REWRITE: Starting fetch');
      console.log('📦 Raw slug parameter received:', slug);
      console.log('🔧 Current URL:', window.location.href);
      console.log('🎯 URL pathname:', window.location.pathname);
      
      // Extract slug from URL path if the parameter is still :slug
      let actualSlug = slug;
      if (!slug || slug === ':slug' || slug === 'undefined') {
        const pathParts = window.location.pathname.split('/');
        const previewIndex = pathParts.indexOf('preview');
        if (previewIndex !== -1 && pathParts[previewIndex + 1]) {
          actualSlug = pathParts[previewIndex + 1];
        }
      }
      
      console.log('✅ Final extracted slug:', actualSlug);
      console.log('🔧 COMPLETE REWRITE: Using ONLY slug field, NEVER preview_slug');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        rawSlug: slug,
        extractedSlug: actualSlug,
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        fieldUsed: 'slug',
        fieldNeverUsed: 'preview_slug',
        completeRewrite: true
      }));

      if (!actualSlug || actualSlug === ':slug') {
        console.log('❌ No valid slug found');
        setError('No valid slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 COMPLETE REWRITE: Using ONLY the slug field');
        console.log('🎯 Query: post_previews WHERE slug =', actualSlug);
        console.log('⚡ EXECUTING QUERY WITH SLUG FIELD ONLY');
        
        // Force use of slug field only - complete rewrite
        const { data: primaryData, error: primaryError, count } = await supabase
          .from('post_previews')
          .select('*', { count: 'exact' })
          .eq('slug', actualSlug);

        console.log('📊 Query Result (COMPLETE REWRITE):', { 
          data: primaryData, 
          error: primaryError, 
          count,
          dataLength: primaryData?.length,
          actualSlugUsed: actualSlug,
          queryField: 'slug'
        });

        let finalData = primaryData;
        let finalError = primaryError;
        let queryUsed = `slug = '${actualSlug}'`;

        // Fallback: Get all previews to see what's available
        if (primaryError || !primaryData || primaryData.length === 0) {
          console.log('🔄 Primary query unsuccessful, trying fallback...');
          
          const { data: allPreviews, error: allError } = await supabase
            .from('post_previews')
            .select('slug, title, id')
            .limit(10);

          console.log('📋 All available previews:', allPreviews);

          if (allPreviews && allPreviews.length > 0) {
            const exactMatch = allPreviews.find(p => p.slug === actualSlug);
            const caseInsensitiveMatch = allPreviews.find(p => 
              p.slug.toLowerCase() === actualSlug.toLowerCase()
            );

            if (exactMatch || caseInsensitiveMatch) {
              const matchedSlug = (exactMatch || caseInsensitiveMatch)?.slug;
              console.log('✅ Found match, fetching for slug:', matchedSlug);
              
              const { data: matchedData, error: matchedError } = await supabase
                .from('post_previews')
                .select('*')
                .eq('slug', matchedSlug)
                .single();

              if (matchedData && !matchedError) {
                finalData = [matchedData];
                finalError = null;
                queryUsed = `Found match: '${matchedSlug}'`;
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
          fieldNeverUsed: 'preview_slug',
          error: finalError,
          dataReceived: finalData,
          dataCount: finalData?.length || 0,
          totalCount: count,
          completeRewrite: true,
          buildVersion: BUILD_VERSION,
          supabaseUrl: SUPABASE_URL,
          actualSlugProcessed: actualSlug
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (finalError) {
          console.error('❌ Supabase error (COMPLETE REWRITE):', finalError);
          setError(`Database Error: ${finalError.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }

        if (finalData && finalData.length > 0) {
          console.log('✅ Found post (COMPLETE REWRITE):', finalData[0]);
          setPost(finalData[0]);
        } else {
          console.log('⚠️ No posts found for slug:', actualSlug);
          setError(`No preview found for slug: ${actualSlug}`);
        }

      } catch (err: any) {
        console.error('💥 Complete rewrite error:', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setDebugInfo(prev => ({ ...prev, completeRewriteError: err }));
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
