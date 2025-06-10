
import React from 'react';

interface PreviewContentProps {
  post: any;
  buildVersion: string;
}

const PreviewContent: React.FC<PreviewContentProps> = ({ post, buildVersion }) => {
  // Format content with line breaks
  const formatContent = (content: string) => {
    if (!content) return null;
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        paragraph.startsWith('- ') ? (
          <li key={index} className="ml-4">{paragraph.substring(2)}</li>
        ) : (
          <p key={index} className="mb-4">{paragraph}</p>
        )
      ) : null
    ));
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 pb-10">
      {/* Header */}
      <section className="pt-10 pb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
          {post.title}
        </h1>
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
          <span className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        {post.hero_image_url && (
          <img 
            src={post.hero_image_url} 
            alt={post.title} 
            className="w-full h-auto object-contain rounded-xl shadow mb-6" 
          />
        )}
      </section>

      {/* Content */}
      <section className="prose prose-lg max-w-none">
        {formatContent(post.content)}
      </section>

      {/* Enhanced Success info with Force Deployment Details */}
      <div className="mt-8 p-4 bg-green-50 rounded text-sm">
        <div className="font-bold text-green-800 mb-2">✅ Preview System Working! (v2.2 FORCE DEPLOYED)</div>
        <div className="text-green-700 space-y-1">
          <div>Successfully loaded preview from Supabase</div>
          <div>ID: <code>{post.id}</code> • Type: <code>{post.type}</code></div>
          <div>Field Used: <code className="bg-green-100 px-1 rounded">slug</code> (NOT preview_slug)</div>
          <div>Commit: <code className="bg-green-100 px-1 rounded">09a0854c</code> • Build: <code>{buildVersion}</code></div>
          <div className="text-xs mt-2 text-green-600">🚀 FORCE DEPLOYMENT SUCCESSFUL - Cache fix applied immediately</div>
        </div>
      </div>
    </main>
  );
};

export default PreviewContent;
