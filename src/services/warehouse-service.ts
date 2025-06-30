import { httpClient } from "@/lib";

const create = async (request: CreateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.post<Warehouse>("/warehouse", request).then((response) => response.data);
};

const list = async (params: PaginationQuery<Warehouse>): Promise<PaginationResponse<Warehouse>> => {
  return httpClient
    .get<PaginationResponse<Warehouse>>("/warehouse", {
      params: params,
    })
    .then((response) => response.data);
};

const get = async (id: string): Promise<Warehouse> => {
  return httpClient.get<Warehouse>(`/warehouse/${id}`).then((response) => response.data);
};

const update = async (id: string, update: UpdateWarehouseRequest): Promise<Warehouse> => {
  return httpClient.put<Warehouse>(`/warehouse/${id}`, update).then((response) => response.data);
};

export const WarehouseService = {
  create,
  list,
  get,
  update,
};
