"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signout } from "@/lib/actions";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface UserProp {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav({ user }: { user: UserProp | null }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                CloseCycle
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Avatar
                  size="sm"
                  src={user?.avatarUrl ?? undefined}
                  fallback={user?.name ?? user?.email ?? "U"}
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user?.name ?? user?.email}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name ?? "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <form action={signout}>
                        <button
                          type="submit"
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                    isActive
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
