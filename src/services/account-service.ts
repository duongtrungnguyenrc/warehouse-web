import { httpClient, saveAuthToken } from "@/lib";

const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const tokens = await httpClient.post<LoginResponse>("/account/login", request).then((res) => res.data);

  saveAuthToken({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

const refreshToken = async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const tokens = await httpClient.post<RefreshTokenResponse>("/account/refresh", request).then((res) => res.data);

  saveAuthToken({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

const getMe = async (): Promise<User> => {
  return await httpClient.get<User>("/account/me").then((res) => res.data);
};

const forgotPassword = async (request: ForgotPasswordRequest): Promise<void> => {
  await httpClient.post("/account/forgot-password", request);
};

const verifyResetPasswordToken = async (request: VerifyResetPasswordTokenRequest): Promise<boolean> => {
  if (!request.token) return false;

  try {
    await httpClient
      .get("/account/verify-reset-token", {
        params: request,
      })
      .then((res) => res.data);
    return true;
  } catch (error) {
    return false;
  }
};

const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  await httpClient.post("/account/reset-password", request).then((res) => res.data);
};

export const AccountService = {
  login,
  refreshToken,
  getMe,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
};
