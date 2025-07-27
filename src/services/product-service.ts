import { httpClient } from "@/lib";

const getSKU = async (): Promise<string> => {
  return await httpClient.get<string>("warehouse/products/generate-sku").then((res) => res.data);
};

const list = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  return await httpClient
    .get<PaginationResponse<Product>>("/warehouse/products", {
      params: params,
    })
    .then((response) => response.data);
};

const listManaging = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  return await httpClient
    .get<PaginationResponse<Product>>("/warehouse/manager/products", {
      params: params,
    })
    .then((response) => response.data);
};

const create = async (request: CreateProductRequest): Promise<Product> => {
  return await httpClient.post("warehouse/products/create", request).then((response) => response.data);
};

const importProducts = async (file: File): Promise<Array<Product>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post("warehouse/products/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const ProductService = {
  list,
  listManaging,
  getSKU,
  create,
  importProducts,
};
