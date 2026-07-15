"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function signupAction(prev: { error: string } | null, formData: FormData) {
  try {
    await signup(formData);
  } catch (e) {
    return { error: (e as Error).message };
  }
  return null;
}

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, null);

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1.5">Start your 14-day free trial</p>
      </div>

      <form action={formAction} className="space-y-4">
        <Input id="name" name="name" type="text" label="Full Name" placeholder="Jane Doe" required />
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Input id="password" name="password" type="password" label="Password" placeholder="Create a password" required />
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" className="w-full" loading={pending}>Create Account</Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}
