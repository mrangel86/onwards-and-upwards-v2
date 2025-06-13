# Blog Preview System v3.0 - Implementation Guide

## Overview
This document outlines how to use the **NEW Blog Preview System v3.0** for onwardsandupwards.co

## How It Works

### 1. Writing in Notion
- Draft your blog posts in the Blog Post DB in Notion
- Set Status to "Editing" when you're ready to preview
- Add title, content, featured image, author, etc.

### 2. Syncing to Preview
When your post is in "Editing" status, ask Claude to sync it:
```
"Please sync my post '[TITLE]' to the preview system"
```

Claude will:
- Extract the post from Notion
- Generate a preview-safe slug (title + "-preview")
- Push content to Supabase `preview_posts` table (**NEW**)
- Update the Last Synced date in Notion

### 3. Viewing the Preview
Visit: `onwardsandupwards.co/preview-posts/[slug]` (**NEW ROUTE**)

Example: `/preview-posts/test-draft-post-for-gesy-preview`

Features:
- Identical formatting to live posts
- Clear "Preview Mode" banner with pastel red background
- SEO protection (noindex robots tag)
- Same components and styling as `/posts/[slug]`

### 4. Publishing Flow
When ready to publish:
1. Change Status to "Published" in Notion
2. Ask Claude to publish: "Please publish my post '[TITLE]'"

Claude will:
- Move content from `preview_posts` → `posts`
- Set published=true
- Delete the preview version
- Update slug to remove "-preview" suffix

### 5. Cleanup
- Previews older than 30 days are auto-deleted
- Failed syncs can be retried
- Preview URLs become invalid after publishing

## Benefits
- ✅ Visual preview before publishing
- ✅ Same rendering as live site
- ✅ Simple Notion-based workflow
- ✅ No complex CMS learning curve
- ✅ Collaborative editing in Notion
- ✅ Full SEO protection for drafts

## Technical Implementation - **PREVIEW SYSTEM v3.0**

### Notion Fields Required:
- Title (title)
- Content (rich_text)
- Status (select: Idea, Draft, Editing, Published)
- Slug (rich_text)
- Author (select)
- Featured Image (url)
- Excerpt (rich_text)
- Publish Date (date)
- Last Synced (date)

### Supabase Tables:
- `posts` - Live published content
- `preview_posts` - **NEW**: Draft content for preview (replaces deprecated `post_previews`)

### Routes:
- `/posts/[slug]` - Live posts (from posts table)
- `/preview-posts/[slug]` - **NEW**: Preview posts (from preview_posts table)

### Key Changes in v3.0:
- ✅ **Table**: Uses `preview_posts` (not `post_previews`)
- ✅ **Field**: Uses `slug` (not `preview_slug`)
- ✅ **Route**: Uses `/preview-posts/` (not `/preview/`)
- ✅ **Component**: Uses `BlogPreview.tsx` (not `BlogPostPreview.tsx`)
- ✅ **Banner**: Pastel red background for draft status

### Sync Functions:
- Notion → `preview_posts` (for editing status)
- `preview_posts` → `posts` (for publishing)
- Cleanup old previews (30+ days)

## Usage Examples

### Sync Draft to Preview:
```
Claude, please sync my "Test Draft Post for Gesy" to the preview system
```

### Publish from Preview:
```
Claude, please publish my "Test Draft Post for Gesy" - move it from preview to live
```

### Check Preview Status:
```
What posts do I currently have in preview mode?
```

This system allows for a seamless content creation workflow while maintaining full control over what gets published publicly.

---

## Migration Notes (v2.0 → v3.0)
- **DEPRECATED**: `/preview/[slug]` routes (no longer supported)
- **DEPRECATED**: `post_previews` table (deleted)
- **DEPRECATED**: `preview_slug` field references (removed)
- **NEW**: All preview functionality now uses the cleaned-up system described above
