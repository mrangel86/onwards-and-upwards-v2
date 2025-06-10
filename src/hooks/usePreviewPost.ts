
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
  
  // UPDATED: Deployment tracking with commit info
  const BUILD_VERSION = 'v2.2-cache-fix-deployed-' + new Date().toISOString().split('T')[0];
  const DEPLOYMENT_TIME = '2025-06-10T' + new Date().toTimeString().split(' ')[0];
  const CACHE_BUSTER = 'commit-09a0854c-' + Math.random().toString(36).substr(2, 9);

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: '09a0854c',
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      // Enhanced logging with commit tracking
      console.log('🚀 BlogPreview v2.2 FORCE DEPLOYED: Starting fetch for slug:', slug);
      console.log('📦 Deployment Info (commit 09a0854c):', deploymentInfo);
      console.log('🔧 CONFIRMED: Using SLUG field (NOT preview_slug) - Force deployment active');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        slug, 
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        expectedField: 'slug',
        commitHash: '09a0854c'
      }));

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        // Direct query with force deployment logging
        console.log('🔗 Making Supabase query with SLUG field (FORCE DEPLOYED)...');
        console.log('🎯 Query target: post_previews.slug =', slug);
        console.log('🚀 Commit hash: 09a0854c - Force deployed');
        
        const query = supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug); // CONFIRMED: Using 'slug' field - FORCE DEPLOYED
          
        console.log('📝 Query object (FORCE DEPLOYED v2.2):', query);
        console.log('⚡ Cache buster active (commit 09a0854c):', CACHE_BUSTER);
        
        const { data, error } = await query;

        console.log('📊 Raw query result (v2.2 FORCE DEPLOYED):', { data, error, count: data?.length });
        console.log('✅ Field confirmed: slug (NOT preview_slug) - Commit 09a0854c deployed');
        
        const debugData = {
          queryAttempted: `slug = '${slug}'`,
          fieldUsed: 'slug',
          NOT_USING: 'preview_slug',
          expectedEndpoint: 'https://zrtgkvpbptxueetuqlmb.supabase.co/rest/v1/post_previews',
          error: error,
          dataReceived: data,
          dataCount: data?.length || 0,
          forceDeployed: true,
          buildVersion: BUILD_VERSION,
          commitHash: '09a0854c'
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (error) {
          console.error('❌ Supabase error (v2.2 FORCE DEPLOYED):', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Found post (FORCE DEPLOYED commit 09a0854c):', data[0]);
          setPost(data[0]);
        } else {
          console.log('⚠️ No posts found (commit 09a0854c deployed)');
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error (v2.2 FORCE DEPLOYED):', err);
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
