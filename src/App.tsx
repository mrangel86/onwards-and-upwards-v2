
// FORCE DEPLOY: 2025-06-13 Preview System v2 - Clean Supabase Table and Path

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import PhotoGallery from "./pages/PhotoGallery";
import VideoGallery from "./pages/VideoGallery";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import BlogPreview from "./pages/BlogPreview";
import BookViewer from "./pages/BookViewer";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/gallery/photos" element={<PhotoGallery />} />
          <Route path="/gallery/videos" element={<VideoGallery />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/posts/:slug" element={<BlogPost />} />
          <Route path="/preview-posts/:slug" element={<BlogPreview />} />
          <Route path="/book-viewer" element={<BookViewer />} />
          <Route path="/book/:slug" element={<BookViewer />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
