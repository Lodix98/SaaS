"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

async function signupAction(
  prev: { error: string } | null,
  formData: FormData
) {
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
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Get started with CloseCycle</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Jane Doe"
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            required
          />
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" loading={pending}>
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
