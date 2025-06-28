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
  status: "active" | "inactive";
};

declare type Warehouse = {
  id: string;
  name: string;
  address: string;
  area: number;
  capacity: number;
  used: number;
  status: "active" | "warning" | "inactive";
  zones: Zone[];
  manager: string;
  phone: string;
  email: string;
  createdDate: string;
  lastInspection: string;
};

declare type Zone = {
  id: string;
  name: string;
  type: "cold" | "dry" | "hazardous" | "normal";
  capacity: number;
  used: number;
  temperature?: string;
  humidity?: string;
  products: number;
  shelves: number;
  status: "active" | "maintenance" | "inactive";
  hasTemperatureControl: boolean;
  hasHumidityControl: boolean;
  hasFireSafety: boolean;
  hasSecuritySystem: boolean;
  allowedProductTypes: string[];
  description: string;
  maxWeight?: number;
  ventilationRate?: string;
  lightingType?: string;
  floorType?: string;
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
  category: string;
  unit: string;
  packaging: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
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
