import { ArrowDownToLine, ArrowUpFromLine, BarChart3, Home, Menu, Package, Settings, Users, Warehouse } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Quản Lý Kho", href: "/warehouses", icon: Warehouse },
  { name: "Quản Lý Hàng Hóa", href: "/products", icon: Package },
  { name: "Nhập Kho", href: "/inbound", icon: ArrowDownToLine },
  { name: "Xuất Kho", href: "/outbound", icon: ArrowUpFromLine },
  { name: "Báo Cáo", href: "/reports", icon: BarChart3 },
  { name: "Người Dùng", href: "/users", icon: Users },
  { name: "Cài Đặt", href: "/settings", icon: Settings },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">WMS System</h1>
            <p className="text-sm text-gray-500">Quản Lý Kho Hàng</p>
          </div>

          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
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
