
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
  
  // NEW DEPLOYMENT: Enhanced debugging and slug handling
  const BUILD_VERSION = 'v4.2-enhanced-debugging-' + new Date().toISOString().split('T')[0];
  const DEPLOYMENT_TIME = new Date().toISOString();
  const CACHE_BUSTER = 'debug-enhanced-' + Math.random().toString(36).substr(2, 9);
  const SUPABASE_URL = 'https://zrtgkvpbptxueetuqlmb.supabase.co';

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: 'enhanced-debugging-deployment',
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🚀 BlogPreview v4.2 ENHANCED DEBUG: Starting fetch for slug:', slug);
      console.log('📦 Deployment Info:', deploymentInfo);
      console.log('🔧 Enhanced debugging mode - multiple query attempts');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        slug, 
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        primaryField: 'slug',
        fallbackQueries: ['All previews', 'Slug variations']
      }));

      if (!slug) {
        console.log('❌ No slug provided to usePreviewPost');
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 ENHANCED DEBUG: Making primary Supabase query...');
        console.log('🎯 Primary Query: post_previews.slug =', slug);
        console.log('📊 Supabase URL:', SUPABASE_URL);
        
        // Primary query with exact slug match
        const { data: primaryData, error: primaryError, count } = await supabase
          .from('post_previews')
          .select('*', { count: 'exact' })
          .eq('slug', slug);

        console.log('📊 Primary Query Result:', { 
          data: primaryData, 
          error: primaryError, 
          count,
          dataLength: primaryData?.length,
          supabaseUrl: SUPABASE_URL 
        });

        let finalData = primaryData;
        let finalError = primaryError;
        let queryUsed = `slug = '${slug}'`;

        // If primary query fails or returns no results, try alternative approaches
        if (primaryError || !primaryData || primaryData.length === 0) {
          console.log('🔄 Primary query unsuccessful, trying fallback queries...');
          
          // Fallback 1: Get all previews to see what's available
          const { data: allPreviews, error: allError } = await supabase
            .from('post_previews')
            .select('slug, title, id')
            .limit(10);

          console.log('📋 All available previews:', allPreviews);
          console.log('🔍 Looking for slug containing:', slug);

          if (allPreviews && allPreviews.length > 0) {
            // Try to find a matching slug with case-insensitive search
            const exactMatch = allPreviews.find(p => p.slug === slug);
            const caseInsensitiveMatch = allPreviews.find(p => 
              p.slug.toLowerCase() === slug.toLowerCase()
            );
            const partialMatch = allPreviews.find(p => 
              p.slug.includes(slug) || slug.includes(p.slug)
            );

            console.log('🔍 Match attempts:', {
              exactMatch,
              caseInsensitiveMatch,
              partialMatch,
              availableSlugs: allPreviews.map(p => p.slug)
            });

            if (exactMatch || caseInsensitiveMatch || partialMatch) {
              const matchedSlug = (exactMatch || caseInsensitiveMatch || partialMatch)?.slug;
              console.log('✅ Found potential match, fetching full data for slug:', matchedSlug);
              
              const { data: matchedData, error: matchedError } = await supabase
                .from('post_previews')
                .select('*')
                .eq('slug', matchedSlug)
                .single();

              if (matchedData && !matchedError) {
                finalData = [matchedData];
                finalError = null;
                queryUsed = `Found via slug matching: '${matchedSlug}'`;
              }
            }
          }

          setDebugInfo(prev => ({ 
            ...prev, 
            fallbackAttempted: true,
            allAvailablePreviews: allPreviews,
            fallbackResults: { allError, count: allPreviews?.length || 0 }
          }));
        }
        
        const debugData = {
          queryAttempted: queryUsed,
          primaryField: 'slug',
          error: finalError,
          dataReceived: finalData,
          dataCount: finalData?.length || 0,
          totalCount: count,
          enhancedDebugging: true,
          buildVersion: BUILD_VERSION,
          supabaseUrl: SUPABASE_URL
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (finalError) {
          console.error('❌ Supabase error (ENHANCED DEBUG):', finalError);
          setError(`Supabase Error: ${finalError.message || 'Unknown database error'}`);
          setLoading(false);
          return;
        }

        if (finalData && finalData.length > 0) {
          console.log('✅ Found post (ENHANCED DEBUG):', finalData[0]);
          setPost(finalData[0]);
        } else {
          console.log('⚠️ No posts found for slug:', slug);
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error (ENHANCED DEBUG):', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        setDebugInfo(prev => ({ ...prev, finalError: err }));
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
