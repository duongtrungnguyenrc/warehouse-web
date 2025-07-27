import { httpClient } from "@/lib";

const create = async (request: CreateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.post<Warehouse>("/warehouse/warehouses", request).then((response) => response.data);
};

const list = async (params: PaginationQuery<Warehouse> & WarehouseFilter): Promise<PaginationResponse<Warehouse>> => {
  const { page, size, ...filters } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    ...filters,
  };

  return httpClient
    .get<PaginationResponse<Warehouse>>("/warehouse/warehouses", {
      params: queryParams,
    })
    .then((response) => response.data);
};

const get = async (id: string): Promise<Warehouse> => {
  return httpClient.get<Warehouse>(`/warehouse/warehouses/${id}`).then((response) => response.data);
};

const getManaging = async (slug?: string): Promise<Warehouse> => {
  return httpClient
    .get<Warehouse>(`/warehouse/manager/warehouse`, {
      params: {
        slug,
      },
    })
    .then((response) => response.data);
};

const getManagingWarehouseRooms = async (params: PaginationQuery<Room>): Promise<PaginationResponse<Room>> => {
  const { page, size, slug } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    slug,
  };

  return httpClient
    .get<PaginationResponse<Room>>(`/warehouse/manager/storage-room`, {
      params: queryParams,
    })
    .then((response) => response.data);
};

const getManagingWarehouseRacks = async (params: PaginationQuery<Rack>): Promise<PaginationResponse<Rack>> => {
  const { page, size, roomId } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    roomId,
  };

  return httpClient
    .get<PaginationResponse<Rack>>(`/warehouse/manager/storage-rack`, {
      params: queryParams,
    })
    .then((response) => response.data);
};

const getManagingWarehouseEquipments = async (params: PaginationQuery<Equipment>): Promise<PaginationResponse<Equipment>> => {
  const { page, size, rackId } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    rackId,
  };

  return httpClient
    .get<PaginationResponse<Equipment>>(`/warehouse/manager/storage-equipment`, {
      params: queryParams,
    })
    .then((response) => response.data);
};

const getManagingWarehouseProducts = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  const { page, size, equipmentId } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    equipmentId,
  };

  return httpClient
    .get<PaginationResponse<Product>>(`/warehouse/manager/products`, {
      params: queryParams,
    })
    .then((response) => response.data);
};

const getWarehouseOperationStats = async (): Promise<WarehouseOperationStats> => {
  return httpClient.get<WarehouseOperationStats>("/warehouse/manager/count-batch").then((response) => response.data);
};

const update = async (id: string, update: UpdateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.put<Warehouse>(`/warehouse/warehouses/${id}`, update).then((response) => response.data);
};

const del = async (id: string): Promise<string> => {
  return httpClient.delete<string>(`/warehouse/warehouses/${id}`).then((response) => response.data);
};

const importRooms = async (warehouseId: string, storageTypeId: string, file: File): Promise<Array<Room>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post("warehouse/storage-rooms/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      warehouseId,
      storageTypeId,
    },
  });

  return response.data;
};

const updateRoom = async (id: string, request: UpdateRoomRequest): Promise<Room> => {
  return httpClient.put<Room>(`/warehouse/storage-rooms/update/${id}`, request).then((response) => response.data);
};

const getImportRoomsTemplate = async () => {
  return httpClient.get("warehouse/storage-rooms/import-template", {
    responseType: "blob",
    headers: {
      Accept: "application/octet-stream",
    },
  });
};

const importRacks = async (roomId: string, file: File): Promise<Rack[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post("warehouse/storage-racks/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    params: {
      roomId,
    },
  });

  return response.data;
};

const getStatistics = async (): Promise<StatisticsResponse> => {
  return httpClient.get<StatisticsResponse>("/warehouse/manager/summary/by-month").then((response) => response.data);
};

// ==================== ROOM TYPE METHODS ====================

/**
 * Get all room types with optional pagination and filtering
 */
const getRoomTypes = async (params: PaginationQuery<RoomType>): Promise<PaginationResponse<RoomType>> => {
  const { page, size, ...filters } = params;

  const queryParams = {
    offset: page * size,
    size: size,
    ...filters,
  };

  return httpClient
    .get<PaginationResponse<RoomType>>("/warehouse/storage-type", {
      params: queryParams,
    })
    .then((response) => response.data);
};

/**
 * Get a single room type by ID
 */
const getRoomType = async (id: string): Promise<RoomType> => {
  return httpClient.get<RoomType>(`/warehouse/storage-type/${id}`).then((response) => response.data);
};

/**
 * Create a new room type
 */
const createRoomType = async (request: CreateRoomTypeRequest): Promise<RoomType> => {
  return httpClient.post<RoomType>("/warehouse/storage-type/create", request).then((response) => response.data);
};

/**
 * Update an existing room type
 */
const updateRoomType = async (id: string, request: UpdateRoomTypeRequest): Promise<RoomType> => {
  return httpClient.put<RoomType>(`/warehouse/storage-type/update/${id}`, request).then((response) => response.data);
};

const createEquipments = async (request: { quantity: number; maxSize: number }): Promise<Equipment[]> => {
  return httpClient.post<Equipment[]>("/warehouse/equipments/create", request).then((res) => res.data);
};

export const WarehouseService = {
  create,
  list,
  get,
  getManaging,
  getManagingWarehouseRooms,
  getManagingWarehouseRacks,
  getWarehouseOperationStats,
  getManagingWarehouseEquipments,
  getManagingWarehouseProducts,
  getImportRoomsTemplate,
  importRooms,
  importRacks,
  update,
  updateRoom,
  del,
  createEquipments,
  getStatistics,
  getRoomTypes,
  getRoomType,
  createRoomType,
  updateRoomType,
};
