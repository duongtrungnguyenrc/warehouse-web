import { ArrowDownToLine, ArrowUpFromLine, BarChart3, Home, Package, Settings, Users, Warehouse } from "lucide-react";
import { Link, useLocation } from "react-router";

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

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-sm border-r">
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
