import { useContext } from "react";

import { AuthContext, type AuthContextType } from "@/contexts";

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
