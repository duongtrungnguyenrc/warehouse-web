import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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

const update = async (productId: string, request: UpdateProductRequest): Promise<Product> => {
  return await httpClient.put<Product>(`warehouse/products/update/${productId}`, request).then((response) => response.data);
};

export const ProductService = {
  list,
  listManaging,
  getSKU,
  create,
  importProducts,
  update,
  getTopOutboundProducts: async (rangeTime: DateRange): Promise<Product[]> => {
    const params = {
      startDate: rangeTime.from ? format(rangeTime.from, "yyyy-MM-dd") : undefined,
      endDate: rangeTime.to ? format(rangeTime.to, "yyyy-MM-dd") : undefined,
    };

    const res = await httpClient.get("/warehouse/manager/top-outbound-products", { params });
    return res.data ?? [];
  },

  getLeastOutboundProducts: async (rangeTime: DateRange): Promise<Product[]> => {
    const params = {
      startDate: rangeTime.from ? format(rangeTime.from, "yyyy-MM-dd") : undefined,
      endDate: rangeTime.to ? format(rangeTime.to, "yyyy-MM-dd") : undefined,
    };

    const res = await httpClient.get("/warehouse/manager/top-least-outbound-products", { params });
    return res.data ?? [];
  },

  getTotalProducts: async (): Promise<Product[]> => {
    // const res = await httpClient.get("/products/total", );
    return [];
  },
};
