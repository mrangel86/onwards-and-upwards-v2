
import React from "react";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";
import HeroCarousel from "@/components/HeroCarousel";
import TravelersGlance from "@/components/TravelersGlance";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import FeaturedVideo from "@/components/FeaturedVideo";
import BlogPreview from "@/components/BlogPreview";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";

const Index = () => {
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
            description: "Beautiful moments captured in time",
            url: "/gallery/photos",
          },
          {
            title: "Videography", 
            description: "Stories told through motion",
            url: "/gallery/videos",
          },
        ],
      },
      { title: "Blog", url: "/blog" },
      { title: "About Us", url: "/about" },
    ],
    auth: {
      login: { text: "Newsletter", url: "/newsletter" },
      signup: { text: "", url: "#" }, // Hide signup button
    },
  };

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
