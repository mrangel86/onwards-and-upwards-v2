-- SECURITY FIX: Enable RLS on preview_posts table
ALTER TABLE preview_posts ENABLE ROW LEVEL SECURITY;

-- Create public read policy for preview posts (since this is a public blog)
CREATE POLICY "Preview posts are publicly readable" 
ON preview_posts 
FOR SELECT 
USING (true);

-- SECURITY FIX: Secure database functions by adding SECURITY DEFINER and search_path protection

-- Fix cleanup_old_previews function
CREATE OR REPLACE FUNCTION public.cleanup_old_previews()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  DELETE FROM preview_posts 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$function$;

-- Fix get_preview_status function
CREATE OR REPLACE FUNCTION public.get_preview_status()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  preview_count INTEGER;
  published_count INTEGER;
  oldest_preview TIMESTAMP;
  result JSON;
BEGIN
  SELECT COUNT(*) INTO preview_count FROM preview_posts;
  SELECT COUNT(*) INTO published_count FROM posts WHERE published = true;
  SELECT MIN(created_at) INTO oldest_preview FROM preview_posts;
  
  RETURN JSON_BUILD_OBJECT(
    'preview_posts', preview_count,
    'published_posts', published_count,
    'oldest_preview', oldest_preview
  );
END;
$function$;

-- Fix publish_post_from_preview function
CREATE OR REPLACE FUNCTION public.publish_post_from_preview(preview_slug text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  preview_post RECORD;
  live_slug TEXT;
  result JSON;
BEGIN
  -- Get the preview post
  SELECT * INTO preview_post FROM preview_posts WHERE slug = preview_slug;
  
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT('success', false, 'error', 'Preview post not found');
  END IF;
  
  -- Generate live slug (remove -preview suffix)
  live_slug := REPLACE(preview_post.slug, '-preview', '');
  
  -- Check if live slug already exists
  IF EXISTS (SELECT 1 FROM posts WHERE slug = live_slug) THEN
    live_slug := live_slug || '-' || EXTRACT(EPOCH FROM NOW())::text;
  END IF;
  
  -- Insert into posts table
  INSERT INTO posts (
    notion_id, title, slug, type, hero_image_url, excerpt, 
    content, author, published, location, featuredhero, gallery_description
  ) VALUES (
    preview_post.notion_id, 
    preview_post.title, 
    live_slug, 
    preview_post.type::post_type_enum, 
    preview_post.hero_image_url, 
    preview_post.excerpt,
    preview_post.content, 
    preview_post.author, 
    true, 
    preview_post.location, 
    preview_post.featuredhero, 
    preview_post.gallery_description
  );
  
  -- Delete from preview table
  DELETE FROM preview_posts WHERE slug = preview_slug;
  
  -- Return success with new slug
  RETURN JSON_BUILD_OBJECT(
    'success', true, 
    'live_slug', live_slug,
    'preview_slug', preview_slug,
    'title', preview_post.title
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$function$;

-- Fix sync_notion_to_preview function
CREATE OR REPLACE FUNCTION public.sync_notion_to_preview(p_notion_id text, p_title text, p_content text, p_author text, p_type text DEFAULT 'essay'::text, p_hero_image_url text DEFAULT NULL::text, p_excerpt text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  preview_slug TEXT;
  existing_preview RECORD;
  result JSON;
BEGIN
  -- Generate preview slug from title
  preview_slug := LOWER(REGEXP_REPLACE(p_title, '[^a-zA-Z0-9\s]', '', 'g'));
  preview_slug := REGEXP_REPLACE(preview_slug, '\s+', '-', 'g');
  preview_slug := preview_slug || '-preview';
  
  -- Check if preview already exists for this notion_id
  SELECT * INTO existing_preview FROM preview_posts WHERE notion_id = p_notion_id;
  
  IF FOUND THEN
    -- Update existing preview
    UPDATE preview_posts SET
      title = p_title,
      slug = preview_slug,
      content = p_content,
      author = p_author,
      type = p_type::post_type_enum,
      hero_image_url = p_hero_image_url,
      excerpt = p_excerpt,
      created_at = NOW()
    WHERE notion_id = p_notion_id;
    
    result := JSON_BUILD_OBJECT(
      'success', true,
      'action', 'updated',
      'slug', preview_slug,
      'title', p_title
    );
  ELSE
    -- Insert new preview
    INSERT INTO preview_posts (
      notion_id, title, slug, content, author, type, 
      hero_image_url, excerpt, published
    ) VALUES (
      p_notion_id, p_title, preview_slug, p_content, p_author, 
      p_type::post_type_enum, p_hero_image_url, p_excerpt, false
    );
    
    result := JSON_BUILD_OBJECT(
      'success', true,
      'action', 'created',
      'slug', preview_slug,
      'title', p_title
    );
  END IF;
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  RETURN JSON_BUILD_OBJECT('success', false, 'error', SQLERRM);
END;
$function$;