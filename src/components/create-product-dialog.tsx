"use client";

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { Plus } from "lucide-react";
import { type ChangeEvent, type ReactNode, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { CategorySelect, FormSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { useQuery } from "@/hooks";
import { catchError, cn } from "@/lib";
import { ProductService } from "@/services";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required").min(2).max(100),
  price: Yup.number().required("Price is required").min(0).max(999999999),
  unitOfMeasure: Yup.string().required("Unit of measure is required").max(20),
  packageSize: Yup.string().required("Package size is required").max(50),
  weight: Yup.number().required("Weight is required").min(0).max(999999),
  categoryId: Yup.string().required("Category is required").uuid(),
  sku: Yup.string()
    .required("SKU is required")
    .matches(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers and dashes")
    .max(50),
});

const commonUnits = ["pcs", "unit", "kg", "g", "liter", "ml", "m", "cm", "box", "bag", "carton", "set"];

const initialValues: CreateProductRequest = {
  name: "",
  price: 0,
  unitOfMeasure: "",
  packageSize: "",
  weight: 0,
  categoryId: "",
  sku: "",
};

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  description?: string;
  children: ReactNode;
}

const FormField = ({ label, name, required = false, description, children }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    {children}
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
    <ErrorMessage name={name} component="p" className="text-sm font-medium text-destructive" />
  </div>
);

interface AddProductDialogProps {
  onProductAdded?: (product: Product) => void;
  children?: ReactNode;
}

export function CreateProductDialog({ onProductAdded, children }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { call, result: sku, loading } = useQuery(ProductService.getSKU);
  const [creating, startTransition] = useTransition();

  useEffect(() => {
    if (open && !sku) {
      call();
    }
  }, [call, open, sku]);

  const handleSubmit = async (values: CreateProductRequest, { resetForm }: FormikHelpers<CreateProductRequest>) => {
    startTransition(async () =>
      toast.promise(
        async () => {
          const product = await ProductService.create(values);

          onProductAdded?.(product);
          resetForm();
          setOpen(false);
        },
        {
          success: "Product created successfully",
          loading: "Creating product...",
          error: catchError,
        },
      ),
    );
  };

  const defaultTrigger = (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Product
    </Button>
  );

  const initialFormValues: CreateProductRequest = {
    ...initialValues,
    sku: sku || "",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill in the form to create a new product</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", creating ? "pointer-events-none opacity-80" : "")}>
                <FormField label="Product Name" name="name" required>
                  <Field name="name">
                    {({ field }: any) => <Input {...field} placeholder="Enter product name" className={`md:col-span-2 ${errors.name && touched.name ? "border-red-500" : ""}`} />}
                  </Field>
                </FormField>

                <FormField label="SKU" name="sku" required>
                  <Field name="sku">
                    {({ field }: any) => (
                      <Input {...field} value={values.sku} placeholder="AUTO-SKU" disabled className={`uppercase ${errors.sku && touched.sku ? "border-red-500" : ""}`} />
                    )}
                  </Field>
                </FormField>

                <FormField label="Price" name="price" required>
                  <Field name="price">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue("price", Number.parseFloat(e.target.value) || 0)}
                        className={errors.price && touched.price ? "border-red-500" : ""}
                      />
                    )}
                  </Field>
                </FormField>

                <FormField label="Weight (kg)" name="weight" required>
                  <Field name="weight">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue("weight", Number.parseFloat(e.target.value) || 0)}
                        className={errors.weight && touched.weight ? "border-red-500" : ""}
                      />
                    )}
                  </Field>
                </FormField>

                <FormField label="Category" name="categoryId" required>
                  <CategorySelect value={values.categoryId} setFieldValue={setFieldValue} />
                </FormField>

                <FormField label="Unit of Measure" name="unitOfMeasure" required>
                  <FormSelect
                    name="unitOfMeasure"
                    placeholder="Select unit"
                    options={commonUnits.map((unit) => ({ value: unit, label: unit }))}
                    setFieldValue={setFieldValue}
                    value={values.unitOfMeasure}
                  />
                </FormField>

                <FormField label="Package Size" name="packageSize" required>
                  <Field name="packageSize">
                    {({ field }: any) => <Input {...field} placeholder="e.g., 30x20x10 cm" className={errors.packageSize && touched.packageSize ? "border-red-500" : ""} />}
                  </Field>
                </FormField>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || loading || !sku}>
                  {isSubmitting ? "Submitting..." : "Add Product"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
