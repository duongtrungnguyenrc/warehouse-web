import { createContext } from "react";

export type AuthContextType = {
  user?: User;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  token?: string;
};

export const AuthContext = createContext<AuthContextType>({ loading: false, login: async () => {}, logout: async () => {} });
