"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { type FC, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { ConfirmDialog, ImportDialog, Label, UserSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { useQuery } from "@/hooks";
import { catchError } from "@/lib";
import { OutboundService } from "@/services";

interface OutboundExtraInfoDialogProps {
  details?: OutboundDetail[];
  onClose: VoidFunction;
  onImportedSuccess?: (orders: Outbound[]) => void;
}

const validationSchema = Yup.object({
  batchNumber: Yup.string().required("Batch number is required"),
  shippedDate: Yup.string().required("Shipped date is required"),
  inventoryStaff: Yup.string().required("Inventory staff is required"),
});

export const OutboundExtraInfoDialog: FC<OutboundExtraInfoDialogProps> = ({ details, onClose, onImportedSuccess }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmCallback = useRef<VoidFunction | null>(null);

  const { call: generateBatchNumber, result: batchNumber } = useQuery(OutboundService.generateBatchNumber);

  useEffect(() => {
    generateBatchNumber();
  }, [generateBatchNumber]);

  const initialValues = {
    batchNumber: batchNumber || "",
    shippedDate: "",
    inventoryStaff: "",
  };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const request: ImportOutboundRequest = {
      batch: {
        batchNumber: values.batchNumber || "",
        shippedDate: values.shippedDate,
        inventoryStaff: values.inventoryStaff,
      },
      details: details || [],
    };

    try {
      const validation = await OutboundService.validateOrders(request);

      const doImport = async () => {
        await toast.promise(OutboundService.importOrders(request), {
          success: (newOutboundOrders) => {
            onClose();
            helpers.resetForm();
            onImportedSuccess?.(newOutboundOrders);
            return "Outbound order imported successfully!";
          },
          error: catchError,
          loading: "Importing outbound orders...",
        });
      };

      if (!validation.canProceed) {
        confirmCallback.current = doImport;
        setShowConfirm(true);
        return;
      }

      await doImport();
    } catch (err) {
      toast.error(catchError(err));
    }
  };

  const handleCloseDialog = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <>
      <Dialog open={!!details} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Additional Information</DialogTitle>
          </DialogHeader>

          <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-2">
                    <Label>Batch number *</Label>
                    <Input name="batchNumber" value={values.batchNumber} disabled />
                    {touched.batchNumber && errors.batchNumber && <p className="text-sm text-red-500">{errors.batchNumber}</p>}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Shipped date *</Label>
                    <Input type="date" name="shippedDate" value={values.shippedDate} onChange={handleChange} />
                    {touched.shippedDate && errors.shippedDate && <p className="text-sm text-red-500">{errors.shippedDate}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Inventory staff *</Label>
                  <UserSelect role={["INVENTORY_STAFF"]} name="inventoryStaff" placeholder="Select staff" setFieldValue={setFieldValue} value={values.inventoryStaff} />
                  {touched.inventoryStaff && errors.inventoryStaff && <p className="text-sm text-red-500">{errors.inventoryStaff}</p>}
                </div>

                <DialogFooter>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
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
        confirmText="Yes, continue"
      />
    </>
  );
};

export const OutboundImportDialog = () => {
  const { result, call, reset } = useQuery(OutboundService.uploadOrders);

  return (
    <>
      <ImportDialog title="Import Outbound Orders" description="Upload outbound orders from Excel or CSV" onUpload={call} templateDownloader={OutboundService.getImportTemplate} />
      <OutboundExtraInfoDialog details={result || undefined} onClose={reset} />
    </>
  );
};
