
import React from "react";

const footerLinks = [
  { label: "Home", url: "/" },
  { label: "Gallery", url: "#" },
  { label: "Blog", url: "#" },
  { label: "About Us", url: "#" },
  { label: "Newsletter", url: "#newsletter" },
];

const Footer = () => (
  <footer className="bg-white border-t pt-10 pb-6 px-4">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20">
      <div className="flex-shrink-0 mb-4 md:mb-0">
        <a href="/" className="flex items-center font-playfair text-xl font-bold tracking-tight text-primary hover:text-accent transition">
          Onwards&nbsp;&amp;&nbsp;Upwards
        </a>
      </div>
      <div className="flex-1 mb-4 md:mb-0">
        <p className="text-gray-700 text-sm max-w-xl">Onwards & Upwards is a family journal chronicling our journey through Europe—written for ourselves, our daughter, and anyone who wants to follow along.</p>
      </div>
      <nav className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="text-gray-600 hover:text-accent text-sm font-semibold transition"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
    <div className="text-gray-400 text-xs mt-8 text-center">
      © 2025 Onwards & Upwards
    </div>
  </footer>
);

export default Footer;
