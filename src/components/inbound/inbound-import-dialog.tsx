"use client";

import { useFormik } from "formik";
import { type FC } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { ImportDialog, Label, UserSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { useQuery } from "@/hooks";
import { catchError } from "@/lib";
import { InboundService } from "@/services";

interface InboundExtraInfoDialogProps {
  details?: InboundDetail[];
  onClose: VoidFunction;
  onImportedSuccess?: (orders: Inbound[]) => void;
}

const InboundExtraInfoDialog: FC<InboundExtraInfoDialogProps> = ({ details, onClose, onImportedSuccess }) => {
  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      receivedDate: "",
      inventoryStaff: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      batchNumber: Yup.string().required("Batch number is required"),
      receivedDate: Yup.string().required("Received date is required"),
      inventoryStaff: Yup.string().required("Inventory staff is required"),
    }),
    onSubmit: async (values) =>
      await toast.promise(
        InboundService.importOrders({
          batch: {
            batchNumber: values.batchNumber,
            receivedDate: values.receivedDate,
            inventoryStaff: values.inventoryStaff,
          },
          details: details || [],
        }),
        {
          success: (newInboundOrders) => {
            formik.resetForm();
            onClose();
            onImportedSuccess?.(newInboundOrders);
            return "Inbound order imported success!";
          },
          error: catchError,
          loading: "Importing inbound orders...",
        },
      ),
  });

  const getBatchNumber = async () => {
    const batchNumber = await InboundService.generateBatchNumber();
    await formik.setFieldValue("batchNumber", batchNumber);
  };

  const onCloseDialog = (open: boolean) => (!open ? onClose() : undefined);

  useEffect(() => {
    getBatchNumber();
  }, []);

  return (
    <Dialog open={!!details} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="batchNumber">Batch number *</Label>
              <Input name="batchNumber" value={formik.values.batchNumber} onChange={formik.handleChange} disabled />
              {formik.touched.batchNumber && formik.errors.batchNumber && <p className="text-red-500 text-sm">{formik.errors.batchNumber}</p>}
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="receivedDate">Received date *</Label>
              <Input type="date" name="receivedDate" value={formik.values.receivedDate} onChange={formik.handleChange} />
              {formik.touched.receivedDate && formik.errors.receivedDate && <p className="text-red-500 text-sm">{formik.errors.receivedDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventoryStaff">Inventory staff *</Label>
            <UserSelect role={["INVENTORY_STAFF"]} name="inventoryStaff" placeholder="Select staff" setFieldValue={formik.setFieldValue} value={formik.values.inventoryStaff} />
            {formik.touched.inventoryStaff && formik.errors.inventoryStaff && <p className="text-red-500 text-sm">{formik.errors.inventoryStaff}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface InboundImportDialogProps {
  onImportedSuccess?: (orders: Inbound[]) => void;
}

export const InboundImportDialog: FC<InboundImportDialogProps> = ({ onImportedSuccess }) => {
  const { result, call, reset } = useQuery(InboundService.uploadOrders);

  return (
    <>
      <ImportDialog title="Import Inbound Orders" description="Upload inbound orders from Excel or CSV" onUpload={call} templateDownloader={InboundService.getImportTemplate} />
      <InboundExtraInfoDialog details={result || undefined} onClose={reset} onImportedSuccess={onImportedSuccess} />
    </>
  );
};
