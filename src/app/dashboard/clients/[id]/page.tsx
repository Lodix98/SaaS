import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getStatusColor, getStatusLabel, formatMonth } from "@/lib/utils";
import { addDocumentTemplate, deleteDocumentTemplate, archiveClient } from "@/lib/actions";
import { Plus, Trash2, FileText, Archive, ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      documentTemplates: { orderBy: { name: "asc" } },
      monthlyCycles: {
        orderBy: { month: "desc" },
        include: { documentSubmissions: true, _count: { select: { documentSubmissions: true } } },
      },
    },
  });

  if (!client || client.userId !== user.id) {
    notFound();
  }

  const totalSubmissions = client.monthlyCycles.reduce(
    (sum: number, cycle: { _count: { documentSubmissions: number } }) => sum + cycle._count.documentSubmissions, 0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/clients"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <Badge className={getStatusColor(client.status)}>
                {getStatusLabel(client.status)}
              </Badge>
            </div>
            {client.email && (
              <p className="text-sm text-gray-500 mt-1">{client.email}</p>
            )}
          </div>
        </div>
        <form action={archiveClient}>
          <input type="hidden" name="clientId" value={client.id} />
          <Button type="submit" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <Archive className="h-4 w-4 mr-2" />
            Archive Client
          </Button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Monthly Cycle History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.monthlyCycles.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No monthly cycles yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Month
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Status
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Documents
                        </th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {client.monthlyCycles.map((cycle: { id: string; month: Date; status: string; updatedAt: Date; _count: { documentSubmissions: number }; documentSubmissions: { id: string }[] }) => (
                        <tr key={cycle.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {formatMonth(cycle.month)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(cycle.status)}>
                              {getStatusLabel(cycle.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {cycle._count.documentSubmissions} submitted
                          </td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">
                            {cycle.updatedAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Templates
              </CardTitle>
              <CardDescription>
                Types of documents you collect each month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.documentTemplates.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No document templates yet
                </p>
              ) : (
                <div className="space-y-2">
                  {client.documentTemplates.map((template: { id: string; name: string; description: string | null; reminderDay: number }) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        {template.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          Reminder day: {template.reminderDay}
                        </p>
                      </div>
                      <form action={deleteDocumentTemplate.bind(null, template.id)}>
                        <button
                          type="submit"
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <form action={addDocumentTemplate.bind(null, client.id)} className="space-y-3">
                <Input
                  id="name"
                  name="name"
                  label="Template Name"
                  placeholder="e.g. Bank Statements"
                  required
                />
                <Input
                  id="description"
                  name="description"
                  label="Description (optional)"
                  placeholder="Monthly bank statements"
                />
                <Input
                  id="reminderDay"
                  name="reminderDay"
                  label="Reminder Day"
                  type="number"
                  placeholder="1"
                  defaultValue="1"
                  min="1"
                  max="28"
                />
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge className={getStatusColor(client.status)}>
                  {getStatusLabel(client.status)}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Templates</span>
                <span className="font-medium">{client.documentTemplates.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Cycles</span>
                <span className="font-medium">{client.monthlyCycles.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Submissions</span>
                <span className="font-medium">{totalSubmissions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">{client.createdAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
