"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ForgotPasswordInput, forgotPasswordSchema } from "@/lib/validators/auth";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (_data: ForgotPasswordInput) => {
    // TODO: Wire up password reset backend
    // 1. Create a server action that generates a reset token
    // 2. Store token in the verification table
    // 3. Send reset email with link using sendEmail()
    // 4. Add /reset-password page to handle the token
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Check Your Email</h1>
          <p className="mt-2 text-sm text-neutral-500">
            If an account exists with that email, we sent you a password reset link.
          </p>
        </div>
        <Link href="/login" className="inline-block text-sm text-neutral-700 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Forgot Password</h1>
        <p className="mt-1 text-sm text-neutral-500">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            type="email"
            id="email"
            className="mt-1"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-neutral-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
