
import React from "react";

type BlogCardProps = {
  title: string;
  author: string;
  image: string;
  excerpt: string;
  date?: string;
  onClick?: () => void;
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  author,
  image,
  excerpt,
  date,
  onClick,
}) => {
  const fallbackExcerpt = "Click to see more about this adventure...";

  return (
    <div
      className="bg-white rounded-xl shadow-sm flex flex-col hover:shadow-lg transition group cursor-pointer overflow-hidden border border-gray-100 h-full"
      onClick={onClick}
      tabIndex={0}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-1 py-4 px-5 flex-1">
        <h3 className="font-playfair font-bold text-lg text-primary mb-1 truncate">{title}</h3>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-accent">by {author}</span>
          {date && <span className="text-xs text-gray-500">{date}</span>}
        </div>
        <p className="text-gray-700 text-sm leading-snug line-clamp-2">
          {excerpt || fallbackExcerpt}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
