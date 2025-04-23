import React, { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import NewsletterModal from "./NewsletterModal";

const navLinks = [
  { name: "Gallery", dropdown: true, items: [
    { name: "Photography", url: "/gallery/photos" },
    { name: "Videography", url: "/gallery/videos" },
  ]},
  { name: "Blog", url: "/blog" },
  { name: "About Us", url: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [galleryDropdown, setGalleryDropdown] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const navItem = (link: any) =>
    link.dropdown ? (
      <div className="relative group">
        <button
          className="flex items-center gap-1 hover:text-accent transition px-3 py-2"
          onClick={() => setGalleryDropdown((o) => !o)}
          onMouseEnter={() => setGalleryDropdown(true)}
        >
          {link.name}
          <ChevronDown size={18} />
        </button>
        <div 
          className={cn(
            "absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-20 transition-all",
            galleryDropdown ? "opacity-100 visible" : "opacity-0 invisible"
          )}
          onMouseEnter={() => setGalleryDropdown(true)}
          onMouseLeave={() => setGalleryDropdown(false)}
        >
          {link.items.map((item: any) => (
            <Link key={item.name} to={item.url} className="block px-4 py-2 text-gray-700 hover:bg-accent/10">
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    ) : (
      <Link
        to={link.url}
        className="px-3 py-2 hover:text-accent transition font-medium"
      >
        {link.name}
      </Link>
    );

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 lg:py-3">
          <a href="/" className="flex items-center gap-2 font-playfair font-bold text-xl lg:text-2xl tracking-tight text-primary hover:text-accent transition">
            <span>Onwards&nbsp;&amp;&nbsp;Upwards</span>
          </a>
          <div className="hidden md:flex items-center gap-1 animate-fade-in">
            {navLinks.map((link) => (
              <div key={link.name} className="group">
                {navItem(link)}
              </div>
            ))}
            <button
              onClick={() => setNewsletterOpen(true)}
              className="ml-3 flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-primary transition focus:outline-none"
            >
              <Mail size={18} />
              Newsletter
            </button>
          </div>

          <button
            className="md:hidden px-3 py-2 focus:outline-none"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Open menu"
          >
            <div className="space-y-1">
              <div className={cn("w-6 h-0.5 bg-primary transition", mobileOpen && "rotate-45 translate-y-1.5")} />
              <div className={cn("w-6 h-0.5 bg-primary transition", mobileOpen && "opacity-0")} />
              <div className={cn("w-6 h-0.5 bg-primary transition", mobileOpen && "-rotate-45 -translate-y-1.5")} />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t animate-fade-in px-4 pt-2 pb-4">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="mb-2">
                  <button
                    className="flex items-center gap-2 w-full justify-start font-medium py-2"
                    onClick={() => setGalleryDropdown((g) => !g)}
                  >
                    {link.name}
                    <ChevronDown size={18} className={galleryDropdown ? "rotate-180 transition" : ""} />
                  </button>
                  {galleryDropdown && (
                    <div className="ml-4">
                      {link.items.map((item: any) => (
                        <Link
                          key={item.name}
                          to={item.url}
                          className="block py-1 text-gray-800 hover:text-accent transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  key={link.name}
                  to={link.url}
                  className="block py-2 font-medium text-gray-800 hover:text-accent"
                >
                  {link.name}
                </Link>
              )
            )}
            <button
              onClick={() => setNewsletterOpen(true)}
              className="block mt-4 w-full flex items-center justify-center gap-2 bg-accent text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-primary transition focus:outline-none"
            >
              <Mail size={18} />
              Newsletter
            </button>
          </div>
        )}
      </nav>

      <NewsletterModal 
        open={newsletterOpen}
        onOpenChange={setNewsletterOpen}
      />
    </>
  );
};

export default Navbar;
