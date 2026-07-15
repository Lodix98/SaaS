import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PortalView } from "./portal-view";
import { Logo } from "@/components/logo";

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600">This link is invalid or expired. Please ask your bookkeeper for a new one.</p>
        </div>
      </div>
    );
  }

  const session = await prisma.clientPortalSession.findUnique({
    where: { token },
    include: {
      client: {
        include: {
          documentTemplates: true,
          monthlyCycles: {
            where: { month: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
            include: { documentSubmissions: true },
          },
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date() || session.usedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600">This link has expired. Please ask your bookkeeper to send a new one.</p>
        </div>
      </div>
    );
  }

  // Mark as used
  await prisma.clientPortalSession.update({
    where: { id: session.id },
    data: { usedAt: new Date() },
  });

  const cycle = session.client.monthlyCycles[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Logo className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{session.client.name}</h1>
            <p className="text-gray-500 mt-1">Monthly Document Upload</p>
          </div>

          <PortalView
            clientId={session.client.id}
            cycleId={cycle?.id ?? null}
            token={token}
            documentTemplates={session.client.documentTemplates}
            submissions={cycle?.documentSubmissions ?? []}
            currentStatus={cycle?.status ?? "not_started"}
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by CloseCycle &mdash; Monthly close tracking for solo bookkeepers
        </p>
      </div>
    </div>
  );
}
