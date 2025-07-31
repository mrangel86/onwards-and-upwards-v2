import React from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import OtherPostsGrid from "@/components/OtherPostsGrid";
import ImageCollage from "@/components/ImageCollage";

// Placeholder data simulating CMS-driven content
const blog = {
  title: "Spring in Provence",
  author: "Michael",
  hero: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  mapImg: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80",
  content: [
    {
      type: "block",
      align: "left",
      text: "We arrived as lavender was just waking up—a pale purple haze rolling to the horizon—and the air already alive with honeybees. The first days were gentle. Coffee on the porch, baby hands curled around biscuits, a thousand new scents.",
      img: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=700&q=80",
    },
    {
      type: "block",
      align: "right",
      text: "Afternoons in the market were our favorite. Gesy practiced her French over strawberries while Michael taught Victoria to say 'bonjour'. We bought far too many cakes and never regretted a single one.",
      img: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=700&q=80",
    },
    {
      type: "full",
      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=80",
    },
    {
      type: "block",
      align: "left",
      text: "One afternoon, rain arrived—fat, sudden drops. Instead of running inside, we stayed. There is a special kind of magic in the sound of laughter echoing off stone walls under a Provencal sky.",
      img: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=700&q=80",
    },
    {
      type: "collage",
      images: [
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80",
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&q=80",
      ],
    },
    {
      type: "block",
      align: "right",
      text: "We left with boots muddied, hearts full. Victoria fell asleep in the car, clutching a wildflower. It may have been the best spring of our lives—at least until the next one.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&q=80",
    },
  ],
};

// Mock related posts data
const relatedPosts = [
  {
    id: "1",
    title: "Summer in Barcelona",
    author: "Gesy",
    hero_image_url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=700&q=80",
    excerpt: "The warm Mediterranean breeze, narrow streets of the Gothic Quarter, and endless tapas...",
    created_at: "2024-03-15T10:00:00.000Z",
    slug: "summer-barcelona"
  },
  {
    id: "2",
    title: "Winter in Switzerland",
    author: "Michael",
    hero_image_url: "https://images.unsplash.com/photo-1528214170403-d48e1087980d?w=700&q=80",
    excerpt: "Snow-capped peaks, cozy chalets, and the most delicious hot chocolate you've ever tasted...",
    created_at: "2024-02-20T10:00:00.000Z",
    slug: "winter-switzerland"
  },
  {
    id: "3",
    title: "Autumn in New England",
    author: "Michael & Gesy",
    hero_image_url: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=700&q=80",
    excerpt: "Vibrant red and orange leaves, pumpkin patches, and road trips through charming towns...",
    created_at: "2024-01-10T10:00:00.000Z",
    slug: "autumn-new-england"
  }
];

const SectionDivider = () => (
  <div className="my-14 flex justify-center">
    <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-accent via-peach to-accent opacity-65"></span>
  </div>
);

const BlogBlock = ({ align, text, img }: { align: "left" | "right", text: string, img: string }) => (
  <div className={`flex flex-col md:flex-row ${align === "left" ? "" : "md:flex-row-reverse"} items-center gap-6 md:gap-12 mb-14`}>
    <div className="flex-1 text-gray-800 text-lg font-inter">{text}</div>
    <img src={img} className="flex-1 rounded-xl shadow-md w-full md:max-w-md object-cover" alt="Blog" loading="lazy" />
  </div>
);

const FullImage = ({ src }: { src: string }) => (
  <div className="w-full my-8">
    <img src={src} className="w-full object-cover rounded-xl shadow" alt="" loading="lazy" />
  </div>
);

const BlogPostTemplate = () => {
  const navbarData = {
    logo: {
      url: "/",
      src: "/placeholder.svg",
      alt: "Onwards & Upwards",
      title: "ONWARDS & UPWARDS",
    },
    menu: [
      { title: "Home", url: "/" },
      {
        title: "Gallery",
        url: "#",
        items: [
          {
            title: "Photography",
            description: "Glimpses of life, frame by frame",
            url: "/gallery/photos",
          },
          {
            title: "Videography", 
            description: "Little films from the road",
            url: "/gallery/videos",
          },
        ],
      },
      { title: "Blog", url: "/blog" },
      { title: "About Us", url: "/about" },
    ],
    auth: {
      login: { text: "Newsletter", url: "/newsletter" },
      signup: { text: "", url: "#" },
    },
  };

  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-10">
      {/* Header */}
      <section className="pt-10 pb-6">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">{blog.title}</h1>
        <img src={blog.hero} alt="hero" className="w-full h-60 md:h-80 object-cover rounded-xl shadow mb-6" />
      </section>
      {/* Optional Map Block */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="flex-1 text-center md:text-left text-lg text-gray-700">
          The winding roads led us to places maps hadn't even named. Every turn was a new discovery—and a fresh story.
        </div>
        <div className="flex-1 max-w-md">
          <img src={blog.mapImg} alt="Map placeholder" className="w-full h-56 object-cover rounded-lg bg-gray-100 border" />
        </div>
      </section>
      {/* Content blocks */}
      {blog.content.map((block, idx) => {
        if (block.type === "block") {
          // Alternating left/right
          return <BlogBlock key={idx} align={block.align as "left" | "right"} text={block.text} img={block.img} />;
        }
        if (block.type === "full") {
          return <FullImage key={idx} src={block.img} />;
        }
        if (block.type === "collage") {
          return <ImageCollage key={idx} images={block.images as string[]} />;
        }
        return null;
      })}
      {/* Section Divider */}
      <SectionDivider />
      {/* Other Posts - Now properly providing the required posts prop */}
      <OtherPostsGrid posts={relatedPosts} />
    </main>
    <NewsletterSignup />
    <Footer />
    </div>
  );
};

export default BlogPostTemplate;
