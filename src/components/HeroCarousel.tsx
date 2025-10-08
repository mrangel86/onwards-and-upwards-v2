
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type FeaturedPost = {
  title: string;
  excerpt: string;
  hero_image_url: string;
  slug: string;
}

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured posts from Supabase
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        // First fetch the featured posts
        const { data, error } = await supabase
          .from('posts')
          .select('title, excerpt, hero_image_url, slug')
          .eq('featuredhero', true)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching featured posts:', error);
          return;
        }

        if (data && data.length > 0) {
          setFeaturedPosts(data);
        } else {
          // Fallback to default slides if no featured posts
          setFeaturedPosts([
            {
              hero_image_url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600&q=80",
              title: "Stories from the Road",
              excerpt: "Discover our favorite moments across Europe.",
              slug: "#"
            },
            {
              hero_image_url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&q=80",
              title: "Nature's Grandeur",
              excerpt: "Waves, forests, mountains & wild encounters.",
              slug: "#"
            },
            {
              hero_image_url: "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/legacy-posts/Great-Wall-20140503-48.jpg",
              title: "Family Journeys",
              excerpt: "Traveling together, one adventure at a time.",
              slug: "#"
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching featured posts:', err);
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % featuredPosts.length);
  const prev = () => setCurrent((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);

  // Auto advance slides
  useEffect(() => {
    if (featuredPosts.length <= 1) return;
    
    const timer = setTimeout(() => {
      next();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [current, featuredPosts.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading featured stories...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      {featuredPosts.map((post, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.hero_image_url})` }}
          >
            <div className="w-full h-full flex items-center justify-center text-white bg-black/40 bg-blend-multiply">
              <div className="max-w-2xl mx-auto text-center px-4">
                <h1 className="font-playfair text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                  {post.title}
                </h1>
                <div className="w-16 h-px bg-white/60 mx-auto mb-4" />
                <p className="text-lg lg:text-2xl mb-6 drop-shadow animate-fade-in line-clamp-2">
                  {post.excerpt || "Read more about our journey..."}
                </p>
                <Link to={`/posts/${post.slug}`} className="inline-block">
                  <button className="bg-accent hover:bg-black hover:border-white border border-accent text-white font-semibold px-6 py-3 rounded-full shadow-lg transition animate-fade-in">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredPosts.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-3 h-3 rounded-full bg-white/40", i === current && "bg-accent border-2 border-white")}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
