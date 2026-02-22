import { requireAuth } from "@/lib/auth/helpers";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500">Welcome, {session.user.name}</p>
        <p className="text-sm text-neutral-400">{session.user.email}</p>
      </div>
      <SignOutButton />
    </div>
  );
}
