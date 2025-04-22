
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import BlogCard from "@/components/BlogCard";

// Placeholder posts, newest first.
const posts = [
  {
    title: "Spring in Provence",
    author: "Michael",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80",
    excerpt: "Lavender fields, breezy mornings, and tiny feet running down cobblestone lanes. Spring brought new colors—and new memories—for our family.",
  },
  {
    title: "Rainy Days in Porto",
    author: "Gesy",
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=700&q=80",
    excerpt: "Grey skies and golden pastries. Sometimes, a rainy day is the best excuse for board games, baby giggles, and slow sips by the window.",
  },
  {
    title: "Baby’s First Snowfall",
    author: "Michael & Gesy",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&q=80",
    excerpt: "Tucked into wool, cheeks pink from cold—Victoria's first snow: wide eyes and laughter we're still replaying in our hearts.",
  },
  {
    title: "Market Days in Florence",
    author: "Gesy",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=700&q=80",
    excerpt: "The sounds, the colors, the flavors—market mornings are pure joy for Victoria (and her grown-up entourage).",
  },
  {
    title: "Finding Stillness in Vienna",
    author: "Michael",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=700&q=80",
    excerpt: "Grand cafes, velvet evenings, and stolen hours in art museums. Vienna taught us patience, one blissful day at a time.",
  },
];

const PAGE_SIZE = 3;
const BlogIndex = () => {
  // In future, fetch more posts from CMS/database as user scrolls
  const [visiblePosts, setVisiblePosts] = useState(PAGE_SIZE);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight + 50 >= el.scrollHeight && visiblePosts < posts.length) {
      setVisiblePosts((v) => Math.min(posts.length, v + PAGE_SIZE));
    }
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main
        className="flex-1 max-w-6xl mx-auto w-full px-4 pb-16 pt-10 overflow-y-auto"
        style={{ minHeight: "80vh" }}
        onScroll={onScroll}
        tabIndex={0}
      >
        {/* Header */}
        <header className="mb-5 md:mb-10">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2 text-primary">Blog</h1>
          <p className="mb-7 text-gray-700 md:text-lg max-w-2xl">Stories from the road, city corners, rainy afternoons—and all the little moments that make our journey memorable.</p>
        </header>
        {/* Filter Bar */}
        <FilterBar />
        {/* Blog grid */}
        <section>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-7 md:gap-10">
            {posts.slice(0, visiblePosts).map((post, idx) => (
              <BlogCard key={idx} {...post} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
