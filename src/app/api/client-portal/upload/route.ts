import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const clientId = formData.get("clientId") as string;
  const cycleId = formData.get("cycleId") as string;
  const token = formData.get("token") as string;
  const notes = formData.get("notes") as string;

  if (!file || !clientId || !token) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify token
  const session = await prisma.clientPortalSession.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!session || session.clientId !== clientId || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const supabase = await createServiceClient();
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("client-documents")
      .upload(`${clientId}/${fileName}`, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("client-documents")
      .getPublicUrl(uploadData.path);

    if (cycleId) {
      await prisma.documentSubmission.create({
        data: {
          monthlyCycleId: cycleId,
          fileUrl: publicUrl,
          fileName: file.name,
          notes: notes || null,
        },
      });

      // Update cycle status if awaiting docs
      const cycle = await prisma.monthlyCycle.findUnique({ where: { id: cycleId } });
      if (cycle && cycle.status === "awaiting_docs") {
        await prisma.monthlyCycle.update({
          where: { id: cycleId },
          data: { status: "received" },
        });
      }
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
