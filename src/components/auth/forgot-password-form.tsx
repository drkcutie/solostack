"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators/auth";

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
        <Link
          href="/login"
          className="inline-block text-sm text-neutral-700 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Forgot Password</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-neutral-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
