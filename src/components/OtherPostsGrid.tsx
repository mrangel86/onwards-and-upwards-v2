
import React from "react";
import BlogCard from "./BlogCard";

const otherPosts = [
  {
    title: "Quiet Corners of Lyon",
    author: "Michael",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=500&q=80",
    excerpt: "Discovering hidden bakeries, riverside paths, and the sweet art of slow mornings in France—one wander at a time.",
  },
  {
    title: "Family Sunsets in Spain",
    author: "Gesy",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&q=80",
    excerpt: "Chasing the sun across Spanish horizons, with plenty of giggles, bread crumbs, and baby squeals along the coast.",
  },
  {
    title: "Winter Laughs in Zurich",
    author: "Michael & Gesy",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&q=80",
    excerpt: "Bundled up. Warm lights. The soft hush of snow—and the magic of seeing it anew through our daughter’s eyes.",
  },
];

const OtherPostsGrid = () => (
  <section className="max-w-5xl mx-auto px-4 py-10">
    <h2 className="font-playfair text-2xl font-bold mb-8 text-primary">Other Posts</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {otherPosts.map((post) => (
        <BlogCard key={post.title} {...post} />
      ))}
    </div>
  </section>
);

export default OtherPostsGrid;
