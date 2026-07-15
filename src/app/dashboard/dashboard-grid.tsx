"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { updateClientStatus } from "@/lib/actions";
import { getStatusColor, getStatusLabel, formatMonth, cn } from "@/lib/utils";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  monthlyCycles: {
    id: string;
    status: string;
    documentSubmissions: { id: string }[];
  }[];
  documentTemplates: { id: string; name: string }[];
}

interface Stats {
  total: number;
  awaitingDocs: number;
  complete: number;
  overdue: number;
}

const statusOptions = [
  { value: "not_started", label: "Not Started" },
  { value: "awaiting_docs", label: "Awaiting Docs" },
  { value: "received", label: "Received" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "overdue", label: "Overdue" },
];

export function DashboardGrid({
  clients,
  stats,
  currentMonth,
}: {
  clients: Client[];
  stats: Stats;
  currentMonth: Date;
}) {
  const statCards = [
    { label: "Total Clients", value: stats.total, icon: Users, color: "text-blue-600" },
    { label: "Awaiting Docs", value: stats.awaitingDocs, icon: Clock, color: "text-yellow-600" },
    { label: "Complete", value: stats.complete, icon: CheckCircle, color: "text-green-600" },
    { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "text-red-600" },
  ];

  async function handleStatusChange(cycleId: string, status: string) {
    await updateClientStatus(cycleId, status);
  }

  if (clients.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">{formatMonth(currentMonth)}</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
              No clients yet. Add your first client to get started.
            </p>
            <Link href="/dashboard/clients">
              <Button>Add Your First Client</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">{formatMonth(currentMonth)}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{card.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-full bg-gray-50", card.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Close Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Client
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Documents
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((client) => {
                  const cycle = client.monthlyCycles[0];
                  const submittedCount = cycle?.documentSubmissions.length ?? 0;
                  const totalTemplates = client.documentTemplates.length;

                  return (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="flex items-center group"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {client.name}
                            </p>
                            {client.email && (
                              <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {cycle ? (
                          <Badge className={getStatusColor(cycle.status)}>
                            {getStatusLabel(cycle.status)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Cycle</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">
                                {submittedCount}/{totalTemplates} submitted
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full transition-all",
                                  totalTemplates > 0 && submittedCount === totalTemplates
                                    ? "bg-green-500"
                                    : submittedCount > 0
                                    ? "bg-blue-500"
                                    : "bg-gray-200"
                                )}
                                style={{
                                  width: totalTemplates > 0
                                    ? `${(submittedCount / totalTemplates) * 100}%`
                                    : "0%",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Select
                            options={statusOptions}
                            value={cycle?.status ?? "not_started"}
                            onChange={(e) => cycle && handleStatusChange(cycle.id, e.target.value)}
                            className="w-36 text-xs"
                          />
                          <Link href={`/dashboard/clients/${client.id}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
