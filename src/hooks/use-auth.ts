"use client";

import { useContext } from "react";

import { AuthContext } from "@/contexts";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
