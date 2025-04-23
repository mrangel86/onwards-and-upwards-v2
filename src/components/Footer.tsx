
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-white border-t pt-10 pb-6 px-4">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-20">
      <div className="flex-shrink-0 mb-4 md:mb-0">
        <Link to="/" className="flex items-center font-playfair text-xl font-bold tracking-tight text-primary hover:text-accent transition">
          Onwards&nbsp;&amp;&nbsp;Upwards
        </Link>
      </div>
      
      <div className="flex-1 mb-4 md:mb-0">
        <p className="text-gray-700 text-sm max-w-xl">
          Onwards & Upwards is a family journal chronicling our journey through Europe—written for ourselves, our daughter, and anyone who wants to follow along.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-6">
        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-gray-600 hover:text-accent text-sm font-semibold transition">
            Home
          </Link>
          <Link to="/blog" className="text-gray-600 hover:text-accent text-sm font-semibold transition">
            Blog
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-accent text-sm font-semibold transition">
            About Us
          </Link>
        </div>

        {/* Gallery Section */}
        <div className="flex flex-col gap-2">
          <span className="text-primary text-sm font-bold">Gallery</span>
          <Link to="/gallery/photos" className="text-gray-600 hover:text-accent text-sm transition">
            Photography
          </Link>
          <Link to="/gallery/videos" className="text-gray-600 hover:text-accent text-sm transition">
            Videography
          </Link>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => document.dispatchEvent(new CustomEvent("open-newsletter"))}
            className="text-gray-600 hover:text-accent text-sm font-semibold transition"
          >
            Newsletter
          </button>
        </div>
      </div>
    </div>
    <div className="text-gray-400 text-xs mt-8 text-center">
      © 2025 Onwards & Upwards
    </div>
  </footer>
);

export default Footer;
