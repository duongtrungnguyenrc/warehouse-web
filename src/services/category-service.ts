import { httpClient } from "@/lib";

const list = async (params: PaginationQuery<Category>): Promise<PaginationResponse<Category>> => {
  return await httpClient
    .get<PaginationResponse<Category>>("/warehouse/categories", {
      params: params,
    })
    .then((response) => response.data);
};

const create = async (request: CreateCategoryRequest): Promise<Category> => {
  return await httpClient.post<Category>("/warehouse/categories/create", request).then((response) => response.data);
};

const update = async (id: string, request: UpdateCategoryRequest): Promise<Category> => {
  return await httpClient.put<Category>(`/warehouse/categories/update/${id}`, request).then((response) => response.data);
};

export const CategoryService = {
  list,
  create,
  update,
};
