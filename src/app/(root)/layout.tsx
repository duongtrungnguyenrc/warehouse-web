"use client";

import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

import { Header, Sidebar } from "@/components";
import { useAuth } from "@/hooks";

type Props = {
  children?: ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return redirect("/login", RedirectType.replace);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
