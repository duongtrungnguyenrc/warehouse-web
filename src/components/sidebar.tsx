"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks";
import { NAVIGATION } from "@/lib";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading || !user) return null;

  const hasAccess = (item: Navigation): boolean => {
    return item.roles.includes("*") || item.roles.includes(user.role);
  };

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-sm border-r">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">WMS System</h1>
          <p className="text-sm text-gray-500">Warehouse Management System</p>
        </div>

        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {NAVIGATION.filter(hasAccess).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive ? "bg-blue-50 text-blue-700 border-l-2 border-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
