
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type FeaturedVideo = {
  url: string;
  title: string | null;
  caption: string | null;
  post_slug: string | null;
};

const extractYoutubeId = (url: string) => {
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
};

const FeaturedVideo = () => {
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        console.log('Fetching featured video...');
        // Fetch the featured video from media table
        const { data, error } = await supabase
          .from('media')
          .select('url, title, caption, post_slug')
          .eq('media_type', 'video')
          .eq('is_featured_video_section', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching featured video:', error);
          if (error.code !== 'PGRST116') { // No rows returned (non-error case)
            console.error('Error fetching featured video:', error);
          }
          setFeaturedVideo({
            url: "a3ICNMQW7Ok", // Default video ID
            title: "Chasing Sunsets: Chapter 4",
            caption: "Moments from our month crossing mountain passes, discovering hidden lakes, and meeting kindred spirits along the way.",
            post_slug: null
          });
          setLoading(false);
          return;
        }

        console.log('Featured video data:', data);
        setFeaturedVideo(data);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching featured video:', err);
        setLoading(false);
      }
    };

    fetchFeaturedVideo();
  }, []);
  
  // Navigate to video gallery and scroll to top
  const handleSeeMoreClick = () => {
    navigate('/gallery/videos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading featured video...</p>
        </div>
      </section>
    );
  }

  if (!featuredVideo) return null;

  const videoId = extractYoutubeId(featuredVideo.url);
  console.log('Using video ID:', videoId);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        {/* Text Content - Left Side */}
        <div className="flex-1 md:flex-[0.4] order-2 md:order-1">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-3 animate-fade-in">
            Featured <span className="text-accent">// Video</span>
          </h2>
          
          {featuredVideo.post_slug ? (
            <Link to={`/posts/${featuredVideo.post_slug}`}>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 hover:text-accent transition">
                {featuredVideo.title || 'Featured Video'}
              </h3>
            </Link>
          ) : (
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">
              {featuredVideo.title || 'Featured Video'}
            </h3>
          )}
          
          <p className="mb-4 text-gray-600">{featuredVideo.caption || 'Watch our latest adventure.'}</p>
        </div>
        
        {/* Video - Right Side */}
        <div className="flex-1 md:flex-[0.6] flex justify-center order-1 md:order-2 w-full">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              title={featuredVideo.title || 'Featured Video'}
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={handleSeeMoreClick}
          className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3 rounded-full shadow transition"
        >
          See More
        </button>
      </div>
    </section>
  );
};

export default FeaturedVideo;
