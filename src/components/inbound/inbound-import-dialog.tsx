"use client";

import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { type FC, useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { DatePicker, ImportDialog, Label, UserSelect } from "@/components";
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
  const [initialBatchNumber, setInitialBatchNumber] = useState("");

  const initialValues = {
    batchNumber: initialBatchNumber,
    receivedDate: "",
    inventoryStaff: "",
  };

  useEffect(() => {
    const fetchBatchNumber = async () => {
      const batchNumber = await InboundService.generateBatchNumber();
      setInitialBatchNumber(batchNumber);
    };

    fetchBatchNumber();
  }, []);

  const onCloseDialog = (open: boolean) => (!open ? onClose() : undefined);

  const validationSchema = Yup.object({
    batchNumber: Yup.string().required("Batch number is required"),
    receivedDate: Yup.string().required("Received date is required"),
    inventoryStaff: Yup.string().required("Inventory staff is required"),
  });

  const handleUpload = async (values: typeof initialValues, { resetForm }: FormikHelpers<typeof initialValues>) => {
    return toast.promise(
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
          resetForm();
          onClose();
          onImportedSuccess?.(newInboundOrders);
          return "Inbound order uploaded success!";
        },
        error: catchError,
        loading: "Uploading inbound orders...",
      },
    );
  };

  return (
    <Dialog open={!!details} onOpenChange={onCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Additional Information</DialogTitle>
        </DialogHeader>

        <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleUpload}>
          {({ values, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="batchNumber">Batch number *</Label>
                  <Input name="batchNumber" value={values.batchNumber} onChange={handleChange} disabled />
                  <ErrorMessage name="batchNumber" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="receivedDate">Received date *</Label>
                  <DatePicker name="receivedDate" value={values.receivedDate} placeholder="Select received date" setFieldValue={setFieldValue} />
                  <ErrorMessage name="receivedDate" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventoryStaff">Inventory staff *</Label>
                <UserSelect role={["INVENTORY_STAFF"]} name="inventoryStaff" placeholder="Select staff" setFieldValue={setFieldValue} value={values.inventoryStaff} />
                <ErrorMessage name="inventoryStaff" component="div" className="text-red-500 text-sm" />
              </div>

              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
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
