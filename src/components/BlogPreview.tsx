
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  hero_image_url: string;
  author: string | null;
  created_at: string;
  slug: string;
};

const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, excerpt, hero_image_url, author, created_at, slug')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching blog posts:', error);
          toast.error("Failed to load latest blog posts");
          // Use fallback posts
          useFallbackPosts();
          return;
        }

        if (data && data.length > 0) {
          console.log('Fetched blog posts:', data);
          setBlogPosts(data);
        } else {
          console.log('No blog posts found, using fallbacks');
          useFallbackPosts();
        }
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching blog posts:', err);
        useFallbackPosts();
        setLoading(false);
      }
    };

    const useFallbackPosts = () => {
      setBlogPosts([
        {
          id: '1',
          title: "The Wild Roads of Tuscany",
          excerpt: "We wandered olive groves, watched the sunrise mist roll over ancient stone, and learned that getting lost is a gift…",
          hero_image_url: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&q=80",
          author: "Michael",
          created_at: new Date().toISOString(),
          slug: "#"
        },
        {
          id: '2',
          title: "Picnic on Lake Geneva",
          excerpt: "A gentle afternoon with sandwiches, a sketchbook, and singing birds on the sparkling water's edge.",
          hero_image_url: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=600&q=80",
          author: "Gesy",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          slug: "#"
        },
        {
          id: '3',
          title: "Urban Wanders, Berlin",
          excerpt: "Exploring Berlin's stories—brick arcades, street murals, and late-night laughs over doner kebabs.",
          hero_image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80",
          author: "Michael",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          slug: "#"
        }
      ]);
    };

    fetchBlogPosts();
  }, []);

  // Format date like "July 14, 2024"
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 lg:py-16">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-primary animate-slide-in">
        Latest <span className="text-accent">// Blog Posts</span>
      </h2>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading blog posts...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8">
            {blogPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/posts/${post.slug}`} 
                className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col animate-fade-in hover:shadow-lg transition"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={post.hero_image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                    loading="lazy" 
                  />
                </div>
                <div className="p-6 flex flex-col h-full">
                  <div className="text-sm text-gray-500 mb-1">
                    {post.author && <span className="font-medium">{post.author}</span>}
                    {post.author && post.created_at && <span className="mx-1">•</span>}
                    {post.created_at && <span>{formatDate(post.created_at)}</span>}
                  </div>
                  <h3 className="font-semibold text-xl font-playfair mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/blog">
              <button className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3 rounded-full shadow transition">
                See More
              </button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default BlogPreview;
