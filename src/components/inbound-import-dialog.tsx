import { useFormik } from "formik";
import { type FC } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { ImportDialog, RoleProtect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { useQuery } from "@/hooks";
import { catchError } from "@/lib";
import { InboundService } from "@/services";

interface InboundExtraInfoDialogProps {
  details?: InboundDetail[];
  onClose: VoidFunction;
}

export const InboundExtraInfoDialog: FC<InboundExtraInfoDialogProps> = ({ details, onClose }) => {
  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      receivedDate: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      batchNumber: Yup.string().required("Batch number is required"),
      receivedDate: Yup.string().required("Received date is required"),
    }),
    onSubmit: async (values) =>
      await toast.promise(
        InboundService.importOrders({
          batch: {
            batchNumber: values.batchNumber,
            receivedDate: values.receivedDate,
          },
          details: details || [],
        }),
        {
          success: () => {
            onClose();

            formik.resetForm();
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
          <div>
            <Input name="batchNumber" placeholder="Batch Number" value={formik.values.batchNumber} onChange={formik.handleChange} disabled />
            {formik.touched.batchNumber && formik.errors.batchNumber && <p className="text-red-500 text-sm">{formik.errors.batchNumber}</p>}
          </div>
          <div>
            <Input type="date" name="receivedDate" value={formik.values.receivedDate} onChange={formik.handleChange} />
            {formik.touched.receivedDate && formik.errors.receivedDate && <p className="text-red-500 text-sm">{formik.errors.receivedDate}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const InboundImportDialog = () => {
  const { result, call, reset } = useQuery(InboundService.uploadOrders);

  return (
    <RoleProtect role={["INVENTORY_STAFF"]}>
      <ImportDialog title="Import Inbound Orders" description="Upload inbound orders from Excel or CSV" onUpload={call} />

      <InboundExtraInfoDialog details={result?.content || undefined} onClose={reset} />
    </RoleProtect>
  );
};
