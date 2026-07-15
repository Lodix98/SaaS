import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await request.json();

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: user.id },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.clientPortalSession.create({
    data: {
      clientId,
      token,
      expiresAt,
    },
  });

  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal?token=${token}`;

  if (client.email) {
    await resend.emails.send({
      from: "CloseCycle <notifications@closecycle.app>",
      to: client.email,
      subject: `Document upload request for ${client.name}`,
      html: `
        <p>Hello,</p>
        <p>Your bookkeeper has requested your monthly documents.</p>
        <p>Click the link below to upload your documents:</p>
        <p><a href="${portalUrl}" style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Upload Documents</a></p>
        <p>This link expires in 7 days.</p>
        <p>Thank you,<br/>CloseCycle</p>
      `,
    });
  }

  return NextResponse.json({ success: true, portalUrl });
}
