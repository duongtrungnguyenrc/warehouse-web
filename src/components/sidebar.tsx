import { ArrowDownToLine, ArrowUpFromLine, Bot, ChartLine, Package, Users, Warehouse } from "lucide-react";
import { Link, useLocation } from "react-router";

import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";

type Navigation = {
  name: string;
  href: string;
  icon: any;
  roles: (Role | "*")[];
};

const navigation: Navigation[] = [
  { name: "Warehouses", href: "/", icon: Warehouse, roles: ["*"] },
  { name: "Statistics", href: "/stats", icon: ChartLine, roles: ["MANAGER"] },
  { name: "Products", href: "/products", icon: Package, roles: ["INVENTORY_STAFF", "MANAGER"] },
  { name: "Inbound", href: "/inbound", icon: ArrowDownToLine, roles: ["MANAGER", "INVENTORY_STAFF"] },
  { name: "Outbound", href: "/outbound", icon: ArrowUpFromLine, roles: ["MANAGER", "INVENTORY_STAFF"] },
  { name: "Users", href: "/users", icon: Users, roles: ["ADMIN"] },
  { name: "Bot", href: "/bot", icon: Bot, roles: ["*"] },
];

export function Sidebar() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

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
            {navigation.filter(hasAccess).map((item) => {
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
