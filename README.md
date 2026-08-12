# AI Knowledge Ledger

AI Knowledge Ledger turns your accumulated conversations with AI assistants into structured, portable knowledge about you — organized into separate, named categories ("ledgers") like DSA, Linux, Web Development, Blockchain, and Career, instead of one long undifferentiated chat history.

This README describes the current state of the project and will be updated as new phases are completed.

## Status

**Frontend prototype, in progress.** No backend, no database, no auth, and no real AI extraction yet — everything currently runs on mock data plus in-memory client state. The goal of this phase is a fully working frontend product flow before any of that is built.

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (**Base UI** variant, not Radix)
- lucide-react

Planned for later phases: Go (Gin) backend, PostgreSQL, an LLM-based extraction pipeline, auth.

## What's been built so far

### Dashboard (`/`)
- Persistent sidebar with navigation, driven by the ledger list (not hardcoded)
- Summary stats (total memories, categories, skills, goals) computed live from data
- A responsive grid of ledger cards, each showing icon, name, description, live item count, a confidence indicator, and last-updated time
- Recent Activity feed, derived from the most recently updated knowledge items
- Functional "Import Conversations" and "Export Knowledge" actions

### Ledger detail (`/ledger/[id]`)
- Ledger header (icon, name, description, live item count, confidence %, last updated)
- Search (title/description), plus filters for confidence, type, and tags
- A grid of memory cards, with a proper empty state and "Add Memory" call to action
- A right-side memory detail drawer, showing full description, confidence, tags, created/updated dates, and any linked evidence (snippet, source, date)
- **Add Memory** — full form (title, description, type, ledger, confidence, tags, optional supporting evidence)
- **Edit Memory** — modify title, description, type, confidence, and tags on an existing memory
- **Delete Memory** — with a confirmation step before removing

### Settings (`/settings`)
- **General** — application preferences (currently frontend-only/preview, clearly labeled as such)
- **Knowledge** — default confidence for new memories (actually wired into Add Memory), show/hide tags on memory cards, auto-categorization toggle (labeled as reserved for the future AI pipeline)
- **Data** — import knowledge from a JSON file, export as JSON or Markdown, and reset back to the original mock data

### Import / Export
- Import: pick a `.json` file → parse → validate every item individually → preview what's valid vs. skipped (with reasons) → confirm → added to shared state. Invalid JSON or a wrong file shape fails gracefully with a clear message, never a crash.
- Export: downloads either a full JSON snapshot (re-importable back into this app) or a readable Markdown summary grouped by ledger — both entirely browser-side, no backend involved.

## Architecture notes

- **Shared state:** a small React Context (`KnowledgeProvider`) holds the live list of knowledge items and evidence, so the Dashboard, ledger pages, and Settings all stay in sync when something is added, imported, edited, or deleted. A second, separate context (`SettingsProvider`) holds UI preferences. No external state management library is used.
- **No persistence yet:** all state above lives in memory for the browser tab's lifetime and resets on refresh. This is intentional at this stage — real persistence is backend work.
- **Data layer separated from UI:** mock data lives under `lib/mock-data/`, shared types in `lib/types.ts`, and derived/aggregate logic (stats, confidence scoring, filtering helpers) in `lib/dashboard-utils.ts` and `lib/ledger-utils.ts` — components never compute this themselves, so swapping mock data for real API calls later shouldn't require touching the components.
- **Self-built modals/drawers:** the memory detail drawer, Add/Edit Memory dialogs, and Import dialog are built with plain positioned `div`s rather than a shared Dialog/Sheet primitive, since the project's actual Base UI `Sheet`/`Dialog` components haven't been available to build against yet. These can be swapped for the real components later without changing their props.

## Explicitly not built yet

- Backend / database / persistence
- Authentication
- Real AI extraction from conversation exports (import currently expects already-structured JSON, not raw conversations)
- Browser extension
- Deployment

## Project structure

```
app/
  page.tsx                    Dashboard
  ledger/[id]/page.tsx        Ledger detail
  settings/page.tsx           Settings
components/
  layout/                     Sidebar, AppShell, PageHeader
  dashboard/                  StatCard, RecentActivity
  ledger/                     LedgerCard, MemoryCard/List/Detail, Add/Edit dialogs
  settings/                   Toggle, SettingsRow, SettingsSection
  data/                       ImportDialog
  ui/                         shadcn primitives (Button, Card, Sheet)
lib/
  types.ts                    Core data model (Ledger, KnowledgeItem, Evidence)
  mock-data/                  Seed data
  knowledge-context.tsx       Shared items/evidence state
  settings-context.tsx        Shared UI preferences state
  dashboard-utils.ts          Stats, confidence scoring, formatting
  ledger-utils.ts             Ledger/evidence lookups
  import-utils.ts             Import validation
  export-utils.ts             JSON/Markdown export
```

---
*Last updated after the Memory CRUD (Add/Edit/Delete) feature. Update this file as new phases land.*
