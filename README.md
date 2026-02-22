# SoloStack

A production-ready Next.js starter for solo developers. Ship fast, stay organized.

## Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Better Auth |
| Database | Drizzle ORM + PostgreSQL |
| Data Mutations | Server Actions |
| Forms | React Hook Form + Zod |
| Server State | React Query |
| Client State | Zustand |
| Email | Resend |
| Linting | Biome |
| Animations | Framer Motion |
| Charts | Recharts |
| Dates | date-fns |
| Toasts | sonner |
| Icons | lucide-react |
| Package Manager | pnpm |

## Quick Start

```bash
# Install dependencies
pnpm install

# Start Postgres
pnpm db:up

# Push schema to database
pnpm db:push

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update Packages

```bash
pnpm update
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format with Biome |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:up` | Start Postgres (Docker) |
| `pnpm db:down` | Stop Postgres (Docker) |

## Architecture

```
Client Request
     │
     ▼
┌─────────────┐
│    Proxy     │──── Auth check (cookie)
└──────┬──────┘
       ▼
┌─────────────┐     ┌─────────────┐
│   Server    │────▶│   Drizzle   │────▶ PostgreSQL
│  Component  │     │     ORM     │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Server    │────▶ Drizzle ──▶ PostgreSQL
│  Component  │     │   Action    │
└─────────────┘     └─────────────┘
```

- **Reads**: Server Components → Drizzle → Postgres
- **Writes**: Client Component → Server Action → Drizzle → Postgres
- **Auth (server)**: `requireAuth()` / `getSession()`
- **Auth (client)**: `useSession()`, `signIn`, `signUp`, `signOut`
- **Forms**: React Hook Form + Zod resolver
- **Client state**: Zustand stores
- **Toasts**: sonner

## Project Structure

```
src/
├── actions/                  # Server actions
│   ├── auth.ts               # Login, signup actions
│   └── example.ts            # Example pattern
├── app/
│   ├── api/auth/[...all]/    # Better Auth route handler
│   │   └── route.ts
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (app)/
│   │   └── dashboard/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/                 # Auth forms
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   └── sign-out-button.tsx
│   ├── providers/
│   │   └── query-provider.tsx
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── auth/
│   │   ├── server.ts         # Better Auth server config
│   │   ├── client.ts         # Better Auth client
│   │   └── helpers.ts        # getSession, requireAuth
│   ├── db/
│   │   ├── index.ts          # Drizzle instance
│   │   └── schema.ts         # Database schema
│   ├── email/
│   │   └── index.ts          # Resend email helper
│   ├── validators/
│   │   └── auth.ts           # Zod schemas
│   └── utils.ts              # cn() helper
├── stores/
│   └── app-store.ts          # Zustand store
├── types/
│   └── index.ts              # Shared types
└── proxy.ts                   # Auth proxy (Next.js 16)
```

## Adding a Feature

1. **Schema** — Define table in `src/lib/db/schema.ts`
2. **Validator** — Create Zod schema in `src/lib/validators/`
3. **Action** — Write server action in `src/actions/`
4. **Page** — Add page in `src/app/`
5. **Form** — Build form component in `src/components/`

## Deployment (Coolify on Hetzner)

### 1. Provision Server

- Create a Hetzner CPX22 VPS in Singapore (or your region)
- Install [Coolify](https://coolify.io) on the VPS

### 2. Connect Repository

- In Coolify, add your GitHub repository
- Set the build pack to **Dockerfile**

### 3. Create Postgres Database

- In Coolify, create a new PostgreSQL resource
- Copy the connection string

### 4. Set Environment Variables

In Coolify's environment settings, add:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=SoloStack
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
RESEND_API_KEY=...
```

### 5. Deploy

Push to `main` — Coolify auto-builds and deploys.

### 6. Run Migrations

```bash
# SSH into the server or use Coolify's terminal
pnpm db:push
```

## Cost

| Resource | Cost |
|---|---|
| Hetzner CPX22 (3 vCPU, 4GB RAM) | ~€7.70/mo |
| Domain | ~€1/mo |
| **Total** | **~€8.70/mo** |
