import type { FC } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

import { AuthProvider } from "@/providers";

type RootLayoutProps = {};

export const RootLayout: FC<RootLayoutProps> = ({}) => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster position="bottom-center" />
    </AuthProvider>
  );
};
