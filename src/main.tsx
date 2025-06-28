import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";

import { ProtectedLayout, RootLayout } from "@/layouts";
import { DashboardPage, ForgotPasswordPage, LoginPage, ProductsPage, ResetPasswordPage, WarehousesPage } from "@/pages";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "/reset-password",
        Component: ResetPasswordPage,
      },
      {
        Component: ProtectedLayout,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: "/warehouses",
            Component: WarehousesPage,
          },
          {
            path: "/products",
            Component: ProductsPage,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RouterProvider router={router} />,
  // </StrictMode>,
);
