
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

      {/* Bottom Preview Banner - Pastel Red */}
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded text-sm">
        <div className="font-bold text-red-800 mb-2">✅ Your post is NOT live, this is just a preview of your post! In order to make your post live, you must publish it.</div>
        <div className="text-red-700 space-y-1">
          <div>Preview System v3.0 successfully loaded from preview_posts table</div>
          <div>ID: <code>{post.id}</code> • Type: <code>{post.type}</code></div>
          <div>Field Used: <code className="bg-red-100 px-1 rounded">slug</code> (clean system)</div>
          <div>Build: <code className="bg-red-100 px-1 rounded">{buildVersion}</code></div>
          <div className="text-xs mt-2 text-red-600">🚀 Preview System v3.0 - Clean deployment with updated banners</div>
        </div>
      </div>
    </main>
  );
};

export default PreviewContent;
