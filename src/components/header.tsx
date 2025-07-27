"use client"

import { LogOut } from "lucide-react"
import toast from "react-hot-toast"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Button } from "@/components/shadcn"
import { useAuth } from "@/hooks"

export function Header() {
  const { user, logout } = useAuth()

  const onLogout = async () => {
    await logout()
    toast.success("User logged out successfully")
  }

  return (
    <header className="bg-white border-b px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Sidebar */}
          <MobileSidebar />
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm">
            <span className="text-xs text-gray-600">Logged in as</span>{" "}
            <span className="text-blue-600 font-semibold">{user?.fullName}</span>
          </p>

          <ConfirmDialog title="Are you sure log out?" onConfirm={onLogout}>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </header>
  )
}
