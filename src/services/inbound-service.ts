import { httpClient } from "@/lib";

const list = async (params: PaginationQuery<Inbound>): Promise<PaginationResponse<Inbound>> => {
  return await httpClient
    .get<PaginationResponse<Inbound>>("/warehouse/manager/inbound", {
      params: params,
    })
    .then((response) => response.data);
};

const createOrder = async (request: ImportInboundRequest): Promise<Inbound> => {
  return httpClient.post("/warehouse/batch/inbound", request, {}).then((response) => response.data);
};

const exportOrder = async (batchId: string) => {
  return await httpClient.get(`/warehouse/batch/inbound/export`, {
    params: { batchId },
    responseType: "blob",
    headers: {
      Accept: "application/octet-stream",
    },
  });
};

const importOrders = async (request: ImportInboundRequest): Promise<Array<Inbound>> => {
  return httpClient.post<Array<Inbound>>("warehouse/batch/inbound/upload", request).then((response) => response.data);
};

const getImportTemplate = async (): Promise<Blob> => {
  return httpClient.get("warehouse/batch/inbound/import-template", {
    responseType: "blob",
    headers: { Accept: "application/octet-stream" },
  });
};

const uploadOrders = async (file: File): Promise<Array<InboundUploadResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post<Array<InboundUploadResponse>>("warehouse/batch/inbound/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const generateBatchNumber = async (): Promise<string> => {
  return httpClient.get("warehouse/batch/inbound/generate-batch-number", {}).then((response) => response.data);
};

export const InboundService = {
  list,
  createOrder,
  exportOrder,
  uploadOrders,
  importOrders,
  getImportTemplate,
  generateBatchNumber,
};
