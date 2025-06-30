import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router";

import { Header, Sidebar } from "@/components";
import { useAuth } from "@/hooks";

export const ProtectedLayout = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!user) {
    toast.error("Session already expired!");

    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header />

        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
