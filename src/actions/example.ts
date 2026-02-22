"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/helpers";
import type { ActionResult } from "@/types";

// Example server action pattern:
//
// 1. Authenticate the user with requireAuth()
// 2. Validate input with a Zod schema
// 3. Perform the database operation with Drizzle
// 4. Revalidate any cached paths
// 5. Return a typed ActionResult

export async function exampleAction(input: {
  title: string;
}): Promise<ActionResult<{ id: string }>> {
  // Step 1: Authenticate — redirects to /login if no session
  const session = await requireAuth();

  // Step 2: Validate input
  // const parsed = exampleSchema.safeParse(input);
  // if (!parsed.success) {
  //   return { success: false, error: parsed.error.issues[0].message };
  // }

  // Step 3: Database operation
  // const [item] = await db.insert(example).values({
  //   id: nanoid(),
  //   title: input.title,
  //   userId: session.user.id,
  // }).returning();

  // Step 4: Revalidate cached data
  revalidatePath("/dashboard");

  // Step 5: Return result
  return {
    success: true,
    data: { id: session.user.id },
  };
}
