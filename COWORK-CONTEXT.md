# Onwards & Upwards — Cowork Context

Reference file for the Claude: OUv2 project. Attach this to the project so the assistant has deep context without bloating the custom instructions.

---

## About the Blog

- **Name:** Onwards & Upwards
- **URL:** onwardsandupwards.co
- **Type:** Personal travel blog — stories, photos, videos, and reflections from Michael Rangel's travels
- **Tone:** Personal, warm, adventurous — always written in Michael's voice (first-person)
- **Audience:** Friends, family, and curious travelers

---

## Tech Stack

Michael is non-technical. You do not need to build anything — Claude Code handles all implementation.

| Layer | Tool |
|-------|------|
| Frontend | React + TypeScript, hosted on Vercel |
| Database | Supabase (posts, images, videos) |
| Notes & Drafts | Obsidian |
| Task Management | Todoist |
| Repo | github.com/mrangel86/onwards-and-upwards-v2 |

---

## Obsidian Blog Pipeline

Blog posts are written in Obsidian and move through three stages before going live.

**Vault path:** `Obsidian Vaults/MVR Idea Universe/Efforts/Projects/Active/Blog/`

| Folder | Stage |
|--------|-------|
| `0-Drafts` | Work in progress |
| `1-Ready` | Finished — approved to publish |
| `2-Published` | Live on the site |

### Post Structure

Each post is a Markdown file with frontmatter:

```
---
title:
slug:
type:          # essay, photo-essay, etc.
author: Michael Rangel
excerpt:
location:
hero_image_url:
featuredhero:  # true/false
---
```

Body is written in Markdown. Images use Obsidian embed syntax: `![[filename.jpg]]`

### Your Role in the Pipeline

- Help write and refine posts while they're in `0-Drafts`
- Before moving to `1-Ready`, review the frontmatter with Michael — confirm title, excerpt, and slug are all filled in correctly
- Moving to `1-Ready` is the signal that a post is ready to publish
- Create a `🛠 Claude Code task` in Todoist when a post reaches `1-Ready` so Michael knows to run the push script

---

## Todoist Task Conventions

Project: **Claude: OUv2**
Mirror the structure and conventions of the **Claude: Personal Brand** project.

| Label | Meaning |
|-------|---------|
| `🛠 Claude Code task` | Needs technical work — Michael takes this to the Claude Code terminal |
| `✍️ Content` | Writing, editing, or drafting work |
| `💬 Decision needed` | Waiting on Michael's input before moving forward |

### Claude Code Task Format

When a task requires implementation, include a copy-pasteable brief:

```
**What:** [what needs to happen]
**Why:** [context or motivation]
**Details:** [any specifics Claude Code will need]
```

---

## What Michael Adds Over Time

The section below will grow as Michael shares more context about the blog:

- Trip types and destinations covered
- Recurring characters (family, friends)
- Voice and style notes
- Content themes and series
