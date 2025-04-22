
import React from "react";

const blogPosts = [
  {
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&q=80",
    title: "The Wild Roads of Tuscany",
    excerpt: "We wandered olive groves, watched the sunrise mist roll over ancient stone, and learned that getting lost is a gift…",
    url: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=600&q=80",
    title: "Picnic on Lake Geneva",
    excerpt: "A gentle afternoon with sandwiches, a sketchbook, and singing birds on the sparkling water’s edge.",
    url: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80",
    title: "Urban Wanders, Berlin",
    excerpt: "Exploring Berlin’s stories—brick arcades, street murals, and late-night laughs over doner kebabs.",
    url: "#",
  }
];

const BlogPreview = () => (
  <section className="max-w-7xl mx-auto px-4 py-14 lg:py-20">
    <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-primary animate-slide-in">Latest <span className="text-accent">// The Blog</span></h2>
    <div className="flex flex-col md:flex-row gap-8">
      {blogPosts.map((post, i) => (
        <div key={i} className="flex-1 bg-white rounded-xl shadow overflow-hidden flex flex-col animate-fade-in">
          <img src={post.image} alt={post.title} className="w-full h-48 object-cover" loading="lazy" />
          <div className="p-6 flex flex-col h-full">
            <h3 className="font-semibold text-xl font-playfair mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
            <a href={post.url} className="inline-block mt-auto">
              <button className="bg-accent hover:bg-primary text-white font-semibold px-6 py-2 rounded-full shadow transition">
                Read More
              </button>
            </a>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default BlogPreview;
