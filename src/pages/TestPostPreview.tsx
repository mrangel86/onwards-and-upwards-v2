
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { supabase } from "@/integrations/supabase/client";

const PostCard = ({ post }: { post: any }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  if (!post) return <div className="p-6 bg-gray-100 rounded-lg">Post not found</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-10">
      <h2 className="font-playfair text-2xl font-bold text-primary mb-2">{post.title}</h2>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-accent">by {post.author || "Anonymous"}</span>
        <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
      </div>
      {post.hero_image_url && (
        <img 
          src={post.hero_image_url} 
          alt={post.title} 
          className="w-full h-60 object-cover rounded-xl shadow mb-6" 
        />
      )}
      <p className="text-gray-700 mb-4">{post.excerpt}</p>
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-2">Content Preview:</h3>
        <div 
          className="prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: post.content?.substring(0, 300) + "..." || "No content available" }} 
        />
      </div>
    </div>
  );
};

const TestPostPreview = () => {
  const slugs = ["sanrio-puroland-cutest-place-earth", "lost-translation"];
  
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['testPosts', slugs],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .in('slug', slugs);
        
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-8">Test Posts Preview</h1>
        
        {isLoading ? (
          <p className="text-center py-10">Loading posts...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Error loading posts: {(error as Error).message}</p>
        ) : posts && posts.length > 0 ? (
          <>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        ) : (
          <p className="text-center py-10">No posts found with the specified slugs</p>
        )}
      </main>
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default TestPostPreview;
