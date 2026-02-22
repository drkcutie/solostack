# SoloStack

## Stack

Next.js 16 App Router, TypeScript, Tailwind CSS v4, Better Auth, Drizzle ORM + PostgreSQL, Server Actions, React Hook Form + Zod, React Query, Zustand, Resend, Biome, Framer Motion, Recharts, date-fns, sonner, lucide-react, shadcn/ui, pnpm

## Plugin Workflows

### Context7 — Docs Lookup

**ALWAYS** query Context7 before writing code that uses any library. Not after, not "if unsure" — before.

```
Libraries to look up: Better Auth, Drizzle ORM, React Hook Form, Next.js 16,
shadcn/ui, Zustand, sonner, React Query, Framer Motion, Recharts, date-fns, Zod
```

### Superpowers — Development Workflows

Invoke based on task type:

| Task | Skill to invoke |
|---|---|
| New feature | `brainstorming` → `writing-plans` → `executing-plans` |
| Bug fix | `systematic-debugging` |
| Writing code | `test-driven-development` |
| Multi-step work | `dispatching-parallel-agents` or `subagent-driven-development` |
| Done coding | `verification-before-completion` → `requesting-code-review` |
| Branch complete | `finishing-a-development-branch` |
| Receiving feedback | `receiving-code-review` |
| Feature isolation | `using-git-worktrees` |

### Frontend Design — UI Quality

Invoke when building any UI component, page, or layout. Produces production-grade design instead of generic AI aesthetics.

### Custom Skills — Scaffolding

| Skill | Trigger |
|---|---|
| `scaffold-feature` | "Add [entity] feature" — generates schema + validator + action + page + form |
| `scaffold-crud` | "Create CRUD for [entity]" — full create/read/update/delete with list page |
| `scaffold-component` | "Create [type] component" — data-table, form, modal, or dashboard-card |

## Architecture

### Data Access: src/lib/data/

Shared data functions live here. Called by server components directly and by route handlers for client refetching.

```tsx
// src/lib/data/projects.ts
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getProjects(userId: string) {
  return db.select().from(project).where(eq(project.userId, userId));
}
```

### Reads: Server Components → lib/data → Drizzle → Postgres

```tsx
// src/app/(app)/dashboard/page.tsx
import { getProjects } from "@/lib/data/projects";
import { requireAuth } from "@/lib/auth/helpers";

export default async function DashboardPage() {
  const session = await requireAuth();
  const projects = await getProjects(session.user.id);
  return <ProjectList projects={projects} />;
}
```

### Client Reads: Route Handlers (GET) → lib/data

When a client component needs to refetch data (polling, manual refresh), expose a thin GET route handler. Server actions are POST — not cacheable by browsers or CDNs.

```tsx
// src/app/api/projects/route.ts
import { getProjects } from "@/lib/data/projects";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getProjects(session.user.id);
  return NextResponse.json(data);
}
```

### Writes: Server Actions in src/actions/

```tsx
// src/actions/project.ts
"use server";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";

export async function createProject(input: { name: string }) {
  const session = await requireAuth();
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
  await db.insert(project).values({ id: nanoid(), name: parsed.data.name, userId: session.user.id });
  revalidatePath("/dashboard");
  return { success: true };
}
```

### Forms: React Hook Form + Zod resolver

```tsx
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProjectInput>({
  resolver: zodResolver(createProjectSchema),
});
```

### State: Zustand (client only)

```tsx
import { useAppStore } from "@/stores/app-store";
const { sidebarOpen, toggleSidebar } = useAppStore();
```

### Auth (server): requireAuth()

```tsx
const session = await requireAuth(); // redirects to /login if unauthenticated
```

### Auth (client): useSession(), signIn, signUp, signOut

```tsx
const { data: session } = useSession();
await signIn.email({ email, password });
await signUp.email({ name, email, password });
await signOut();
```

### Proxy (Next.js 16): src/proxy.ts

```tsx
// Next.js 16 renamed middleware to proxy
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  // redirect logic
}
```

### Toasts: sonner

```tsx
import { toast } from "sonner";
toast.success("Saved!");
toast.error("Something went wrong");
```

## File Conventions

