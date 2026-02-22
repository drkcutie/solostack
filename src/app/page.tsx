iymport Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">SoloStack</h1>
        <p className="max-w-md text-lg text-neutral-500">
          Next.js 16 + Better Auth + Drizzle + Server Actions + Zustand
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-neutral-300 bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
