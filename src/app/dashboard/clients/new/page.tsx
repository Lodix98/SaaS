import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewClientForm } from "./new-client-form";

export default async function NewClientPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Client</h1>
      <NewClientForm />
    </div>
  );
}
