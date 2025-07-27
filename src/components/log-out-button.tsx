"use client";

import { LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

import { ConfirmDialog } from "@/components";
import { Button } from "@/components/shadcn";
import { useAuth } from "@/hooks";

export const LogOutButton = () => {
  const { user, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    toast.success("User logged out successfully");
  };

  return (
    <div className="flex items-center space-x-2">
      <User className="h-5 w-5" />

      <p className="text-sm">
        <span className="text-xs">Logged in as</span> {user?.fullName}
      </p>

      <ConfirmDialog title="Are you sure log out?" onConfirm={onLogout}>
        <Button variant="ghost">
          <LogOut className="h-5 w-5" />
        </Button>
      </ConfirmDialog>
    </div>
  );
};
