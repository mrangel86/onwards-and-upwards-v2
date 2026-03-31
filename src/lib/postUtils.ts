import { format } from "date-fns";

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'MMMM d, yyyy');
  } catch (e) {
    return '';
  }
};

type PostWithContent = {
  excerpt?: string | null;
  content?: string | null;
};

export const createExcerpt = (post: PostWithContent): string => {
  if (post.excerpt) return post.excerpt;
  if (post.content) {
    const stripped = post.content.replace(/<[^>]*>/g, '');
    return stripped.length > 120 ? `${stripped.substring(0, 120)}...` : stripped;
  }
  return "Click to see more about this adventure...";
};
