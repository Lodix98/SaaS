import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { Plus, Users, ChevronRight } from "lucide-react";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    include: { _count: { select: { monthlyCycles: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
              You haven&apos;t added any clients yet.
            </p>
            <Link href="/dashboard/clients/new">
              <Button>Add Your First Client</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client: { id: string; name: string; email: string | null; status: string; _count: { monthlyCycles: number } }) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {client.name}
                      </h3>
                      {client.email && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {client.email}
                        </p>
                      )}
                      <div className="flex items-center mt-3 space-x-2">
                        <Badge className={getStatusColor(client.status)}>
                          {getStatusLabel(client.status)}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {client._count.monthlyCycles} cycle
                          {client._count.monthlyCycles !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
