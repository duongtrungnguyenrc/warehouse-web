type AuthContextType = {
  user?: User;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  token?: string;
};
