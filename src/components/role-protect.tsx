"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/hooks";

type RoleProtectProps = {
  role?: Array<Role | "*">;
  children: ReactNode;
};

export const RoleProtect = ({ role = ["*"], children }: RoleProtectProps) => {
  const { user } = useAuth();

  if ((role.includes("*") && user) || (user && role.includes(user.role))) return children;

  return null;
};
