import { httpClient } from "@/lib";

const list = async (params: PaginationQuery<Outbound>): Promise<PaginationResponse<Outbound>> => {
  return await httpClient
    .get<PaginationResponse<Outbound>>("/warehouse/manager/outbound", {
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

const generateBatchNumber = async (): Promise<string> => {
  return httpClient.get("warehouse/batch/outbound/generate-batch-number", {}).then((response) => response.data);
};

const uploadOrders = async (file: File): Promise<Array<OutboundUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post("warehouse/batch/outbound/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const createOrder = async (request: ImportOutboundRequest): Promise<Outbound> => {
  return httpClient.post("/warehouse/batch/outbound", request, {}).then((response) => response.data);
};

const validateOrders = async (request: ImportOutboundRequest): Promise<OutboundValidateResponse> => {
  return httpClient.post<OutboundValidateResponse>("warehouse/batch/outbound/validate-quantity", request).then((response) => response.data);
};

const importOrders = async (request: ImportOutboundRequest): Promise<Array<Outbound>> => {
  return httpClient.post<Array<Outbound>>("warehouse/batch/outbound/upload", request).then((response) => response.data);
};

export const OutboundService = {
  list,
  exportOrder,
  generateBatchNumber,
  importOrders,
  createOrder,
  validateOrders,
  uploadOrders,
};
