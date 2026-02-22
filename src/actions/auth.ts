"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth/server";
import type { ActionResult } from "@/types";

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function signupAction(data: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  try {
    await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Signup failed",
    };
  }
}
