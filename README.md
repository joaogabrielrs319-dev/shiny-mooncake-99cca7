# Universo AGV — Enterprise SaaS Platform

Premium interactive proposal and CRM platform for vehicle protection consultants.

---

## Stack

React 19 · Vite · TypeScript · TailwindCSS · Framer Motion · Supabase · Zustand · TanStack Query

---

## Setup

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database

Run SQL files in order in Supabase SQL Editor:

```
sql/001_schema.sql   — Tables, indexes, triggers
sql/002_rls.sql      — Row Level Security policies
sql/003_realtime.sql — Realtime channels + seed data
```

### 4. Dev

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

---

## Deploy to Netlify

1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. The `netlify.toml` handles SPA redirects automatically

Or drag-and-drop the `dist/` folder to Netlify after running `npm run build`.

---

## Architecture

```
src/
  app/              — Router
  features/
    auth/           — Login, session management
    dashboard/      — KPIs, charts, hot leads
    proposal-builder/ — Tesla-inspired configurator
    crm/            — Kanban pipeline
    analytics/      — Conversion intelligence, heatmaps
    realtime-tracking/ — Live monitoring
    pricing-engine/ — Dynamic pricing calculation
    vehicle-search/ — Plate lookup + FIPE
    fipe/           — FIPE API integration
    conversion-score/ — Lead scoring algorithm
  shared/
    components/ui/  — Button, Card, Badge
    layouts/        — AppLayout (sidebar + topbar)
    lib/            — Supabase client, QueryClient
    utils/          — cn, format helpers
    types/          — Shared TypeScript interfaces
    styles/         — globals.css + design tokens
```

---

## Features

- **Interactive Proposal Builder** — Tesla-configurator UX with realtime pricing
- **FIPE Integration** — Auto plate lookup + FIPE table (BrasilAPI with mock fallback)
- **Dynamic Pricing Engine** — FIPE × category × region × franchise × plan multipliers
- **CRM Kanban** — 7-stage pipeline with drag-to-move
- **Analytics Dashboard** — Funnel, heatmaps, conversion scores, regional distribution
- **Realtime Monitor** — Live client tracking, event feed, journey visualization
- **Behavioral Tracking** — Batched event queue, session scoring, hot lead detection
- **Conversion Score** — Multi-signal algorithm: time, sections, interactions, CTA, scroll

---

## Security

- Supabase Auth with persistent sessions
- RLS policies on all tables
- Protected routes via Zustand auth state
- Environment variables never exposed to client beyond VITE_ prefix
- LGPD-ready: tracking_token anonymization supported
