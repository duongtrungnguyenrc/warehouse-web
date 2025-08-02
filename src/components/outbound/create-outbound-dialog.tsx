"use client";

import { FieldArray, Form, Formik, type FormikErrors, type FormikHelpers, type FormikProps } from "formik";
import { Package, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { OutboundImportWarningDialog, ProductSelect, UserSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useQuery } from "@/hooks";
import { OutboundService } from "@/services";
import { catchError } from "@/lib";

type CreateOutboundDialogProps = {
  onCreatedSuccess?: (newOrder: Outbound) => void;
};

type OutboundFormData = ImportOutboundRequest;

const validationSchema = Yup.object({
  batch: Yup.object({
    batchNumber: Yup.string().required("Batch number is required"),
    shippedDate: Yup.date().required("Shipped date is required"),
    inventoryStaff: Yup.string()
      .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format")
      .required("Inventory staff ID is required"),
  }),
  details: Yup.array()
    .of(
      Yup.object({
        sku: Yup.string().required("SKU is required"),
        quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
      }),
    )
    .min(1, "At least one detail item is required"),
});

export const CreateOutboundDialog = ({ onCreatedSuccess }: CreateOutboundDialogProps) => {
  const [open, setOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<OutboundValidateResponse | null>(null);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<OutboundFormData | null>(null);

  const { call: generateBatchNumber, result: batchNumber } = useQuery(OutboundService.generateBatchNumber);

  useEffect(() => {
    if (open && !batchNumber) {
      generateBatchNumber();
    }
  }, [generateBatchNumber, open, batchNumber]);

  const initialValues: OutboundFormData = {
    batch: {
      batchNumber: batchNumber || "",
      shippedDate: new Date().toISOString().split("T")[0],
      inventoryStaff: "",
    },
    details: [
      {
        sku: "",
        quantity: 0,
      },
    ],
  };

  const handleValidateAndSubmit = useCallback(async (values: OutboundFormData, formikHelpers: FormikHelpers<OutboundFormData>) => {
    try {
      setIsValidating(true);
      const result = await OutboundService.validateOrders(values);
      setValidationResult(result);

      if (!result.canProceed) {
        setPendingFormData(values);
        setShowValidationDialog(true);
      } else {
        await handleFinalSubmit(values, formikHelpers);
      }
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleFinalSubmit = useCallback(
    async (values: OutboundFormData, formikHelpers?: FormikHelpers<OutboundFormData>) => {
      let finalData = values;
      if (validationResult && !validationResult.canProceed) {
        finalData = {
          ...values,
          details: validationResult.sufficientProducts,
        };
      }

      await toast.promise(OutboundService.createOrder(finalData), {
        loading: "Creating outbound order...",
        success: (newOrder) => {
          formikHelpers?.resetForm();
          setOpen(false);
          setShowValidationDialog(false);
          setValidationResult(null);
          setPendingFormData(null);
          generateBatchNumber();
          onCreatedSuccess?.(newOrder);

          return "Outbound order created successfully!";
        },
        error: catchError,
      });
    },
    [validationResult],
  );

  const handleProceedWithValidItems = useCallback(async () => {
    if (pendingFormData) {
      await handleFinalSubmit(pendingFormData);
    }
  }, [pendingFormData, handleFinalSubmit]);

  const handleCancelValidation = useCallback(() => {
    setShowValidationDialog(false);
    setValidationResult(null);
    setPendingFormData(null);
  }, []);

  return (
    <>
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
              Create New Outbound
            </DialogTitle>
            <DialogDescription>Create a new outbound shipment with inventory validation.</DialogDescription>
          </DialogHeader>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleValidateAndSubmit} enableReinitialize>
            {({ values, errors, touched, handleChange, setFieldValue, handleBlur, isSubmitting }: FormikProps<OutboundFormData>) => (
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
                        <Label htmlFor="batch.shippedDate">
                          Shipped Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="batch.shippedDate"
                          name="batch.shippedDate"
                          type="date"
                          value={values.batch.shippedDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={errors.batch?.shippedDate && touched.batch?.shippedDate ? "border-red-500" : ""}
                        />
                        {errors.batch?.shippedDate && touched.batch?.shippedDate && <p className="text-sm text-red-500">{errors.batch.shippedDate}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch.inventoryStaff">
                        Inventory Staff ID <span className="text-red-500">*</span>
                      </Label>
                      <UserSelect
                        role={["INVENTORY_STAFF"]}
                        placeholder="Select staff"
                        name="batch.inventoryStaff"
                        setFieldValue={setFieldValue}
                        value={values.batch.inventoryStaff}
                      />

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

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`details.${index}.sku`}>
                                    SKU <span className="text-red-500">*</span>
                                  </Label>

                                  <ProductSelect setFieldValue={setFieldValue} name={`details.${index}.sku`} value={values.details[index].sku} />

                                  {errors.details &&
                                    Array.isArray(errors.details) &&
                                    errors.details[index] &&
                                    typeof errors.details[index] === "object" &&
                                    (errors.details[index] as FormikErrors<OutboundDetail>)?.sku &&
                                    touched.details?.[index]?.sku && <p className="text-sm text-red-500">{(errors.details[index] as FormikErrors<OutboundDetail>).sku}</p>}
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
                                      (errors.details[index] as FormikErrors<OutboundDetail>)?.quantity &&
                                      touched.details?.[index]?.quantity
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                  {errors.details &&
                                    Array.isArray(errors.details) &&
                                    errors.details[index] &&
                                    typeof errors.details[index] === "object" &&
                                    (errors.details[index] as FormikErrors<OutboundDetail>)?.quantity &&
                                    touched.details?.[index]?.quantity && (
                                      <p className="text-sm text-red-500">{(errors.details[index] as FormikErrors<OutboundDetail>).quantity}</p>
                                    )}
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
                                quantity: 0,
                              })
                            }
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Item
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
                  <Button type="submit" disabled={isSubmitting || isValidating}>
                    {isValidating ? "Validating..." : isSubmitting ? "Creating..." : "Validate & Create Outbound"}
                  </Button>
                </DialogFooter>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <OutboundImportWarningDialog open={showValidationDialog} setOpen={setShowValidationDialog} onProcess={handleProceedWithValidItems} onCancel={handleCancelValidation} />
    </>
  );
};
