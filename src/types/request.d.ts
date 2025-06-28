declare type LoginRequest = {
  email: string;
  password: string;
};

declare type RefreshTokenRequest = {
  refreshToken: string;
};

declare type ForgotPasswordRequest = {
  email: string;
};

declare type VerifyResetPasswordTokenRequest = {
  token?: string | null;
};

declare type ResetPasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
