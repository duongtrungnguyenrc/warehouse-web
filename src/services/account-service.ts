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

const get = async (): Promise<User> => {
  return await httpClient.get<User>("/account/me").then((res) => res.data);
};

const list = async (params: PaginationQuery<User>): Promise<PaginationResponse<User>> => {
  return await httpClient
    .get<PaginationResponse<User>>("/admin/account/list", {
      params: params,
    })
    .then((response) => response.data);
};

const forgotPassword = async (request: ForgotPasswordRequest): Promise<void> => {
  await httpClient.post("/account/forgot-password", request);
};

const verifyResetPasswordToken = async (params: VerifyResetPasswordTokenRequest): Promise<boolean> => {
  if (!params.token) return false;

  try {
    await httpClient
      .get("/account/verify-reset-token", {
        params: params,
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

const register = async (request: RegisterUserRequest): Promise<User> => {
  return httpClient.post<User>("/admin/account/register", request).then((res) => res.data);
};

export const AccountService = {
  login,
  refreshToken,
  list,
  getMe: get,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
  register,
};
