declare type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

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
  capacity: number;
  used: number;
  status: WarehouseStatus;
  type: WarehouseType;
  createAt: Date;
  createdBy: Partial<User>;
  manager: Partial<User>;
};

declare type Zone = {
  id: string;
  name: string;
  maxCapacity: number;
  envSettings: string;
  warehouseName: string;
  storageTypeName: string;
};

declare type Category = {
  id: string;
  name: string;
  price: number;
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
  name: string;
  category: Category;
  unit: string;
  packaging: string;
  supplier: string;
  description: string;
  status: "active" | "inactive";
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  minStock: number;
  maxStock: number;
  batches: ProductBatch[];
  movements: ProductMovement[];
  image?: string;
};
