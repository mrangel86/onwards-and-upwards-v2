
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const TravelersGlance = () => {
  const navigate = useNavigate();
  
  // Navigate to about page and scroll to top
  const handleLearnMoreClick = () => {
    navigate('/about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <section className="relative overflow-hidden py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Text Content - Left Side */}
        <div className="w-full md:w-[40%] pr-0 md:pr-10 lg:pr-16 mb-10 md:mb-0 order-2 md:order-1">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-4 animate-fade-in">
            Travelers at a Glance
          </h2>
          <p className="text-lg text-gray-700 mb-4 animate-fade-in">
            Meet Michael, Gesy, and VV—a curious crew of dreamers, wanderers, and snack enthusiasts with a camera (or two) always in hand.
          </p>
          <p className="mb-6 text-gray-600 animate-fade-in">
            We're capturing an ongoing family adventure: from forest trails to piazza gelatos. We travel with open hearts, a bit of childlike awe, and a healthy appetite for both nature and good food.
          </p>
          <button 
            onClick={handleLearnMoreClick}
            className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-8 py-3 rounded-full shadow transition animate-fade-in"
          >
            Learn More
          </button>
        </div>

        {/* Image - Right Side */}
        <div className="w-full md:w-[60%] order-1 md:order-2">
          <img
            src="https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/images//DSC00234.jpg"
            alt="Meet the travelers"
            className="w-full h-auto object-cover shadow-lg rounded-xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default TravelersGlance;
