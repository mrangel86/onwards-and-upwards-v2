
import React from "react";

const TravelersGlance = () => (
  <section className="max-w-6xl mx-auto px-4 py-14 lg:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
    <div className="flex-1">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-4 animate-fade-in">Travelers at a Glance</h2>
      <p className="text-lg text-gray-700 mb-4 animate-fade-in">Meet Michael, Gesy, and VV—a curious crew of dreamers, wanderers, and snack enthusiasts with a camera (or two) always in hand.</p>
      <p className="mb-6 text-gray-600 animate-fade-in">
        We’re capturing an ongoing family adventure: from forest trails to piazza gelatos. We travel with open hearts, a bit of childlike awe, and a healthy appetite for both nature and good food.
      </p>
      <a href="#" className="inline-block">
        <button className="bg-accent hover:bg-primary text-white font-semibold px-8 py-3 rounded-full shadow transition animate-fade-in">Learn More</button>
      </a>
    </div>
    <div className="flex-1 flex justify-center md:justify-end">
      <img
        src="https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=600&q=80"
        alt="Meet the travelers"
        className="rounded-2xl w-72 h-72 object-cover shadow-lg border"
        loading="lazy"
      />
    </div>
  </section>
);

export default TravelersGlance;
