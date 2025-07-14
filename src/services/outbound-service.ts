import { httpClient } from "@/lib";

const list = async (params: PaginationQuery<Inbound>): Promise<PaginationResponse<Inbound>> => {
  return await httpClient
    .get<PaginationResponse<Inbound>>("/warehouse/manager/outbound", {
      params: params,
    })
    .then((response) => response.data);
};

const exportOrder = async (batchId: string) => {
  return await httpClient.get(`/warehouse/batch/outbound/export`, {
    params: { batchId },
    responseType: "blob",
    headers: {
      Accept: "application/octet-stream",
    },
  });
};

const importOrders = async (file: File): Promise<Array<Product>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post("warehouse/batch/outbound/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const OutboundService = {
  list,
  exportOrder,
  importOrders,
};
