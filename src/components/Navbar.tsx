
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGalleryMouseEnter = () => {
    setIsGalleryOpen(true);
  };

  const handleGalleryMouseLeave = () => {
    setIsGalleryOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGalleryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-playfair font-bold text-xl text-primary">
            Onwards & Upwards
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-accent">
              Home
            </Link>
            
            {/* Gallery Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative dropdown"
              onMouseEnter={handleGalleryMouseEnter}
              onMouseLeave={handleGalleryMouseLeave}
            >
              <button 
                className="text-gray-600 hover:text-accent inline-flex items-center"
                onClick={() => setIsGalleryOpen(!isGalleryOpen)}
              >
                Gallery
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Dropdown Content */}
              <div 
                className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 dropdown-content ${
                  isGalleryOpen ? "block" : "hidden"
                }`}
              >
                <Link to="/gallery/photos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Photography
                </Link>
                <Link to="/gallery/videos" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Videography
                </Link>
              </div>
            </div>

            <Link to="/blog" className="text-gray-600 hover:text-accent">
              Blog
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-accent">
              About Us
            </Link>
            <Link to="/newsletter" className="px-4 py-2 text-white bg-accent rounded-md hover:bg-accent/90 transition">
              Newsletter
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-accent py-2">
                Home
              </Link>
              
              {/* Gallery items directly in mobile menu */}
              <div className="py-2">
                <div className="font-medium text-gray-600 mb-1">Gallery</div>
                <div className="pl-4 flex flex-col space-y-2">
                  <Link to="/gallery/photos" className="text-gray-600 hover:text-accent">
                    Photography
                  </Link>
                  <Link to="/gallery/videos" className="text-gray-600 hover:text-accent">
                    Videography
                  </Link>
                </div>
              </div>

              <Link to="/blog" className="text-gray-600 hover:text-accent py-2">
                Blog
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-accent py-2">
                About Us
              </Link>
              <Link to="/newsletter" className="py-2 px-4 text-white bg-accent rounded-md hover:bg-accent/90 transition inline-block w-fit">
                Newsletter
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
