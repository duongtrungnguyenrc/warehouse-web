import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";

import { ProtectedLayout, RootLayout } from "@/layouts";
import { ForgotPasswordPage, InboundPage, LoginPage, OutboundPage, ProductsPage, ResetPasswordPage, UserPage, WarehouseDetailPage, WarehousesPage } from "@/pages";

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
            path: "/",
            children: [
              {
                index: true,
                Component: WarehousesPage,
              },
              {
                path: ":id",
                Component: WarehouseDetailPage,
              },
            ],
          },
          {
            path: "/products",
            Component: ProductsPage,
          },
          {
            path: "/inbound",
            Component: InboundPage,
          },
          {
            path: "/outbound",
            Component: OutboundPage,
          },
          {
            path: "/users",
            Component: UserPage,
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
