import { useFormik } from "formik";
import { type FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { ConfirmDialog, ImportDialog, Label, RoleProtect, UserSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { useQuery } from "@/hooks";
import { catchError } from "@/lib";
import { OutboundService } from "@/services";

interface OutboundExtraInfoDialogProps {
  details?: OutboundDetail[];
  onClose: VoidFunction;
}

const OutboundExtraInfoDialog: FC<OutboundExtraInfoDialogProps> = ({ details, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmCallback = useRef<VoidFunction | null>(null);

  const formik = useFormik({
    initialValues: {
      batchNumber: "",
      shippedDate: "",
      inventoryStaff: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      batchNumber: Yup.string().required("Batch number is required"),
      shippedDate: Yup.string().required("Shipped date is required"),
    }),
    onSubmit: async (values) => {
      const request: ImportOutboundRequest = {
        batch: {
          batchNumber: values.batchNumber,
          shippedDate: values.shippedDate,
          inventoryStaff: values.inventoryStaff,
        },
        details: details || [],
      };

      try {
        const validation = await OutboundService.validateOrders(request);

        if (!validation.canProceed) {
          confirmCallback.current = async () => {
            await toast.promise(OutboundService.importOrders(request), {
              success: () => {
                onClose();
                formik.resetForm();
                return "Outbound order imported success!";
              },
              error: catchError,
              loading: "Importing outbound orders...",
            });
          };

          setShowConfirm(true);
          return;
        }

        await toast.promise(OutboundService.importOrders(request), {
          success: () => {
            onClose();
            formik.resetForm();
            return "Outbound order imported success!";
          },
          error: catchError,
          loading: "Importing outbound orders...",
        });
      } catch (err) {
        toast.error(catchError(err));
      }
    },
  });

  const getBatchNumber = async () => {
    const batchNumber = await OutboundService.generateBatchNumber();
    await formik.setFieldValue("batchNumber", batchNumber);
  };

  const onCloseDialog = (open: boolean) => (!open ? onClose() : undefined);

  useEffect(() => {
    getBatchNumber();
  }, []);

  return (
    <>
      <Dialog open={!!details} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Batch number *</Label>

                <Input name="batchNumber" placeholder="Batch Number" value={formik.values.batchNumber} onChange={formik.handleChange} disabled />
                {formik.touched.batchNumber && formik.errors.batchNumber && <p className="text-red-500 text-sm">{formik.errors.batchNumber}</p>}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Received date *</Label>

                <Input type="date" name="shippedDate" value={formik.values.shippedDate} onChange={formik.handleChange} />
                {formik.touched.shippedDate && formik.errors.shippedDate && <p className="text-red-500 text-sm">{formik.errors.shippedDate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Inventory staff *</Label>

              <UserSelect role={["INVENTORY_STAFF"]} name="inventoryStaff" placeholder="Select staff" setFieldValue={formik.setFieldValue} value={formik.values.inventoryStaff} />
              {formik.touched.inventoryStaff && formik.errors.inventoryStaff && <p className="text-red-500 text-sm">{formik.errors.inventoryStaff}</p>}
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirm}
        setOpen={setShowConfirm}
        title="Some products are invalid"
        itemName="Proceed with valid items only?"
        type="confirm"
        onConfirm={() => {
          confirmCallback.current?.();
          setShowConfirm(false);
        }}
        cancelText="No"
        confirmText="Yes, continue"
      />
    </>
  );
};

export const OutboundImportDialog = () => {
  const { result, call, reset } = useQuery(OutboundService.uploadOrders);

  return (
    <RoleProtect role={["INVENTORY_STAFF"]}>
      <ImportDialog title="Import Outbound Orders" description="Upload outbound orders from Excel or CSV" onUpload={call} />
      <OutboundExtraInfoDialog details={result || undefined} onClose={reset} />
    </RoleProtect>
  );
};
