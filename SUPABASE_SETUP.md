# Backend setup — Universo AGV Landing

This project is wired to **Lovable Cloud** (Supabase under the hood). The
table, RLS policies and environment variables are already provisioned in
the connected project. The steps below let any environment (a fresh
Supabase project, a fork, a self-host, Netlify, etc.) reproduce the same
state.

---

## 1. Environment variables

Copy `.env.example` to `.env` and fill in the values from the Supabase
project dashboard → **Project Settings → API**.

| Variable | Where | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser | Public, safe to commit |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser | Anon / publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Browser | Project ref |
| `SUPABASE_URL` | Server | Same URL as above |
| `SUPABASE_PUBLISHABLE_KEY` | Server | Same anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | **Secret** — never expose |

On Netlify add them under **Site settings → Environment variables**.

---

## 2. Database — `leads` table

Run this SQL once in the Supabase **SQL editor** (already applied on
this project's connected backend):

```sql
CREATE TABLE public.leads (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        TEXT NOT NULL,
  email       TEXT,
  placa       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
```

---

## 3. Row-Level Security

The lead form is **public** (no login required). Anyone can submit a
lead, but **only authenticated dashboard users** can read them.

```sql
-- Public insert (used by the landing-page form)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Read access restricted to logged-in users (admin / CRM)
CREATE POLICY "Authenticated can read leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);
```

`UPDATE` and `DELETE` are intentionally **not** allowed from the client.

> ⚠️ The Supabase linter flags `WITH CHECK (true)` on `INSERT` as
> "always true". This is the intended behaviour for a public lead form
> — the form is throttled and validated server-side via the
> `submitLead` server function (`src/lib/leads.functions.ts`) using a
> Zod schema, and the table only stores non-sensitive opt-in data.

---

## 4. Server function

Lead inserts go through a TanStack `createServerFn` (not directly from
the browser) so the payload is validated server-side before hitting the
DB. See `src/lib/leads.functions.ts`.

---

## 5. WhatsApp redirect

After a successful insert the form opens
`https://wa.me/553131578979` in a new tab with the lead data
pre-filled. The tab is **pre-opened synchronously** at click time to
bypass popup blockers, then its location is updated once the server
responds.

---

## 6. Analytics

Conversion events are pushed through `src/lib/analytics.ts` to:

- `window.dataLayer` (GTM / GA4)
- `window.gtag` (GA4)
- `window.fbq` (Meta Pixel)

Tracked events:

| Event | When |
| --- | --- |
| `cta_click` | Any Hero / Nav CTA |
| `form_start` | User focuses the first field |
| `form_submit_success` | DB insert OK |
| `form_submit_error` | DB insert failed |
| `whatsapp_redirect` | WhatsApp tab opened |
| `lead_conversion` | End-to-end conversion completed |

Add GTM / GA4 / Meta Pixel `<script>` tags in `src/routes/__root.tsx`
when ready — no app code changes needed.
