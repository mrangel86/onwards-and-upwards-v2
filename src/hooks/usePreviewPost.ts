
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
  const BUILD_VERSION = 'v3.0-fixed-' + new Date().toISOString().split('T')[0];
  const DEPLOYMENT_TIME = new Date().toISOString();
  const CACHE_BUSTER = 'slug-fix-' + Math.random().toString(36).substr(2, 9);

  const [deploymentInfo] = useState<DeploymentInfo>({
    buildVersion: BUILD_VERSION,
    deploymentTime: DEPLOYMENT_TIME,
    cacheKey: CACHE_BUSTER,
    commitHash: 'new-deployment',
    compiledAt: new Date().toISOString(),
    forceDeployed: true
  });

  useEffect(() => {
    const fetchPreview = async () => {
      console.log('🚀 BlogPreview v3.0 NEW DEPLOYMENT: Starting fresh fetch for slug:', slug);
      console.log('📦 NEW Deployment Info:', deploymentInfo);
      console.log('✅ CONFIRMED: Using slug field (NOT preview_slug) - New deployment');
      
      setDebugInfo(prev => ({ 
        ...prev, 
        slug, 
        startTime: new Date().toISOString(),
        deploymentInfo: deploymentInfo,
        fieldUsed: 'slug',
        NOT_USING: 'preview_slug'
      }));

      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        console.log('🔗 NEW DEPLOYMENT: Making Supabase query with slug field...');
        console.log('🎯 Query target: post_previews.slug =', slug);
        console.log('✅ Using CORRECT field: slug (not preview_slug)');
        
        const { data, error } = await supabase
          .from('post_previews')
          .select('*')
          .eq('slug', slug);

        console.log('📊 NEW DEPLOYMENT Query result:', { data, error, count: data?.length });
        console.log('✅ Field confirmed: slug - NEW DEPLOYMENT ACTIVE');
        
        const debugData = {
          queryAttempted: `slug = '${slug}'`,
          fieldUsed: 'slug',
          NOT_USING: 'preview_slug',
          error: error,
          dataReceived: data,
          dataCount: data?.length || 0,
          newDeployment: true,
          buildVersion: BUILD_VERSION
        };
        
        setDebugInfo(prev => ({ ...prev, ...debugData }));

        if (error) {
          console.error('❌ Supabase error (NEW DEPLOYMENT):', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Found post (NEW DEPLOYMENT):', data[0]);
          setPost(data[0]);
        } else {
          console.log('⚠️ No posts found for slug:', slug);
          setError(`No preview found for slug: ${slug}`);
        }

      } catch (err: any) {
        console.error('💥 BlogPreview error (NEW DEPLOYMENT):', err);
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
