# ClipMindAI

ClipMindAI is the all-in-one AI Story Reel Studio. This repository hosts the marketing website.

## Files
- `index.html` — Landing page
- `styles.css` — Styling
- `script.js` — Small UI interactions

## Run locally
Open `index.html` in your browser.

## Customize
Edit content directly in `index.html` and update styling in `styles.css`.

## Webapp (Full-Stack App)

A complete Next.js full-stack application is located in the `webapp/` directory.

### Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **NextAuth.js v5** (Credentials + Google OAuth, JWT sessions)
- **Prisma 7** + PostgreSQL (via `@prisma/adapter-pg`)
- **Stripe** (subscriptions: Free / Pro / Studio)
- **Tailwind CSS v4**
- **Zod** (validation), **bcryptjs** (password hashing)

### Features

- 🔐 Authentication (email/password + Google OAuth)
- 🎬 7-step AI reel generation wizard (Idea → Story → Scenes → Clips → Voice → Captions → Edit)
- 📁 Project management (CRUD)
- 💳 Stripe subscription billing + webhook handler
- 📲 Social account connection & auto-posting stubs (YouTube, Instagram)
- 🛡️ Admin panel with role-based access control
- 🌙 Dark theme UI

### Setup

```bash
cd webapp
cp .env.example .env.local
# Fill in your real credentials in .env.local

npm install
npx prisma migrate deploy   # run against real DB
npm run dev
```

### Environment Variables

Copy `webapp/.env.example` to `webapp/.env.local` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase recommended) |
| `AUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ELEVENLABS_API_KEY` | ElevenLabs voice generation |
| `PIKA_API_KEY` | Pika video generation (mock until production) |

### Project Structure

```
webapp/
├── prisma/
│   ├── schema.prisma        # DB models
│   └── migrations/          # SQL migration history
├── prisma.config.ts         # Prisma 7 datasource config
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, signup pages
│   │   ├── (dashboard)/     # Protected app pages
│   │   └── api/             # API routes
│   ├── components/          # Navbar, Sidebar, Providers
│   ├── lib/                 # prisma.ts, auth.ts, stripe.ts
│   └── middleware.ts        # Auth + RBAC middleware
└── .env.example
```

