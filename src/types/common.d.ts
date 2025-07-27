declare type Role = "ADMIN" | "MANAGER" | "INVENTORY_STAFF";
declare type WarehouseStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";
declare type WarehouseType = "DC" | "CW";
declare type Gender = "MALE" | "FEMALE";
declare type InboundStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
declare type OutboundStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

declare type Permission =
  | "SYSTEM_MANAGEMENT"
  | "USER_MANAGEMENT"
  | "WAREHOUSE_MANAGEMENT"
  | "INVENTORY_TRACKING"
  | "WAREHOUSE_REPORT_VIEW"
  | "IMPORT_EXPORT_MANAGEMENT"
  | "STOCK_WARNING"
  | "SHIPMENT_MANAGEMENT"
  | "BARCODE_SCAN"
  | "INVENTORY_UPDATE"
  | "DOCUMENT_CREATION"
  | "TRANSACTION_HISTORY_VIEW"
  | "SCHEDULE_NOTIFICATION"
  | "DOCUMENT_HANDLING"
  | "CONFIGURATION_MANAGEMENT";

declare type RolePermission = {
  name: string;
  color: string;
  icon: any;
  permissions: string[];
};

type SortConfig<T> = {
  field: keyof T | null;
  direction: "asc" | "desc";
};

type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  visible: boolean;
  sortable?: boolean;
  searchable?: boolean;
};

type SearchConfig<T> = {
  field: keyof T;
  value: string;
};

type UsePaginationProps<Q, R> = {
  fetcher: (query: PaginationQuery<Q>) => Promise<PaginationResponse<R>>;
  initialQuery?: PaginationQuery<Q>;
  enableCache?: boolean;
  cacheTtl?: number;
};

type CacheEntry<R> = {
  data: PaginationResponse<R>;
  expiresAt: number;
};

type Navigation = {
  name: string;
  href: string;
  icon: any;
  roles: (Role | "*")[];
};
