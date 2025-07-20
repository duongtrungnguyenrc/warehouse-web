declare type PaginationResponse<T> = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: T[];
};

declare type LoginResponse = TokenPair;

declare type RefreshTokenResponse = TokenPair;

/* warehouses */

declare type WarehouseOperationStats = {
  inbound: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
  };
  outbound: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
  };
};

declare type InboundUploadResponse = {
  sku: string;
  expiryDate: string;
  quantity: number;
};

declare type OutboundUploadResponse = {
  sku: string;
  quantity: number;
};

declare type OutboundValidateResponse = {
  sufficientProducts: {
    sku: "string";
    quantity: 0;
  }[];
  insufficientProducts: {
    sku: "string";
    quantity: 0;
  }[];
  canProceed: true;
};
