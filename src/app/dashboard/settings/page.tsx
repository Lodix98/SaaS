import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signout, createBillingPortalSession } from "@/lib/actions";
import { User, CreditCard, LogOut, Shield } from "lucide-react";

const subscriptionLabels: Record<string, string> = {
  trialing: "Trial",
  active: "Active",
  past_due: "Past Due",
  canceled: "Canceled",
  inactive: "Inactive",
};

const subscriptionColors: Record<string, string> = {
  trialing: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  past_due: "bg-red-100 text-red-700",
  canceled: "bg-gray-100 text-gray-600",
  inactive: "bg-gray-100 text-gray-600",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!dbUser) redirect("/login");

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and billing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Account Information
          </CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="name"
            label="Name"
            value={dbUser.name ?? ""}
            readOnly
            disabled
          />
          <Input
            id="email"
            label="Email"
            value={dbUser.email}
            readOnly
            disabled
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Subscription
          </CardTitle>
          <CardDescription>Your current plan and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Plan</p>
              <p className="text-xs text-gray-500 mt-0.5">$29/month - Monthly Close Tracking</p>
            </div>
            <Badge className={subscriptionColors[dbUser.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}>
              {subscriptionLabels[dbUser.subscriptionStatus] ?? dbUser.subscriptionStatus}
            </Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Manage Billing</p>
              <p className="text-xs text-gray-500 mt-0.5">View invoices, update payment method</p>
            </div>
            <form action={createBillingPortalSession}>
              <Button type="submit" variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing Portal
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </CardTitle>
          <CardDescription>Sign out of your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signout}>
            <Button variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
