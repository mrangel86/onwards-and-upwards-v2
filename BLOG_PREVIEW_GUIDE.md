# Blog Preview System - Usage Guide

## Overview

The blog preview system allows you to create draft posts and preview them exactly as they'll appear when published, complete with formatted text, images, and all styling.

## How It Works

Instead of using a separate `post_previews` table, this simplified system uses your existing `posts` table with the `published` field set to `false` for drafts.

## Getting Started

### 1. Access the Draft Manager
Navigate to `/drafts` in your browser to access the draft management interface.

### 2. Create a New Draft
1. Click the "New Draft" button
2. Fill in the form:
   - **Title**: Your post title (slug will auto-generate)
   - **Slug**: URL-friendly version of the title
   - **Author**: Author name
   - **Hero Image URL**: Featured image for the post
   - **Excerpt**: Brief description for previews
   - **Content**: Your HTML content

### 3. Preview Your Draft
1. Click the "Preview" button next to any draft
2. This will open `/preview/{slug}` showing exactly how your post will look when published
3. The preview includes:
   - Formatted HTML content
   - Hero image with lightbox functionality
   - All images clickable for lightbox viewing
   - Same styling as published posts
   - Blue banner indicating preview mode

### 4. Edit Drafts
1. Click "Edit" to modify any draft
2. Make your changes and save
3. Preview again to see updates

### 5. Publish When Ready
1. Click "Publish" to make the draft live
2. The post moves from draft to published status
3. Automatically redirects to the published post

## Content Formatting

### HTML Content
Write your content using HTML tags for proper formatting:

```html
<h2>Section Heading</h2>
<p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>

<p>Another paragraph with a <a href="https://example.com">link</a>.</p>

<img src="https://example.com/image.jpg" alt="Description" />

<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>

<blockquote>
  <p>This is a quote.</p>
</blockquote>
```

### Images
- Add images directly in your HTML content using `<img>` tags
- Images will automatically be clickable and open in a lightbox
- Set a hero image URL for the main post image

### Styling
The preview uses the same prose styling as published posts, including:
- Typography scaling
- Proper spacing
- Responsive design
- Dark/light theme support

## Workflow

### Recommended Workflow:
1. **Create Draft**: Use Draft Manager to create new post
2. **Write Content**: Add your HTML content with images
3. **Preview**: Click preview to see how it looks
4. **Iterate**: Edit and preview until satisfied
5. **Publish**: Publish when ready to go live

### Preview URLs
- Draft Manager: `/drafts`
- Preview a draft: `/preview/{slug}`
- Published post: `/posts/{slug}`

## Features

### Draft Manager Features:
- ✅ Create, edit, delete drafts
- ✅ Auto-generate slugs from titles
- ✅ One-click preview access
- ✅ Publish directly from manager
- ✅ View all drafts in one place

### Preview Features:
- ✅ Identical styling to published posts
- ✅ Full HTML content rendering
- ✅ Image lightbox functionality
- ✅ Responsive design
- ✅ Clear preview mode indicator
- ✅ Related posts section

## Troubleshooting

### Common Issues:

**Preview shows "Not Found"**
- Check that the draft exists and `published = false`
- Verify the slug matches exactly

**Images not displaying**
- Ensure image URLs are valid and accessible
- Check for typos in image tags

**Content not formatting correctly**
- Verify HTML syntax is correct
- Check for unclosed tags

**Can't access Draft Manager**
- Ensure you're navigating to `/drafts`
- Check that the route is added to your App.tsx

### Database Requirements:
The system uses the existing `posts` table with these key fields:
- `published`: boolean (false for drafts)
- `title`: string
- `slug`: string (unique)
- `content`: HTML string
- `hero_image_url`: string (optional)
- `author`: string (optional)
- `excerpt`: string (optional)

## Security Note

The Draft Manager provides full access to create/edit/delete drafts. In a production environment, you may want to add authentication to restrict access to authorized users only.
