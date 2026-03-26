import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Post = Database['public']['Tables']['posts']['Row'];
type PreviewPost = Database['public']['Tables']['preview_posts']['Row'];

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [previews, setPreviews] = useState<PreviewPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingPreviews, setLoadingPreviews] = useState(true);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast({ title: 'Failed to load posts', variant: 'destructive' });
        else setPosts(data ?? []);
        setLoadingPosts(false);
      });

    supabase
      .from('preview_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) toast({ title: 'Failed to load preview posts', variant: 'destructive' });
        else setPreviews(data ?? []);
        setLoadingPreviews(false);
      });
  }, []);

  const togglePublished = async (post: Post) => {
    const { error } = await supabase
      .from('posts')
      .update({ published: !post.published })
      .eq('id', post.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
      toast({ title: post.published ? 'Post unpublished' : 'Post published' });
    }
  };

  const publishPreview = async (preview: PreviewPost) => {
    // Upsert into posts using the preview data
    const { error } = await supabase.from('posts').upsert({
      slug: preview.slug,
      title: preview.title,
      author: preview.author,
      content: preview.content,
      content_url: preview.content_url,
      excerpt: preview.excerpt,
      hero_image_url: preview.hero_image_url,
      location: preview.location,
      notion_id: preview.notion_id,
      type: preview.type,
      featuredhero: preview.featuredhero,
      gallery_description: preview.gallery_description,
      published: true,
    }, { onConflict: 'slug' });

    if (error) {
      toast({ title: 'Publish failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `"${preview.title}" is now live!` });
      // Refresh posts list
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-xl font-bold text-primary">Onwards & Upwards — Admin</h1>
          <p className="text-xs text-gray-500 mt-0.5">Post management</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-accent hover:underline">View site →</Link>
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">

        {/* Live Posts */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Posts</h2>
          {loadingPosts ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-500">No posts found.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {posts.map(post => (
                <div key={post.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.type} · {formatDate(post.created_at)}
                      {post.slug && (
                        <> · <Link to={`/posts/${post.slug}`} className="text-accent hover:underline" target="_blank">view</Link></>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => togglePublished(post)}
                    className={`flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                      post.published
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Preview Posts */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Preview Posts</h2>
          <p className="text-sm text-gray-500 mb-4">
            These are drafts synced from Notion. Click "Publish to Live" to make one live on the site.
          </p>
          {loadingPreviews ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : previews.length === 0 ? (
            <p className="text-sm text-gray-500">No preview posts found.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {previews.map(preview => (
                <div key={preview.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{preview.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {preview.type} · {formatDate(preview.created_at)}
                      <> · <Link to={`/preview-posts/${preview.slug}`} className="text-accent hover:underline" target="_blank">preview</Link></>
                    </p>
                  </div>
                  <button
                    onClick={() => publishPreview(preview)}
                    className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full border border-accent bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    Publish to Live
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
