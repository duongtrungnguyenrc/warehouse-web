"use client";

import { FieldArray, Form, Formik, type FormikErrors, type FormikHelpers, type FormikProps } from "formik";
import { Package, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { ProductSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { UserSelect } from "@/components";
import { useQuery } from "@/hooks";
import { catchError } from "@/lib";
import { InboundService } from "@/services";

type CreateInboundDialogProps = {
  onCreatedSuccess?: (newOrder: Inbound) => void;
};

type InboundFormData = ImportInboundRequest;

const validationSchema = Yup.object({
  batch: Yup.object({
    batchNumber: Yup.string().required("Batch number is required"),
    receivedDate: Yup.date().required("Received date is required"),
    inventoryStaff: Yup.string()
      .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format")
      .required("Inventory staff ID is required"),
  }),
  details: Yup.array()
    .of(
      Yup.object({
        sku: Yup.string().required("SKU is required"),
        expiryDate: Yup.date().required("Expiry date is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
      }),
    )
    .min(1, "At least one detail item is required"),
});

export const CreateInboundDialog = ({ onCreatedSuccess }: CreateInboundDialogProps) => {
  const [open, setOpen] = useState(false);
  const { call, result: batchNumber } = useQuery(InboundService.generateBatchNumber);

  useEffect(() => {
    if (open && !batchNumber) {
      call();
    }
  }, [call, open, batchNumber]);

  const handleSubmit = useCallback(
    async (values: InboundFormData, { resetForm }: FormikHelpers<InboundFormData>) =>
      toast.promise(InboundService.createOrder(values), {
        success: (newOrder) => {
          resetForm();
          onCreatedSuccess?.(newOrder);
          return "Inbound order created success.";
        },
        error: catchError,
        loading: "Creating inbound order...",
      }),
    [],
  );

  const initialValues: InboundFormData = {
    batch: {
      batchNumber: batchNumber || "",
      receivedDate: new Date().toISOString().split("T")[0],
      inventoryStaff: "",
    },
    details: [],
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Create New Inbound
          </DialogTitle>
          <DialogDescription>Add a new inbound inventory batch with multiple items.</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }: FormikProps<InboundFormData>) => (
            <Form className="space-y-6">
              {/* Batch Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Batch Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="batch.batchNumber">
                        Batch Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        disabled
                        id="batch.batchNumber"
                        name="batch.batchNumber"
                        value={values.batch.batchNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter batch number"
                        className={errors.batch?.batchNumber && touched.batch?.batchNumber ? "border-red-500" : ""}
                      />
                      {errors.batch?.batchNumber && touched.batch?.batchNumber && <p className="text-sm text-red-500">{errors.batch.batchNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch.receivedDate">
                        Received Date <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="batch.receivedDate"
                          name="batch.receivedDate"
                          type="date"
                          value={values.batch.receivedDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.batch?.receivedDate && touched.batch?.receivedDate ? "border-red-500" : ""}
                        />
                      </div>
                      {errors.batch?.receivedDate && touched.batch?.receivedDate && <p className="text-sm text-red-500">{errors.batch.receivedDate}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch.inventoryStaff">
                      Inventory Staff ID <span className="text-red-500">*</span>
                    </Label>

                    <UserSelect role={["INVENTORY_STAFF"]} name="batch.inventoryStaff" setFieldValue={setFieldValue} value={values.batch.inventoryStaff} />
                    {errors.batch?.inventoryStaff && touched.batch?.inventoryStaff && <p className="text-sm text-red-500">{errors.batch.inventoryStaff}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Item Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldArray name="details">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.details.map((_, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Item {index + 1}</h4>
                              {values.details.length > 1 && (
                                <Button type="button" variant="outline" size="sm" onClick={() => remove(index)} className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`details.${index}.sku`}>
                                  SKU <span className="text-red-500">*</span>
                                </Label>

                                <ProductSelect setFieldValue={setFieldValue} name={`details.${index}.sku`} value={values.details[index].sku} />

                                {errors.details &&
                                  Array.isArray(errors.details) &&
                                  errors.details[index] &&
                                  typeof errors.details[index] === "object" &&
                                  (errors.details[index] as FormikErrors<InboundDetail>)?.sku &&
                                  touched.details?.[index]?.sku && <p className="text-sm text-red-500">{(errors.details[index] as FormikErrors<InboundDetail>).sku}</p>}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`details.${index}.expiryDate`}>
                                  Expiry Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                  <Input
                                    id={`details.${index}.expiryDate`}
                                    name={`details.${index}.expiryDate`}
                                    type="date"
                                    value={values.details[index].expiryDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                      errors.details &&
                                      Array.isArray(errors.details) &&
                                      errors.details[index] &&
                                      typeof errors.details[index] === "object" &&
                                      (errors.details[index] as FormikErrors<InboundDetail>)?.expiryDate &&
                                      touched.details?.[index]?.expiryDate
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                </div>
                                {errors.details &&
                                  Array.isArray(errors.details) &&
                                  errors.details[index] &&
                                  typeof errors.details[index] === "object" &&
                                  (errors.details[index] as FormikErrors<InboundDetail>)?.expiryDate &&
                                  touched.details?.[index]?.expiryDate && (
                                    <p className="text-sm text-red-500">{(errors.details[index] as FormikErrors<InboundDetail>).expiryDate}</p>
                                  )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`details.${index}.quantity`}>
                                  Quantity <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id={`details.${index}.quantity`}
                                  name={`details.${index}.quantity`}
                                  type="number"
                                  min="1"
                                  value={values.details[index].quantity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="0"
                                  className={
                                    errors.details &&
                                    Array.isArray(errors.details) &&
                                    errors.details[index] &&
                                    typeof errors.details[index] === "object" &&
                                    (errors.details[index] as FormikErrors<InboundDetail>)?.quantity &&
                                    touched.details?.[index]?.quantity
                                      ? "border-red-500"
                                      : ""
                                  }
                                />
                                {errors.details &&
                                  Array.isArray(errors.details) &&
                                  errors.details[index] &&
                                  typeof errors.details[index] === "object" &&
                                  (errors.details[index] as FormikErrors<InboundDetail>)?.quantity &&
                                  touched.details?.[index]?.quantity && <p className="text-sm text-red-500">{(errors.details[index] as FormikErrors<InboundDetail>).quantity}</p>}
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            push({
                              sku: "",
                              expiryDate: "",
                              quantity: 0,
                            })
                          }
                          className="w-full"
                        >
                          <Plus className="w-4 h-4" />
                          Add item
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Inbound"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
