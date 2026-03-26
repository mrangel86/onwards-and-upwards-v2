# Onwards & Upwards — Claude Code Instructions

## Role
This terminal is the primary execution environment for all code changes.
The Claude Desktop app is used for planning, reviewing, and questions.
Always confirm with the user before merging staging → main.

## Branching Strategy
- ALL work happens on the `staging` branch first
- NEVER commit directly to `main`
- Only merge staging → main after verifying the Vercel preview URL
- To merge when ready: `git checkout main && git merge staging && git push`

## After Every Push to Staging
1. Wait for Vercel preview deployment to complete
2. Check the preview URL across: homepage, blog listing, one blog post, photo gallery, video gallery
3. Report any broken layouts, console errors, or missing content
4. Only tell the user "ready to merge to main" when everything checks out

## Project Context
- Live site: onwardsandupwards.co
- Repo: github.com/mrangel86/onwards-and-upwards-v2
- Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase + Vercel
- Owner is non-technical — always explain changes in plain English alongside code
- Full diagnostic and improvement plan: ~/.claude/plans/adaptive-jumping-lamport.md

## Completed Work
- Phase 1 ✅ — Security cleanup, credential rotation, removed Lovable artifacts,
  removed test pages, cleaned usePreviewPost, added .env.example
- Phase 2 ✅ — Error boundaries, centralized navbarData, image fallbacks,
  standardized toast errors, deleted orphaned test files

## Remaining Work (in order)
- Phase 3 — Server-side pagination for BlogIndex, refactor BookViewer,
  convert notionPreview.js to TypeScript, fix inline CSS colors, React.memo on cards
- Phase 4 — Accessibility audit, TypeScript any cleanup, Supabase RLS policies

## Rules
- Never commit .env files (already in .gitignore)
- Never hardcode Supabase credentials — use import.meta.env.VITE_* only
- Always run `npm run build` before committing to catch errors early
- Keep explanations brief but human — owner is not a developer
- When in doubt about approach, say so and let the user check with Desktop Claude

## Key Files
- src/App.tsx — routing
- src/integrations/supabase/client.ts — Supabase client
- src/lib/navbarData.ts — centralized nav config (Phase 2)
- src/components/ErrorBoundary.tsx — global error handler (Phase 2)
- src/pages/BlogPost.tsx — blog post renderer (has dangerouslySetInnerHTML)
- src/pages/BookViewer.tsx — PDF viewer, needs Phase 3 refactor
