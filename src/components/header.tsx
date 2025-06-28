import { Search } from "lucide-react";

import { MobileSidebar } from "@/components/mobile-sidebar";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { UserButton } from "@/components/user-button.tsx";

export function Header() {
  return (
    <header className="bg-white border-b px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar */}
          <MobileSidebar />

          {/* Search - Hidden on small screens */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Tìm kiếm..." className="pl-10 w-64 lg:w-96" />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search button for mobile */}
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
