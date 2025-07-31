import React from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

// Placeholders
const familyImg = "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/website-images//about-us-header.jpg";
const michaelImg = "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/website-images//about-us-michael.jpg";
const gesyImg = "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/website-images//about-us-gesy.jpg";
const victoriaImg = "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/website-images//about-us-victoria.jpg";

const AboutUs = () => {
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
      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto pt-14 md:pt-20 pb-10 px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary text-center mb-3">About Us</h1>
          <div className="text-lg text-muted-foreground text-center mb-8 font-medium">
            A family of three exploring Europe one adventure at a time
          </div>
        </section>

        {/* FULL WIDTH FAMILY SECTION */}
        <section className="w-full bg-[#F9F6F1] py-8 md:py-12 mb-8">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="w-full aspect-[4/1.7] md:aspect-[3/1.2] overflow-hidden flex items-center justify-center mb-5">
              <img
                src={familyImg}
                alt="Our family portrait placeholder"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-base md:text-lg text-gray-900 max-w-3xl mx-auto text-center">
              We're Michael, Gesy, and little Victoria—three travelers on a slow journey across Europe, seeking deeper connection, fresh perspectives, and a world of new experiences together. Leaving the familiar behind, we hope to savor the little moments, discover beauty in the everyday, and write a family story of adventure, resilience, and joy. Thanks for joining us as we wander onwards & upwards.
            </p>
          </div>
        </section>

        {/* ABOUT MICHAEL */}
        <section className="max-w-5xl mx-auto w-full py-8 md:py-14 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-7 md:gap-10 bg-[#F5F5F6] rounded-xl border border-gray-200 shadow">
            <div className="flex-1 flex flex-col justify-center py-7 px-4 md:px-8">
              <h2 className="text-xl font-semibold text-primary mb-3">About Michael</h2>
              <p className="mb-3 text-base text-gray-800">
                Michael is the steady anchor of our family—a curious, coffee-fueled explorer, tech enthusiast, and lifelong daydreamer. He's happiest with a camera in hand, seeking out scenic overlooks and surprising stories in everyday places.
              </p>
              <p className="text-base text-gray-800">
                With a knack for finding cozy bookshops and memorably good bakeries (and making every train connection... almost), Michael brings calm, humor, and a spirit of discovery to our travels.
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-xs aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={michaelImg}
                  alt="Placeholder for Michael"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT GESY */}
        <section className="max-w-5xl mx-auto w-full py-8 md:py-14 px-4 md:px-6">
          <div
            className="flex flex-col md:flex-row-reverse items-center md:items-stretch gap-7 md:gap-10 rounded-xl"
            style={{ background: "#FEF4F0" }}
          >
            <div className="flex-1 flex flex-col justify-center py-7 px-4 md:px-8">
              <h2 className="text-xl md:text-2xl font-playfair font-semibold text-primary mb-3" style={{ fontFamily: "Playfair Display, serif" }}>
                About Gesy
              </h2>
              <p className="mb-3 text-base text-gray-800 font-serif italic" style={{ fontFamily: "Playfair Display, serif" }}>
                Always chasing sunshine and singing just to make baby Victoria giggle, Gesy fills every day with warmth and energy. Brazilian at heart and spirit, she's our connector—finding joy in every encounter, laughing in every language, and turning even a simple morning stroll into a miniature adventure.
              </p>
              <p className="text-base text-gray-800">
                She brings a touch of poetry and spontaneity to our family explorations, teaching us how to savor beauty and connection wherever we go.
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-xs aspect-[4/5] bg-[#FDE1D3] rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={gesyImg}
                  alt="Placeholder for Gesy"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT VICTORIA */}
        <section className="max-w-5xl mx-auto w-full py-8 md:py-14 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-7 md:gap-10 bg-[#FFDDDC] rounded-xl border border-gray-200 shadow">
            <div className="flex-1 flex flex-col justify-center py-7 px-4 md:px-8">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-semibold text-primary">About Victoria</h2>
                <Heart size={22} className="text-accent" />
              </div>
              <p className="mb-3 text-base text-gray-800">
                The heart and smile of our travels, Victoria brings pure delight everywhere we go. Whether giggling from her carrier or dozing through adventures, she reminds us to slow down, look closer, and enjoy the magic in every new place (and every bakery).
              </p>
              <p className="text-base text-gray-800">
                We're endlessly grateful for each day exploring the world through her bright, wonder-filled eyes.
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-xs aspect-[4/5] bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={victoriaImg}
                  alt="Placeholder for Victoria"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
