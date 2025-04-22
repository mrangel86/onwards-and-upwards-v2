
import React from "react";

type BlogCardProps = {
  title: string;
  author: string;
  image: string;
  excerpt: string;
  onClick?: () => void;
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  author,
  image,
  excerpt,
  onClick,
}) => (
  <div
    className="bg-white rounded-xl shadow-sm flex flex-col hover:shadow-lg transition group cursor-pointer overflow-hidden border border-gray-100"
    onClick={onClick}
    tabIndex={0}
  >
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      loading="lazy"
    />
    <div className="flex flex-col gap-1 py-4 px-5 flex-1">
      <h3 className="font-playfair font-bold text-lg text-primary mb-1">{title}</h3>
      <span className="text-xs text-accent mb-1">by {author}</span>
      <p className="text-gray-700 text-sm leading-snug line-clamp-3">{excerpt}</p>
    </div>
  </div>
);

export default BlogCard;
