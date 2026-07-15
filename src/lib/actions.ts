"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (authError) throw new Error(authError.message);

  if (authData.user) {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email,
        name,
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await prisma.client.create({
    data: {
      userId: user.id,
      name,
      email,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function updateClientStatus(cycleId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.monthlyCycle.update({
    where: { id: cycleId },
    data: { status },
  });

  revalidatePath("/clients");
}

export async function addDocumentTemplate(clientId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const reminderDay = parseInt(formData.get("reminderDay") as string) || 1;

  await prisma.documentTemplate.create({
    data: {
      clientId,
      name,
      description,
      reminderDay,
    },
  });

  revalidatePath(`/clients/${clientId}`);
  redirect(`/clients/${clientId}`);
}

export async function deleteDocumentTemplate(templateId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const template = await prisma.documentTemplate.findUnique({
    where: { id: templateId },
    select: { clientId: true },
  });

  if (!template) throw new Error("Template not found");

  await prisma.documentTemplate.delete({
    where: { id: templateId },
  });

  revalidatePath(`/clients/${template.clientId}`);
}

export async function completeOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingCompleted: true },
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function createCheckoutSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { stripe } = await import("@/lib/stripe");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) throw new Error("User not found");

  let stripeCustomerId = dbUser.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: dbUser.email,
      name: dbUser.name ?? undefined,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  if (!session.url) throw new Error("Failed to create checkout session");

  redirect(session.url);
}

export async function createBillingPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { stripe } = await import("@/lib/stripe");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeCustomerId) throw new Error("No billing customer found");

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  redirect(session.url);
}

export async function archiveClient(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const clientId = formData.get("clientId") as string;

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: user.id },
  });

  if (!client) throw new Error("Client not found");

  await prisma.client.update({
    where: { id: clientId },
    data: { status: "archived" },
  });

  revalidatePath("/clients");
  redirect("/dashboard/clients");
}

export async function cancelSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { stripe } = await import("@/lib/stripe");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeSubscriptionId) throw new Error("No active subscription");

  await stripe.subscriptions.update(dbUser.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  revalidatePath("/settings");
  redirect("/settings");
}
