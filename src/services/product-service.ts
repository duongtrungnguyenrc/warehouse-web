import { httpClient } from "@/lib";

const getSKU = async (): Promise<string> => {
  return await httpClient.get<string>("warehouse/products/generate-sku").then((res) => res.data);
};

const list = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  return await httpClient
    .get<PaginationResponse<Product>>("/warehouse/products/search", {
      params: params,
    })
    .then((response) => response.data);
};

const create = async (request: CreateProductRequest): Promise<Product> => {
  return await httpClient.post("warehouse/products/create", request).then((response) => response.data);
};

export const ProductService = {
  list,
  getSKU,
  create,
};
