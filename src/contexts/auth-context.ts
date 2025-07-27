"use client";

import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  loading: false,
  login: async () => {},
  logout: async () => {},
});
