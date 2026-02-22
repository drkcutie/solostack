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

### Reads: Server Components → Drizzle → Postgres

```tsx
// src/app/(app)/dashboard/page.tsx
import { db } from "@/lib/db";
import { project } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth/helpers";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const session = await requireAuth();
  const projects = await db.select().from(project).where(eq(project.userId, session.user.id));
  return <ProjectList projects={projects} />;
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
| `src/actions/` | Server actions | `auth.ts`, `project.ts` |
| `src/app/` | Pages and layouts | `(app)/dashboard/page.tsx` |
| `src/components/` | React components | `auth/login-form.tsx` |
| `src/components/ui/` | shadcn/ui components | `button.tsx`, `input.tsx` |
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
3. **Action** — Add server action to `src/actions/`
4. **Page** — Add page to `src/app/`
5. **Form** — Add form component to `src/components/`

Or invoke the `scaffold-feature` skill to generate all five files at once.

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

Always use React Server Components (RSC) to fetch data. Never use useEffect or client-side fetching for initial page data.

```tsx
// CORRECT: Fetch in server component
export default async function ProjectsPage() {
  const session = await requireAuth();
  const projects = await db.select().from(project).where(eq(project.userId, session.user.id));
  return <ProjectTable projects={projects} />;
}
```

```tsx
// WRONG: Don't do this
"use client";
export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { fetch("/api/projects").then(...) }, []); // NO
}
```

- **Reads**: Server Components → Drizzle → Postgres (no API routes, no useEffect)
- **Mutations**: Server Actions called from client components
- **Revalidation**: `revalidatePath()` after mutations to refresh RSC data
- **Client state**: React Query only for polling, optimistic updates, or data that changes without navigation

## Don'ts

- No API routes for CRUD — use server actions
- No ESLint or Prettier — use Biome
- No npm or yarn — use pnpm
- No `useState` for forms — use React Hook Form
- No server imports in client components
- No raw SQL — use Drizzle ORM
- No skipping Zod validation in server actions
- No `middleware.ts` — use `proxy.ts` (Next.js 16)
- No writing library code without checking Context7 first
- No useEffect for data fetching — use RSC
- No client-side fetch for initial page data — fetch in server components
