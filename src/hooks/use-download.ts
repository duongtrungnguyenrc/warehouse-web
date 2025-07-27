"use client";

import { useCallback } from "react";

import { toastOnError } from "@/lib";

type DownloadFileOptions = {
  filename?: string;
  getFilenameFromHeader?: (headers: Record<string, any>) => string | null;
};

export function useDownloadFile() {
  const download = useCallback(async (fetcher: () => Promise<any>, options?: DownloadFileOptions) => {
    try {
      const response = await fetcher();
      const blob = new Blob([response.data]);
      const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];

      const defaultExtractFilename = (cd: string | undefined): string | null => {
        if (!cd) return null;
        const fileNameMatch = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        return fileNameMatch?.[1]?.replace(/['"]/g, "") ?? null;
      };

      const filename =
        options?.filename || (options?.getFilenameFromHeader ? options.getFilenameFromHeader(response.headers) : defaultExtractFilename(contentDisposition)) || "download";

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toastOnError(err);
    }
  }, []);

  return { download };
}
