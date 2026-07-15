"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

interface DocTemplate {
  id: string;
  name: string;
  description: string | null;
}

interface Submission {
  id: string;
  documentTemplateId: string | null;
  fileUrl: string;
  fileName: string | null;
  notes: string | null;
  submittedAt: Date | string;
}

export function PortalView({
  clientId,
  cycleId,
  token,
  documentTemplates,
  submissions,
  currentStatus,
}: {
  clientId: string;
  cycleId: string | null;
  token: string;
  documentTemplates: DocTemplate[];
  submissions: Submission[];
  currentStatus: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  async function handleUpload(formData: FormData) {
    setUploading(true);
    formData.append("clientId", clientId);
    formData.append("cycleId", cycleId ?? "");
    formData.append("token", token);

    try {
      const res = await fetch("/api/client-portal/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadedFiles((prev) => [...prev, formData.get("file") as string]);
      }
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  const overdue = currentStatus === "overdue" || currentStatus === "awaiting_docs";

  return (
    <div>
      {overdue && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm font-medium">Documents are overdue</p>
          <p className="text-red-600 text-sm mt-1">Please upload your documents as soon as possible.</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
          Current Status
        </h2>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusLabel(currentStatus)}
        </span>
      </div>

      {documentTemplates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Documents Needed
          </h2>
          <div className="space-y-2">
            {documentTemplates.map((tpl) => {
              const submitted = submissions.some((s) => s.documentTemplateId === tpl.id);
              return (
                <div
                  key={tpl.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    submitted ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tpl.name}</p>
                    {tpl.description && (
                      <p className="text-xs text-gray-500">{tpl.description}</p>
                    )}
                  </div>
                  {submitted ? (
                    <span className="text-xs text-green-600 font-medium">Uploaded</span>
                  ) : (
                    <span className="text-xs text-gray-400">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Upload Documents
        </h2>
        <form action={handleUpload} className="space-y-3">
          <input
            type="file"
            name="file"
            required
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
          />
          <input type="text" name="notes" placeholder="Optional notes..." className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2" />
          <Button type="submit" loading={uploading} className="w-full">
            Upload
          </Button>
        </form>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              {uploadedFiles.length} file(s) uploaded successfully
            </p>
          </div>
        )}

        {submissions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
              Previously Uploaded
            </h3>
            <div className="space-y-2">
              {submissions.map((sub) => (
                <div key={sub.id} className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{sub.fileName ?? "Document"} uploaded {new Date(sub.submittedAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
