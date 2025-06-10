
import React from 'react';

interface PreviewBannerProps {
  type: 'loading' | 'error' | 'not-found' | 'success';
  slug?: string;
  buildVersion: string;
  cacheBuster: string;
}

const PreviewBanner: React.FC<PreviewBannerProps> = ({ type, slug, buildVersion, cacheBuster }) => {
  const bannerConfig = {
    loading: {
      bgColor: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: '👁️',
      title: 'Preview Mode v2.2 FORCE DEPLOYED',
      message: 'Loading...',
      details: `Commit: 09a0854c | Cache: ${cacheBuster}`
    },
    error: {
      bgColor: 'bg-red-50 border-red-200 text-red-800',
      icon: '❌',
      title: 'Preview Error v2.2 FORCE DEPLOYED',
      message: '',
      details: `Build: ${buildVersion} | Commit: 09a0854c | Cache: ${cacheBuster}`
    },
    'not-found': {
      bgColor: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚠️',
      title: 'No Preview Found v2.2 FORCE DEPLOYED',
      message: '',
      details: `Build: ${buildVersion} | Commit: 09a0854c | Cache: ${cacheBuster}`
    },
    success: {
      bgColor: 'bg-green-50 border-green-200 text-green-800',
      icon: '👁️',
      title: 'Preview Mode v2.2 FORCE DEPLOYED',
      message: `Post Found! • ${slug ? `${slug}` : ''}`,
      details: `✅ FORCE DEPLOYED • Commit: 09a0854c • Build: ${buildVersion} • Using 'slug' field`
    }
  };

  const config = bannerConfig[type];

  return (
    <div className={`${config.bgColor} border-b p-3 text-center`}>
      <p>
        {config.icon} <strong>{config.title}</strong>
        {config.message && ` — ${config.message}`}
        {slug && type === 'success' && (
          <code className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">{slug}</code>
        )}
      </p>
      <p className="text-xs mt-1">
        {config.details}
      </p>
    </div>
  );
};

export default PreviewBanner;
