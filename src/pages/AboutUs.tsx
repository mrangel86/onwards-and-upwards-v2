
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

// Placeholders
const familyImg = "/lovable-uploads/16b3feb4-3248-4307-b70a-b81109ade8c0.png"; // Use as "family"
const michaelImg = "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80"; // Living room, modern "dad"
const gesyImg = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80"; // Fruit, use as placeholder for Gesy
const victoriaImg = "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80"; // Chubby baby

const AboutUs = () => {
  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto pt-14 md:pt-20 pb-10 px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-primary text-center mb-3">About Us</h1>
          <div className="text-lg text-muted-foreground text-center mb-8 font-medium">
            A family of three exploring Europe one adventure at a time
          </div>
          <div className="bg-[#F9F6F1] rounded-xl md:rounded-2xl shadow-sm py-8 px-4 md:px-8 mb-6">
            <div className="w-full aspect-[4/1.7] md:aspect-[3/1.2] overflow-hidden flex items-center justify-center mb-5 rounded-xl md:rounded-2xl">
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
            style={{ background: "linear-gradient(95deg, #FDE1D3 0%, #FFF4EC 100%)" }}
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
        <section className="max-w-5xl mx-auto w-full py-10 md:py-16 px-4 md:px-6">
          <div
            className="bg-[#F6F0FA] rounded-xl shadow flex flex-col items-center p-6 md:p-10"
            style={{ background: "linear-gradient(99deg,#F6F0FA 50%,#E5F6FB 100%)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-xl md:text-2xl font-semibold text-primary font-serif" style={{ fontFamily: "Playfair Display, serif" }}>
                About Victoria
              </h2>
              <Heart size={22} className="text-accent" />
            </div>
            <div className="w-full max-w-2xl aspect-[4/2.3] rounded-xl overflow-hidden mb-5">
              <img
                src={victoriaImg}
                alt="Placeholder for Victoria"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-base md:text-lg text-gray-800 max-w-2xl" style={{ fontFamily: "Playfair Display, serif" }}>
              The heart and smile of our travels, Victoria brings pure delight everywhere we go. Whether giggling from her carrier or dozing through adventures, she reminds us to slow down, look closer, and enjoy the magic in every new place (and every bakery). We’re endlessly grateful for each day exploring the world through her bright, wonder-filled eyes.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
