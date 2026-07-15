import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentMonthStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function formatMonth(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-600",
    awaiting_docs: "bg-yellow-100 text-yellow-700",
    received: "bg-blue-100 text-blue-700",
    in_progress: "bg-indigo-100 text-indigo-700",
    complete: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
  };
  return colors[status] ?? "bg-gray-100 text-gray-600";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    not_started: "Not Started",
    awaiting_docs: "Awaiting Docs",
    received: "Received",
    in_progress: "In Progress",
    complete: "Complete",
    overdue: "Overdue",
  };
  return labels[status] ?? status;
}

export function getNextMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function getPreviousMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}
