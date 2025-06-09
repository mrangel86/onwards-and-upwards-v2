// Blog Preview System Implementation Guide

## Overview
This document outlines how to use the Blog Preview System for onwardsandupwards.co

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
- Push content to Supabase `post_previews` table
- Update the Last Synced date in Notion

### 3. Viewing the Preview
Visit: `onwardsandupwards.co/preview/[slug]`

Example: `/preview/test-draft-post-for-gesy-preview`

Features:
- Identical formatting to live posts
- Clear "Preview Mode" banner
- SEO protection (noindex robots tag)
- Same components and styling as `/post/[slug]`

### 4. Publishing Flow
When ready to publish:
1. Change Status to "Published" in Notion
2. Ask Claude to publish: "Please publish my post '[TITLE]'"

Claude will:
- Move content from `post_previews` → `posts`
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

## Technical Implementation

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
- `post_previews` - Draft content for preview

### Routes:
- `/post/[slug]` - Live posts (from posts table)
- `/preview/[slug]` - Preview posts (from post_previews table)

### Sync Functions:
- Notion → `post_previews` (for editing status)
- `post_previews` → `posts` (for publishing)
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
