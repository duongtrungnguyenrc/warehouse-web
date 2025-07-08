import { httpClient } from "@/lib";

const create = async (request: CreateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.post<Warehouse>("/warehouse/warehouses", request).then((response) => response.data);
};

const list = async (params: PaginationQuery<Warehouse> & WarehouseFilters): Promise<PaginationResponse<Warehouse>> => {
  const { page, limit, ...filters } = params;

  const queryParams = {
    offset: page * limit,
    limit,
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

const update = async (id: string, update: UpdateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.put<Warehouse>(`/warehouse/warehouses/${id}`, update).then((response) => response.data);
};

export const WarehouseService = {
  create,
  list,
  get,
  update,
};
