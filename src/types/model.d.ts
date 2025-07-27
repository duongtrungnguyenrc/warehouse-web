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
  slug: string;
  status: WarehouseStatus;
  type: WarehouseType;
  createAt: string;
  createdByUser: string;
  managerUser: string;
  totalInboundBatches: number;
  totalOutboundBatches: number;
  totalProducts: number;
  usedCapacity: number;
  totalCapacity: number;
  usagePercentage: number;
  totalStorageRacks: number;
  availableStorageRacks: number;
};

declare type RoomType = {
  id: string;
  name: string;
  description: string;
};

declare type Room = {
  id: string;
  name: string;
  maxCapacity: number;
  totalCapacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  rackCount: number;
  envSettings: string;
  warehouse: Warehouse;
  storageType: RoomType;
};

declare type Rack = {
  id: string;
  levelNumber: number;
  slotNumber: number;
  maxSize: number;
  usedSize: number;
  remainingSize: number;
  totalEquipment: number;
  status: "FULL";
  details: {
    equipments: Equipment[];
  };
};

declare type Equipment = {
  id: string;
  lpn: string;
  maxSize: number;
  usedSize: number;
  remainingSize: number;
  createdAt: Date;
  currentRackID: string;
};

declare type Category = {
  id: string;
  name: string;
  description: string;
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

declare type Inbound = {
  id: string;
  batchNumber: string;
  receivedDate: string;
  status: InboundStatus;
  createdBy: string;
  createdByUser: User;
  inventoryStaff: string;
  inventoryStaffUser: User;
  details: {
    product: Product;
    expiryDate: string;
    quantity: number;
  }[];
};

declare type Outbound = Inbound & {
  status: OutboundStatus;
};
