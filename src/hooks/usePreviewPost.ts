
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
  
  // NEW DEPLOYMENT: Fresh build with correct slug field implementation
  const BUILD_VERSION = 'v4.0-routing-fix-' + new Date().toISOString().split('T')[0];
  const DEPLOYMENT_TIME = new Date().toISOString();
  const CACHE_BUSTER = 'routing-fix-' + Math.random().toString(36).substr(2, 9);

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: 'routing-fix-deployment',
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🚀 BlogPreview v4.0 ROUTING FIX: Starting fresh fetch for slug:', slug);
      console.log('📦 Deployment Info:', deploymentInfo);
      console.log('🔧 Using slug field (NOT preview_slug) - Routing fix deployment');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        slug, 
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        fieldUsed: 'slug',
        NOT_USING: 'preview_slug'
      }));

      if (!slug) {
        console.log('❌ No slug provided to usePreviewPost');
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 ROUTING FIX: Making Supabase query with slug field...');
        console.log('🎯 Query target: post_previews.slug =', slug);
        console.log('📊 Supabase URL:', supabase.supabaseUrl);
        console.log('🔑 Using correct field: slug (not preview_slug)');
        
        const { data, error, count } = await supabase
          .from('post_previews')
          .select('*', { count: 'exact' })
          .eq('slug', slug);

        console.log('📊 ROUTING FIX Query result:', { 
          data, 
          error, 
          count,
          dataLength: data?.length,
          supabaseUrl: supabase.supabaseUrl 
        });
        
        const debugData = {
          queryAttempted: `slug = '${slug}'`,
          fieldUsed: 'slug',
          NOT_USING: 'preview_slug',
          error: error,
          dataReceived: data,
          dataCount: data?.length || 0,
          totalCount: count,
          routingFix: true,
          buildVersion: BUILD_VERSION,
          supabaseUrl: supabase.supabaseUrl
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (error) {
          console.error('❌ Supabase error (ROUTING FIX):', error);
          setError(`Supabase Error: ${error.message || 'Unknown database error'}`);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          console.log('✅ Found post (ROUTING FIX):', data[0]);
          setPost(data[0]);
        } else {
          console.log('⚠️ No posts found for slug:', slug);
          console.log('💡 Total posts in post_previews:', count);
          setError(`No preview found for slug: ${slug} (Found ${count} total previews in database)`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error (ROUTING FIX):', err);
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
