
import React from "react";

const NewsletterSignup = () => (
  <section
    id="newsletter"
    className="w-full px-0 py-14 md:py-20"
    style={{ background: "#FDE1D3" }}
  >
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-10 px-4"
      style={{borderRadius:'2rem',boxShadow:'0 6px 32px 0 rgba(250,180,150,0.15)'}}>
      <div className="flex-1 mb-4 md:mb-0">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-3">Newsletter</h2>
        <p className="mb-2 text-gray-700">Notes from the road, for those who want to stay close.</p>
        <p className="text-gray-600 text-sm">Sign up to receive new stories and favorite finds, once in a while.</p>
      </div>
      <form className="flex-1 flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-md md:justify-end">
        <input
          type="email"
          placeholder="Your email"
          className="px-4 py-3 rounded-full bg-white border text-gray-800 flex-1 outline-accent placeholder-gray-400"
          required
        />
        <button
          type="submit"
          className="bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  </section>
);

export default NewsletterSignup;
