import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";

import { ProtectedLayout, RootLayout } from "@/layouts";
import {
  ChatbotPage,
  StatisticsPage,
  ForgotPasswordPage,
  InboundPage,
  LoginPage,
  OutboundPage,
  ProductsPage,
  ResetPasswordPage,
  UserPage,
  WarehouseDetailPage,
  WarehousesPage,
} from "@/pages";

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
                path: ":slug",
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
            path: "/stats",
            Component: StatisticsPage,
          },
          {
            path: "/users",
            Component: UserPage,
          },
          {
            path: "/bot",
            Component: ChatbotPage,
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
