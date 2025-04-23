import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600&q=80",
    title: "Stories from the Road",
    subtitle: "Discover our favorite moments across Europe.",
    button: { text: "Read More", url: "#" }
  },
  {
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&q=80",
    title: "Nature’s Grandeur",
    subtitle: "Waves, forests, mountains & wild encounters.",
    button: { text: "Explore Photos", url: "#" }
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80",
    title: "Family Journeys",
    subtitle: "Traveling together, one adventure at a time.",
    button: { text: "Meet Us", url: "#" }
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[55vw] max-h-[530px] min-h-[300px] flex items-center justify-center overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
          style={{
            background: `linear-gradient(0deg,rgba(30,22,23,.26),rgba(40,28,29,.18)),url(${slide.image}) center center/cover no-repeat`
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white bg-black/30 md:bg-black/20 bg-blend-multiply">
            <div className="max-w-2xl mx-auto text-center px-4">
              <h1 className="font-playfair text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                {slide.title}
              </h1>
              <div className="w-16 h-px bg-white/60 mx-auto mb-4" />
              <p className="text-lg lg:text-2xl mb-6 drop-shadow animate-fade-in">
                {slide.subtitle}
              </p>
              <a href={slide.button.url} className="inline-block">
                <button className="bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-lg transition animate-fade-in">
                  {slide.button.text}
                </button>
              </a>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-3 h-3 rounded-full bg-white/40", i === current && "bg-accent border-2 border-white")}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
