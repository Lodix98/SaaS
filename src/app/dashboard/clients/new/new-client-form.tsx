"use client";

import { useActionState } from "react";
import { createClientAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

async function createAction(prev: { error: string } | null, formData: FormData) {
  try {
    await createClientAction(formData);
  } catch (e) {
    return { error: (e as Error).message };
  }
  return null;
}

export function NewClientForm() {
  const [state, formAction, pending] = useActionState(createAction, null);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Client Name"
            placeholder="e.g. Smith Accounting LLC"
            required
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address (optional)"
            placeholder="client@example.com"
          />
          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}
          <div className="flex gap-4">
            <Button type="submit" loading={pending}>
              Add Client
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
