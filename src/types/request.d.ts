declare type PaginationQuery<T> = {
  page: number;
  limit: number;
  sort?: {
    [key: keyof T]: "ASC" | "DESC";
  }[];
  search?: string;
};

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
  token: string;
  newPassword: string;
  confirmPassword: string;
};

declare type RegisterUserRequest = {
  fullName: string;
  address: string;
  phone: string;
  dob: string;
  gender: Gender;
  email: string;
  role: Role;
};

/* warehouse */

declare type CreateWarehouseRequest = {
  name: string;
  address: string;
  areaSize: number;
  capacity: number;
  status: WarehouseStatus;
  type: WarehouseType;
  createdBy: Partial<User>;
  manager: Partial<User>;
};

declare type UpdateWarehouseRequest = Partial<Warehouse>;
