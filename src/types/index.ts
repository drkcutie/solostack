export type { Session } from "@/lib/auth/server";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
