declare type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

declare type Role = string; // Declared the Role variable

declare type User = {
  userId: string;
  fullName: string;
  address: string;
  phone: string;
  dob: Date;
  gender: boolean;
  email: string;
  role: Role;
  enabled: boolean;
};

declare type Warehouse = {
  id: string;
  name: string;
  address: string;
  areaSize: number;
  status: WarehouseStatus;
  type: WarehouseType;
  createAt: Date;
  createdBy: string;
  manager: string;
  totalInboundBatches: number;
  totalOutboundBatches: number;
  totalProducts: number;
  usedCapacity: number;
  totalCapacity: number;
  usagePercentage: number;
  totalStorageRacks: number;
  availableStorageRacks: number;
};

declare type Zone = {
  id: string;
  name: string;
  maxCapacity: number;
  envSettings: string;
  warehouse: string;
  storageTypeName: string;
};

declare type Category = {
  id: string;
  name: string;
  description: string;
};

declare type ProductBatch = {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  location: string;
  status: "good" | "expiring" | "expired";
  receivedDate: string;
};

declare type ProductMovement = {
  id: string;
  type: "inbound" | "outbound" | "transfer";
  quantity: number;
  date: string;
  location: string;
  reference: string;
};

declare type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  price: number;
  unitOfMeasure: string;
  packageSize: string;
  weight: number;
  stockQuantity: number;
  category: Category;
};
