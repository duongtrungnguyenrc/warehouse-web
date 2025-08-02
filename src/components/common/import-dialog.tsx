"use client";

import { File, FileCheck2, FileSpreadsheet, UploadCloud } from "lucide-react";
import { type ChangeEvent, Dispatch, type DragEvent, type ReactNode, SetStateAction, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { useDownloadFile } from "@/hooks";
import { cn } from "@/lib";

type RawTableData = string[][];

type ImportDialogMetadata = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  previewData: RawTableData;
  setPreviewData: Dispatch<SetStateAction<RawTableData>>;
  setExtraData: (data: Record<string, any>) => void;
  handleUpload: () => void;
  extraData: Record<string, any>;
};

type ImportDialogProps<T = any> = {
  title?: string;
  description?: string;
  accept?: string;
  children?: ReactNode | ((methods: ImportDialogMetadata) => ReactNode);
  onUpload: (file: File, extraData?: Record<string, any> | any) => Promise<T>;
  onSuccess?: (data: T) => void;
  renderPreview?: (preview: RawTableData) => ReactNode;
  templateDownloader?: () => Promise<any>;
};

export const ImportDialog = <T,>({
  title = "Import File",
  description = "Upload a CSV or Excel file.",
  accept = ".csv,.xlsx,.xls",
  children,
  onUpload,
  onSuccess,
  renderPreview,
  templateDownloader,
}: ImportDialogProps<T>) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<RawTableData>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extraData, setExtraDataState] = useState<Record<string, any>>({});

  const { download } = useDownloadFile();

  const handleFile = (file: File) => {
    setFile(file);
    setPreviewData([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!sheet) {
          toast.error("No valid sheet found in file.");
          return;
        }
        const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][];
        setPreviewData(rows.slice(0, 10));
      } catch {
        toast.error("Failed to read file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    await toast.promise(onUpload(file, extraData), {
      loading: "Importing...",
      success: (data) => {
        onSuccess?.(data);
        setFile(null);
        setPreviewData([]);
        setExtraDataState({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        return "Import successful!";
      },
      error: (err) => err?.message || "Upload failed",
    });
  };

  const handleTemplateDownload = async () => {
    if (templateDownloader) {
      await download(templateDownloader);
    } else {
      toast.error("Template download function not provided.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <File className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("max-h-[90vh] overflow-y-auto", file ? "sm:max-w-screen md:max-w-5xl" : "")}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {templateDownloader && (
          <div>
            <button onClick={handleTemplateDownload} className="text-green-500 text-sm hover:text-green-600 cursor-pointer p-0 flex items-center space-x-2">
              <span>Download example template</span> <FileSpreadsheet className="h-3 w-3" />
            </button>
          </div>
        )}

        {typeof children === "function"
          ? children({
              file,
              setFile,
              previewData,
              setPreviewData,
              setExtraData: setExtraDataState,
              handleUpload,
              extraData,
            })
          : children}

        <div className="grid gap-4 py-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn("border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition", dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300")}
          >
            <input type="file" accept={accept} ref={fileInputRef} onChange={onChangeFile} className="hidden" />
            <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <p>Drag and drop file here or click to browse</p>
              <p className="text-xs text-gray-500">{accept}</p>
              {file && (
                <div className="text-green-600 flex items-center gap-1 mt-2">
                  <FileCheck2 className="w-4 h-4" />
                  {file.name}
                </div>
              )}
            </div>
          </div>

          {previewData.length > 0 &&
            (renderPreview?.(previewData) ?? (
              <div className="border rounded-lg overflow-x-auto max-h-[400px]">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      {previewData[0].map((cell, i) => (
                        <th key={i} className="border px-3 py-1 text-left font-medium text-nowrap">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/30">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border px-3 py-1 text-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
