import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentMonthStart } from "@/lib/utils";
import { DashboardGrid } from "./dashboard-grid";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const currentMonth = getCurrentMonthStart();

  const clients = await prisma.client.findMany({
    where: { userId: user.id, status: "active" },
    include: {
      monthlyCycles: {
        where: { month: currentMonth },
        include: { documentSubmissions: true },
      },
      documentTemplates: true,
    },
    orderBy: { name: "asc" },
  });

  for (const client of clients) {
    if (client.monthlyCycles.length === 0) {
      await prisma.monthlyCycle.create({
        data: { clientId: client.id, month: currentMonth, status: "not_started" },
      });
    }
  }

  const updatedClients = await prisma.client.findMany({
    where: { userId: user.id, status: "active" },
    include: {
      monthlyCycles: {
        where: { month: currentMonth },
        include: { documentSubmissions: true },
      },
      documentTemplates: true,
    },
    orderBy: { name: "asc" },
  });

  const stats = {
    total: updatedClients.length,
    awaitingDocs: updatedClients.filter((c: { monthlyCycles: { status: string }[] }) => c.monthlyCycles[0]?.status === "awaiting_docs").length,
    complete: updatedClients.filter((c: { monthlyCycles: { status: string }[] }) => c.monthlyCycles[0]?.status === "complete").length,
    overdue: updatedClients.filter((c: { monthlyCycles: { status: string }[] }) => c.monthlyCycles[0]?.status === "overdue").length,
  };

  return <DashboardGrid clients={updatedClients} stats={stats} currentMonth={currentMonth} />;
}
