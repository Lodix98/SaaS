import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: "active",
              trialEndsAt: new Date(subscription.trial_end! * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          let status: string;
          switch (subscription.status) {
            case "active":
            case "trialing":
              status = "active";
              break;
            case "past_due":
              status = "past_due";
              break;
            case "canceled":
            case "unpaid":
              status = "canceled";
              break;
            default:
              status = "inactive";
          }

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: status as any,
              stripeSubscriptionId: subscription.id,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: "canceled",
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user && invoice.charge) {
          const charge = await stripe.charges.retrieve(invoice.charge);
          if (charge.receipt_url) {
            await resend.emails.send({
              from: "CloseCycle <billing@closecycle.app>",
              to: user.email,
              subject: "Receipt from CloseCycle",
              html: `<p>Thanks for your payment of $${(invoice.amount_paid / 100).toFixed(2)}.</p>
                     <p>View your receipt: <a href="${charge.receipt_url}">${charge.receipt_url}</a></p>`,
            });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await resend.emails.send({
            from: "CloseCycle <billing@closecycle.app>",
            to: user.email,
            subject: "Payment Failed — Update Your Billing",
            html: `<p>Your latest CloseCycle payment of $${(invoice.amount_due / 100).toFixed(2)} failed.</p>
                   <p>Please update your payment method to continue using CloseCycle.</p>`,
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
