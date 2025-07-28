import { httpClient } from "@/lib";

// ==========================
// WAREHOUSE CRUD METHODS
// ==========================

const create = async (request: CreateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.post<Warehouse>("/warehouse/warehouses", request).then((res) => res.data);
};

const update = async (id: string, update: UpdateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.put<Warehouse>(`/warehouse/warehouses/${id}`, update).then((res) => res.data);
};

const del = async (id: string): Promise<string> => {
  return httpClient.delete<string>(`/warehouse/warehouses/${id}`).then((res) => res.data);
};

const get = async (id: string): Promise<Warehouse> => {
  return httpClient.get<Warehouse>(`/warehouse/warehouses/${id}`).then((res) => res.data);
};

const list = async (params: PaginationQuery<Warehouse> & WarehouseFilter): Promise<PaginationResponse<Warehouse>> => {
  const { page, size, ...filters } = params;
  return httpClient
    .get<PaginationResponse<Warehouse>>("/warehouse/warehouses", {
      params: { offset: page * size, size, ...filters },
    })
    .then((res) => res.data);
};

const getManaging = async (slug?: string): Promise<Warehouse> => {
  return httpClient.get<Warehouse>("/warehouse/manager/warehouse", { params: { slug } }).then((res) => res.data);
};

// =======================================
// ROOMS (Storage Rooms) API
// =======================================

const getManagingWarehouseRooms = async (params: PaginationQuery<Room>): Promise<PaginationResponse<Room>> => {
  const { page, size, slug } = params;
  return httpClient
    .get<PaginationResponse<Room>>("/warehouse/manager/storage-room", {
      params: { offset: page * size, size, slug },
    })
    .then((res) => res.data);
};

const updateRoom = async (id: string, request: UpdateRoomRequest): Promise<Room> => {
  return httpClient.put<Room>(`/warehouse/storage-rooms/update/${id}`, request).then((res) => res.data);
};

const importRooms = async (warehouseId: string, storageTypeId: string, file: File): Promise<Room[]> => {
  const formData = new FormData();
  formData.append("file", file);

  return httpClient
    .post("warehouse/storage-rooms/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { warehouseId, storageTypeId },
    })
    .then((res) => res.data);
};

const getImportRoomsTemplate = async (): Promise<Blob> => {
  return httpClient.get("warehouse/storage-rooms/import-template", {
    responseType: "blob",
    headers: { Accept: "application/octet-stream" },
  });
};

// ==========================
// RACKS API
// ==========================

const getManagingWarehouseRacks = async (params: PaginationQuery<Rack>): Promise<PaginationResponse<Rack>> => {
  const { page, size, roomId } = params;
  return httpClient
    .get<PaginationResponse<Rack>>("/warehouse/manager/storage-rack", {
      params: { offset: page * size, size, roomId },
    })
    .then((res) => res.data);
};

const importRacks = async (roomId: string, file: File): Promise<Rack[]> => {
  const formData = new FormData();
  formData.append("file", file);

  return httpClient
    .post("warehouse/storage-racks/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { roomId },
    })
    .then((res) => res.data);
};

const getImportRacksTemplate = async (): Promise<Blob> => {
  return httpClient.get("warehouse/storage-racks/import-template", {
    responseType: "blob",
    headers: { Accept: "application/octet-stream" },
  });
};

// ==========================
// EQUIPMENTS API
// ==========================

const getManagingWarehouseEquipments = async (params: PaginationQuery<Equipment>): Promise<PaginationResponse<Equipment>> => {
  const { page, size, rackId } = params;
  return httpClient
    .get<PaginationResponse<Equipment>>("/warehouse/manager/storage-equipment", {
      params: { offset: page * size, size, rackId },
    })
    .then((res) => res.data);
};

const createEquipments = async (request: { quantity: number; maxSize: number }): Promise<Equipment[]> => {
  return httpClient.post<Equipment[]>("/warehouse/equipments/create", request).then((res) => res.data);
};

// ==========================
// PRODUCTS API
// ==========================

const getManagingWarehouseProducts = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  const { page, size, equipmentId } = params;
  return httpClient
    .get<PaginationResponse<Product>>("/warehouse/manager/products", {
      params: { offset: page * size, size, equipmentId },
    })
    .then((res) => res.data);
};

// ==========================
// STATS API
// ==========================

const getWarehouseOperationStats = async (): Promise<WarehouseOperationStats> => {
  return httpClient.get<WarehouseOperationStats>("/warehouse/manager/count-batch").then((res) => res.data);
};

const getStatistics = async (): Promise<StatisticsResponse> => {
  return httpClient.get<StatisticsResponse>("/warehouse/manager/summary/by-month").then((res) => res.data);
};


// ==========================
// EXPORT SERVICE
// ==========================

export const WarehouseService = {
  // Warehouse
  create,
  update,
  del,
  get,
  list,
  getManaging,

  // Rooms
  getManagingWarehouseRooms,
  updateRoom,
  importRooms,
  getImportRoomsTemplate,

  // Racks
  getManagingWarehouseRacks,
  importRacks,
  getImportRacksTemplate,

  // Equipments
  getManagingWarehouseEquipments,
  createEquipments,

  // Products
  getManagingWarehouseProducts,

  // Stats
  getWarehouseOperationStats,
  getStatistics,
};
