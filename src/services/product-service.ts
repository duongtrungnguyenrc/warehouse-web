import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { httpClient } from "@/lib";

const getSKU = async (): Promise<string> => {
  return await httpClient.get<string>("warehouse/products/generate-sku").then((res) => res.data);
};

const create = async (request: CreateProductRequest): Promise<Product> => {
  return await httpClient.post("warehouse/products/create", request).then((res) => res.data);
};

const update = async (productId: string, request: UpdateProductRequest): Promise<Product> => {
  return await httpClient.put<Product>(`warehouse/products/update/${productId}`, request).then((res) => res.data);
};

const importProducts = async (file: File): Promise<Product[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await httpClient.post("warehouse/products/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

const getImportTemplate = async (): Promise<Blob> => {
  return httpClient.get("warehouse/products/import-template", {
    responseType: "blob",
    headers: { Accept: "application/octet-stream" },
  });
};

const list = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  return await httpClient.get<PaginationResponse<Product>>("/warehouse/products", { params }).then((res) => res.data);
};

const listManaging = async (params: PaginationQuery<Product>): Promise<PaginationResponse<Product>> => {
  return await httpClient.get<PaginationResponse<Product>>("/warehouse/manager/products", { params }).then((res) => res.data);
};

const getTopOutboundProducts = async (rangeTime: DateRange): Promise<Product[]> => {
  const params = {
    startDate: rangeTime.from ? format(rangeTime.from, "yyyy-MM-dd") : undefined,
    endDate: rangeTime.to ? format(rangeTime.to, "yyyy-MM-dd") : undefined,
  };

  const res = await httpClient.get("/warehouse/manager/top-outbound-products", { params });
  return res.data ?? [];
};

const getLeastOutboundProducts = async (rangeTime: DateRange): Promise<Product[]> => {
  const params = {
    startDate: rangeTime.from ? format(rangeTime.from, "yyyy-MM-dd") : undefined,
    endDate: rangeTime.to ? format(rangeTime.to, "yyyy-MM-dd") : undefined,
  };

  const res = await httpClient.get("/warehouse/manager/top-least-outbound-products", { params });
  return res.data ?? [];
};

// ==========================
// EXPORT SERVICE
// ==========================

export const ProductService = {
  getSKU,
  create,
  update,
  importProducts,
  getImportTemplate,
  list,
  listManaging,
  getTopOutboundProducts,
  getLeastOutboundProducts,
};
