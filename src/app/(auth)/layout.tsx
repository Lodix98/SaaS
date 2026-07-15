import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none" />
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-400 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">CC</span>
        </div>
        <span className="font-semibold text-lg text-gray-900">CloseCycle</span>
      </Link>
      {children}
    </div>
  );
}
