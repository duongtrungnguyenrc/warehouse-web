import { httpClient } from "@/lib";

const list = async (params: PaginationQuery<Category>): Promise<PaginationResponse<Category>> => {
  return await httpClient
    .get<PaginationResponse<Category>>("/warehouse/categories", {
      params: params,
    })
    .then((response) => response.data);
};

export const CategoryService = {
  list,
};
