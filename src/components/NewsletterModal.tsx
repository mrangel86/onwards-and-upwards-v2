
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden">
        <div className="grid sm:grid-cols-2 items-stretch">
          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="font-playfair text-2xl sm:text-3xl font-bold mb-3">
                Sign up to follow our travels
              </DialogTitle>
              <DialogDescription className="text-base">
                Join our newsletter to receive updates about our European adventures, family stories, and travel tips.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-full bg-white border text-gray-800 outline-accent placeholder-gray-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow transition"
              >
                Subscribe
              </button>
            </form>
          </div>
          {/* Image Section */}
          <div 
            className="hidden sm:block bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80')"
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterModal;
