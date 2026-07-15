"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboarding, addDocumentTemplate } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Building2, FileText } from "lucide-react";
import { Logo } from "@/components/logo";

const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "client", title: "Add Client", icon: Building2 },
  { id: "templates", title: "Templates", icon: FileText },
  { id: "done", title: "Done", icon: CheckCircle },
];

export function OnboardingForm({ userName }: { userName?: string }) {
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<string[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAddClient() {
    if (!clientName.trim()) {
      setError("Client name is required");
      return;
    }
    setPending(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clientName, email: clientEmail }),
      });
      if (!res.ok) throw new Error("Failed to create client");
      const client = await res.json();
      setClientId(client.id);
      setStep(2);
    } catch (e) {
      setError((e as Error).message);
    }
    setPending(false);
  }

  async function handleAddTemplate() {
    if (!templateName.trim() || !clientId) return;
    setPending(true);
    try {
      const formData = new FormData();
      formData.set("name", templateName);
      formData.set("description", "");
      formData.set("reminderDay", "1");
      await addDocumentTemplate(clientId, formData);
      setTemplates([...templates, templateName]);
      setTemplateName("");
    } catch {
      // ignore
    }
    setPending(false);
  }

  async function handleComplete() {
    setPending(true);
    try {
      await completeOnboarding();
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
    setPending(false);
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-4">
          <Logo className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">CloseCycle</h1>
        <p className="text-gray-500 mt-1">Monthly close tracking for solo bookkeepers</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i <= step;
            const isCurrent = i === step;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 ${
                    isCurrent ? "text-blue-600 font-medium" : isActive ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-0.5 bg-gray-200 w-full" />
          <div
            className="absolute top-0 left-0 h-0.5 bg-blue-600 transition-all"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          {step === 0 && (
            <>
              <CardTitle className="text-xl">Welcome to CloseCycle{userName ? `, ${userName}` : ""}!</CardTitle>
              <CardDescription>
                Let&apos;s get you set up in just a few steps. You&apos;ll add your first client and configure what documents you need each month.
              </CardDescription>
            </>
          )}
          {step === 1 && (
            <>
              <CardTitle>Add Your First Client</CardTitle>
              <CardDescription>
                Enter the client details to get started tracking their monthly close.
              </CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>
                What documents do you need from {clientName} each month? Add your first one.
              </CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle>You&apos;re All Set!</CardTitle>
              <CardDescription>
                Your first client is set up. We&apos;ll start sending reminders.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Step 1: Add a client</p>
                  <p className="text-xs text-blue-700 mt-0.5">Enter your first client&apos;s name and email</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50">
                <FileText className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">Step 2: Set up templates</p>
                  <p className="text-xs text-indigo-700 mt-0.5">Define which documents you collect monthly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Step 3: Done!</p>
                  <p className="text-xs text-green-700 mt-0.5">Start tracking your monthly close cycle</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input
                id="clientName"
                label="Client Name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
              <Input
                id="clientEmail"
                label="Client Email (optional)"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {templates.length > 0 && (
                <div className="space-y-2">
                  {templates.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 p-2 rounded-md bg-green-50 text-green-700 text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  id="templateName"
                  placeholder="e.g. Bank Statements"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTemplate}
                  disabled={!templateName.trim() || pending}
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                You can always add more templates later
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                You&apos;re ready to start tracking your monthly close cycles.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            {step > 0 && step < 3 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 0 && (
              <Button type="button" onClick={() => setStep(1)}>
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 1 && (
              <Button type="button" onClick={handleAddClient} loading={pending}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 2 && (
              <Button type="button" onClick={() => setStep(3)}>
                Skip & Finish
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {step === 3 && (
              <Button type="button" onClick={handleComplete} loading={pending}>
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
