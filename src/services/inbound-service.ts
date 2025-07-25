import { httpClient, toastOnError } from "@/lib";

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
  try {
    const response = await httpClient.get(`/warehouse/batch/inbound/export`, {
      params: { batchId },
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream",
      },
    });
    const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];

    const getFilenameFromContentDisposition = (cd: string | undefined) => {
      if (!cd) return null;
      const fileNameMatch = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch != null && fileNameMatch[1]) {
        return fileNameMatch[1].replace(/['"]/g, "");
      }
      return null;
    };

    const filename = getFilenameFromContentDisposition(contentDisposition) || `InboundDetails_${batchId}.csv`;

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toastOnError(error);
  }
};

const importOrders = async (request: ImportInboundRequest): Promise<Array<Inbound>> => {
  return httpClient.post<Array<Inbound>>("warehouse/batch/inbound/upload", request).then((response) => response.data);
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
  generateBatchNumber,
};
