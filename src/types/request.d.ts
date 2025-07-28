declare type PaginationQuery<T> = {
  page: number;
  size: number;
  sort?: {
    [key: keyof T]: "ASC" | "DESC";
  }[];
  search?: string;
  [key: string]: any;
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

declare type WarehouseFilter = {
  name?: string;
  address?: string;
  type?: WarehouseType;
  status?: WarehouseStatus;
  minAreaSize?: number;
  maxAreaSize?: number;
};

declare type CreateWarehouseRequest = {
  name: string;
  address: string;
  status: WarehouseStatus;
  type: WarehouseType;
  areaSize: number;
  manager?: string;
};

declare type UpdateWarehouseRequest = {
  name: string;
  address: string;
  areaSize: number;
  type: WarehouseType;
  manager: string;
  status: WarehouseStatus;
};

declare type CreateRoomRequest = {
  name: string;
  maxCapacity: number;
  envSettings: string;
  storageTypeId: string;
  warehouseId: string;
};

declare type CreateCategoryRequest = {
  name: string;
  description: string;
};

declare type UpdateCategoryRequest = {
  name: string;
  description: string;
};

declare type CreateProductRequest = {
  name: string;
  price: number;
  unitOfMeasure: string;
  packageSize: string;
  weight: number;
  categoryId: string;
  sku: string;
};

declare type UpdateProductRequest = {
  name: string;
  price: number;
  unitOfMeasure: string;
  packageSize: string;
  weight: number;
  stockQuantity: number;
  categoryId: string;
};

declare type InboundDetail = InboundUploadResponse;

declare type ImportInboundRequest = {
  batch: {
    batchNumber: string;
    receivedDate: string;
    inventoryStaff: string;
  };
  details: InboundDetail[];
};

declare type OutboundDetail = OutboundUploadResponse;

declare type ImportOutboundRequest = {
  batch: {
    batchNumber: string;
    shippedDate: string;
    inventoryStaff: string;
  };
  details: OutboundDetail[];
};

declare type UpdateRoomRequest = {
  name: string;
  maxCapacity: number;
  envSettings: string;
  storageTypeId: string;
  warehouseId: string;
};

declare type CreateRoomTypeRequest = {
  name: string;
  description: string;
};

declare type UpdateRoomTypeRequest = {
  name?: string;
  description?: string;
};

declare type RoomTypeFilter = {
  name?: string;
  description?: string;
  search?: string;
  createdBy?: string;
  createdFrom?: string;
  createdTo?: string;
};

declare type RoomTypeStats = {
  roomTypeId: string;
  roomTypeName: string;
  totalRooms: number;
  totalCapacity: number;
  usedCapacity: number;
  usagePercentage: number;
  warehouses: string[];
};