| Directory | Purpose | Example |
|---|---|---|
| `src/actions/` | Server actions (writes) | `project.ts` |
| `src/app/` | Pages and layouts | `(app)/dashboard/page.tsx` |
| `src/app/api/` | Route handlers (client reads) | `projects/route.ts` |
| `src/components/` | React components | `auth/login-form.tsx` |
| `src/components/ui/` | shadcn/ui components | `button.tsx`, `input.tsx` |
| `src/lib/data/` | Data access functions | `projects.ts` |
| `src/lib/db/` | Database and schema | `index.ts`, `schema.ts` |
| `src/lib/auth/` | Auth config | `server.ts`, `client.ts`, `helpers.ts` |
| `src/lib/validators/` | Zod schemas | `auth.ts`, `project.ts` |
| `src/lib/email/` | Email sending | `index.ts` |
| `src/stores/` | Zustand stores | `app-store.ts` |
| `src/types/` | TypeScript types | `index.ts` |
| `src/proxy.ts` | Auth route protection | Next.js 16 proxy |

## Adding a Feature

1. **Schema** — Add table to `src/lib/db/schema.ts`
2. **Validator** — Add Zod schema to `src/lib/validators/`
3. **Data** — Add query functions to `src/lib/data/`
4. **Action** — Add server action to `src/actions/` (writes only)
5. **Route** — Add GET route handler to `src/app/api/` (only if client needs to refetch)
6. **Page** — Add page to `src/app/`
7. **Form** — Add form component to `src/components/`

Or invoke the `scaffold-feature` skill to generate files at once.

## Code Style

- Double quotes, semicolons, 2-space indent
- Use `type` imports: `import type { Foo } from "bar"`
- Named exports only (no default exports except pages)
- Use `cn()` from `@/lib/utils` for conditional classNames
- Biome for linting and formatting (not ESLint/Prettier)
- Neutral color palette for UI (neutral-900, neutral-500, neutral-50)

## Deployment

- **Platform**: Coolify on Hetzner CPX22 Singapore
- **Flow**: `git push` to `main` auto-deploys
- **No Vercel** — standalone output with Docker

## Data Fetching

### Pattern 1: Server component props (default — 90% of cases)

Server component fetches via `lib/data`, passes data as props to client components.

```tsx
export default async function ProjectsPage() {
  const session = await requireAuth();
  const projects = await getProjects(session.user.id);
  return <ProjectTable projects={projects} />;
}
```

### Pattern 2: Streaming with use() + Suspense (slow queries)

Pass an unawaited promise from server component, client unwraps with React `use()`.

```tsx
// Server component — don't await
export default function AnalyticsPage() {
  const data = getAnalytics();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsChart data={data} />
    </Suspense>
  );
}

// Client component — unwrap with use()
"use client";
import { use } from "react";
export function AnalyticsChart({ data }: { data: Promise<Analytics[]> }) {
  const analytics = use(data);
  return <div>{/* render */}</div>;
}
```

### Pattern 3: React Query + Route Handler (polling / optimistic updates)

Use only when client needs to refetch without navigation. Prefetch on server with HydrationBoundary, refetch on client via GET route handler.

```tsx
// Server component — prefetch
export default async function NotificationsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(session.user.id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationList />
    </HydrationBoundary>
  );
}

// Client component — refetch via GET route handler
"use client";
export function NotificationList() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetch("/api/notifications").then(r => r.json()),
    refetchInterval: 10_000,
  });
}
```

### Data layer rules

- **Data functions** (`src/lib/data/`): Shared query logic, called by server components and route handlers
- **Server actions** (`src/actions/`): Writes only (POST) — mutations, then `revalidatePath()`
- **Route handlers** (`src/app/api/`): Client reads only (GET) — cacheable, for React Query `queryFn`
- **No useEffect for fetching** — use server components or React Query
- **No server actions for reads** — they're POST, not cacheable by browsers/CDNs

## Don'ts

- No server actions for reads — they're POST, not cacheable. Use `lib/data` + route handlers
- No useEffect for data fetching — use server components or React Query
- No client-side fetch for initial page data — fetch in server components
- No ESLint or Prettier — use Biome
- No npm or yarn — use pnpm
- No `useState` for forms — use React Hook Form
- No server imports in client components
- No raw SQL — use Drizzle ORM
- No skipping Zod validation in server actions
- No `middleware.ts` — use `proxy.ts` (Next.js 16)
- No writing library code without checking Context7 first
