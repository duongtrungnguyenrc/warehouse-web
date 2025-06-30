declare type PaginationResponse<T> = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: T[];
  data: T[];
};

declare type LoginResponse = TokenPair;

declare type RefreshTokenResponse = TokenPair;

/* warehouses */
