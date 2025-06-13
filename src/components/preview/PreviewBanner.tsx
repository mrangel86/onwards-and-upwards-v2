
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
      bgColor: 'bg-red-50 border-red-200 text-red-800',
      icon: '👁️',
      title: 'Preview Mode v3.0: this is a preview of your post before publishing',
      message: 'Loading...',
      details: `Build: ${buildVersion} | Cache: ${cacheBuster}`
    },
    error: {
      bgColor: 'bg-red-50 border-red-200 text-red-800',
      icon: '❌',
      title: 'Preview Error v3.0',
      message: 'Error loading preview',
      details: `Build: ${buildVersion} | Cache: ${cacheBuster}`
    },
    'not-found': {
      bgColor: 'bg-red-50 border-red-200 text-red-800',
      icon: '⚠️',
      title: 'No Preview Found v3.0',
      message: 'Preview not found',
      details: `Build: ${buildVersion} | Cache: ${cacheBuster}`
    },
    success: {
      bgColor: 'bg-red-50 border-red-200 text-red-800',
      icon: '👁️',
      title: 'Preview Mode v3.0: this is a preview of your post before publishing',
      message: `Preview loaded successfully • ${slug ? `${slug}` : ''}`,
      details: `✅ Using preview_posts table with 'slug' field | Build: ${buildVersion}`
    }
  };

  const config = bannerConfig[type];

  return (
    <div className={`${config.bgColor} border-b p-3 text-center`}>
      <p>
        {config.icon} <strong>{config.title}</strong>
        {config.message && type !== 'success' && ` — ${config.message}`}
        {slug && type === 'success' && (
          <code className="ml-2 bg-red-100 px-2 py-1 rounded text-sm">{slug}</code>
        )}
      </p>
      <p className="text-xs mt-1">
        {config.details}
      </p>
    </div>
  );
};

export default PreviewBanner;
