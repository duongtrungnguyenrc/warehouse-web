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
  importRooms,
  importRacks,
  update,
  del,
};
