"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import { useAuth } from "@/hooks";
import { NAVIGATION } from "@/lib";
import { cn } from "@/lib/utils";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const hasAccess = (item: Navigation): boolean => {
    return item.roles.includes("*") || item.roles.includes(user.role);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6">
            <SheetTitle className="text-xl font-bold text-gray-900">WMS System</SheetTitle>
            <SheetDescription className="text-sm text-gray-500">Warehouse Management System</SheetDescription>
          </SheetHeader>

          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {NAVIGATION.filter(hasAccess).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
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
      </SheetContent>
    </Sheet>
  );
}
