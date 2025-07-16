import { type FC, type ReactNode, useCallback, useEffect, useState } from "react";

import { AuthContext, type AuthContextType } from "@/contexts";
import { clearAuthToken } from "@/lib";
import { AccountService } from "@/services";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<Omit<AuthContextType, "login" | "logout">>({
    loading: true,
    user: undefined,
  });

  const login = useCallback(async (request: LoginRequest) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await AccountService.login(request);
      const user = await AccountService.get();
      setState({ user, loading: false });
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false }));
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    clearAuthToken();
    setState({ user: undefined, loading: false });
  }, []);

  const auth = useCallback(async () => {
    try {
      const user = await AccountService.get();
      setState({ user, loading: false });
    } catch {
      clearAuthToken();
      setState({ user: undefined, loading: false });
    }
  }, []);

  useEffect(() => {
    auth().then((res) => res);
  }, [auth]);

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};
