
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import BlogCard from "./BlogCard";

const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, excerpt, hero_image_url, author, created_at, content, slug')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Error fetching blog posts:', error);
          return;
        }
        
        setPosts(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching blog posts:', err);
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Create excerpt from content if not provided
  const createExcerpt = (post) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content) {
      // Strip HTML tags and limit to ~120 chars
      const strippedContent = post.content.replace(/<[^>]*>/g, '');
      return strippedContent.length > 120 
        ? `${strippedContent.substring(0, 120)}...` 
        : strippedContent;
    }
    
    return "Click to see more about this adventure...";
  };
  
  // Navigate to blog page and scroll to top
  const handleSeeMoreClick = () => {
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 lg:py-16">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-8">
        Latest <span className="text-accent">// Blog Posts</span>
      </h2>
      
      {loading ? (
        <div className="text-center mb-10">
          <p className="text-gray-500">Loading latest posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10">
          {posts.map((post) => (
            <Link to={`/posts/${post.slug}`} key={post.id} className="no-underline">
              <BlogCard 
                title={post.title}
                author={post.author || "Anonymous"}
                image={post.hero_image_url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80"}
                excerpt={createExcerpt(post)}
                date={formatDate(post.created_at)}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mb-10">
          <p className="text-gray-500">No posts available.</p>
        </div>
      )}
      
      <div className="mt-10 text-center">
        <button 
          onClick={handleSeeMoreClick}
          className="border-2 border-accent text-accent hover:bg-black hover:text-white hover:border-white font-semibold px-8 py-3 rounded-full shadow transition"
        >
          See More
        </button>
      </div>
    </section>
  );
};

export default BlogPreview;
