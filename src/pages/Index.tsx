
import React from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import { navbarData } from "@/lib/navbarData";
import HeroCarousel from "@/components/HeroCarousel";
import TravelersGlance from "@/components/TravelersGlance";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import FeaturedVideo from "@/components/FeaturedVideo";
import BlogPreview from "@/components/BlogPreview";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="font-inter bg-background min-h-screen flex flex-col">
      <Navbar1 {...navbarData} />
      <main className="flex-1">
        <HeroCarousel />
        <div className="space-y-0">
          <TravelersGlance />
          <FeaturedPhotos />
          <FeaturedVideo />
          <BlogPreview />
          <NewsletterSignup />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
