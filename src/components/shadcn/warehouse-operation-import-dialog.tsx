import { useFormik } from "formik";
import { useEffect, useState } from "react";
import type { FC } from "react";
import * as Yup from "yup";

import { ImportDialog, RoleProtect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { InboundService } from "@/services";
import { useQuery } from "@/hooks";

interface InboundExtraInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { batchNumber: string; shippedDate: string }) => void;
}

export const InboundExtraInfoDialog: FC<InboundExtraInfoDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const { result: batchNumber, call } = useQuery(InboundService.generateBatchNumber);

  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      shippedDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      batchNumber: Yup.string().required("Batch number is required"),
      shippedDate: Yup.string().required("Shipped date is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      call();
      formik.resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (batchNumber) {
      formik.setFieldValue("batchNumber", batchNumber);
    }
  }, [batchNumber, formik]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input name="batchNumber" placeholder="Batch Number" value={formik.values.batchNumber} onChange={formik.handleChange} disabled />
            {formik.touched.batchNumber && formik.errors.batchNumber && <p className="text-red-500 text-sm">{formik.errors.batchNumber}</p>}
          </div>
          <div>
            <Input type="date" name="shippedDate" value={formik.values.shippedDate} onChange={formik.handleChange} />
            {formik.touched.shippedDate && formik.errors.shippedDate && <p className="text-red-500 text-sm">{formik.errors.shippedDate}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const WarehouseInboundImportDialog = () => {
  const [showExtraDialog, setShowExtraDialog] = useState(false);

  const handleUpload = async (file: File) => {
    await InboundService.importOrders(file);
    setShowExtraDialog(true);
  };

  const handleSubmitExtraInfo = (values: { batchNumber: string; shippedDate: string }) => {
    console.log("Batch:", values.batchNumber);
    console.log("Shipped Date:", values.shippedDate);
  };

  return (
    <RoleProtect role={["INVENTORY_STAFF"]}>
      <ImportDialog title="Import Inbound Orders" description="Upload inbound orders from Excel or CSV" onUpload={handleUpload} />

      <InboundExtraInfoDialog open={showExtraDialog} onOpenChange={setShowExtraDialog} onSubmit={handleSubmitExtraInfo} />
    </RoleProtect>
  );
};
