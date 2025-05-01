
import React, { useState } from "react";

const NewsletterModal = ({ email, onClose }: { email: string; onClose: () => void }) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-playfair text-xl font-bold mb-4">Thank you for subscribing!</h3>
        <p className="mb-5">
          We've added <strong>{email}</strong> to our newsletter list. You'll receive updates and stories from our adventures soon!
        </p>
        <button 
          className="w-full bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          onClick={onClose}
        >
          Back to homepage
        </button>
      </div>
    </div>
  );
};

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit to a newsletter service
    console.log('Newsletter signup:', email);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEmail("");
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showModal]);

  return (
    <>
      <section
        id="newsletter"
        className="w-full px-0 py-14 md:py-20 flex items-center"
        style={{ background: "#FDE1D3" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-3">Newsletter</h2>
            <p className="text-gray-700">Notes from the road for those who want to stay close.</p>
          </div>
          <form className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-3 rounded-full bg-white border text-gray-800 flex-1 outline-accent placeholder-gray-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

      {/* Confirmation Modal */}
      {showModal && <NewsletterModal email={email} onClose={handleClose} />}
    </>
  );
};

export default NewsletterSignup;
