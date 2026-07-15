import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createBillingPortalSession, cancelSubscription, createCheckoutSession } from "@/lib/actions";
import { CreditCard, AlertTriangle, CheckCircle, XCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!dbUser) redirect("/login");

  const isActive = dbUser.subscriptionStatus === "active" || dbUser.subscriptionStatus === "trialing";
  const isCanceled = dbUser.subscriptionStatus === "canceled";

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/settings"
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500 mt-1">Manage your subscription and invoices</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
            <div>
              <p className="text-lg font-semibold text-gray-900">CloseCycle Pro</p>
              <p className="text-sm text-gray-500 mt-1">$29/month - Monthly Close Tracking</p>
            </div>
            <Badge className={subscriptionColors[dbUser.subscriptionStatus] ?? "bg-gray-100 text-gray-600"}>
              {subscriptionLabels[dbUser.subscriptionStatus] ?? dbUser.subscriptionStatus}
            </Badge>
          </div>

          {dbUser.trialEndsAt && dbUser.subscriptionStatus === "trialing" && (
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Trial Period</p>
                <p className="text-xs mt-0.5">
                  Your trial ends on {dbUser.trialEndsAt.toLocaleDateString()}. 
                  Subscribe to continue using CloseCycle.
                </p>
              </div>
            </div>
          )}

          {isCanceled && (
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-yellow-50 text-yellow-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Subscription Canceled</p>
                <p className="text-xs mt-0.5">
                  Your subscription has been canceled. You can resubscribe at any time.
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            {!isActive && !isCanceled && (
              <form action={createCheckoutSession}>
                <Button type="submit" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Subscribe - $29/month
                </Button>
              </form>
            )}

            {isActive && !isCanceled && (
              <form action={cancelSubscription}>
                <Button type="submit" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </form>
            )}

            <form action={createBillingPortalSession}>
              <Button type="submit" variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Invoices & Manage Billing
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Unlimited clients",
              "Monthly cycle tracking",
              "Automated document reminders",
              "Client portal access",
              "Email support",
            ].map((feature) => (
              <li key={feature} className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
