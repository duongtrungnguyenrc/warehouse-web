"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { CategorySelect } from "./category-select";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { catchError } from "@/lib";
import { ProductService } from "@/services";

interface UpdateProductDialogProps {
  product: Product | null;
  onUpdatedSuccess: (updatedProduct: Product) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  price: Yup.number().min(0).required("Required"),
  unitOfMeasure: Yup.string().required("Required"),
  packageSize: Yup.string().required("Required"),
  weight: Yup.number().min(0).required("Required"),
  stockQuantity: Yup.number().min(0).required("Required"),
  categoryId: Yup.string().required("Required"),
});

export function UpdateProductDialog({ product, onUpdatedSuccess }: UpdateProductDialogProps) {
  if (!product) return null;

  const initialValues: UpdateProductRequest = {
    name: product.name,
    price: product.price,
    unitOfMeasure: product.unitOfMeasure,
    packageSize: product.packageSize,
    weight: product.weight,
    stockQuantity: product.stockQuantity,
    categoryId: product.category.id,
  };

  const handleUpdate = async (values: UpdateProductRequest) => {
    toast.promise(ProductService.update(product.id, values), {
      loading: "Updating product...",
      success: (updatedProduct) => {
        onUpdatedSuccess(updatedProduct);
        return "Product updated successfully!";
      },
      error: catchError,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Editing product info: {product.sku}</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleUpdate}>
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Field as={Input} id="name" name="name" />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Field as={Input} id="price" name="price" type="number" />
                  <ErrorMessage name="price" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <CategorySelect value={values.categoryId} setFieldValue={setFieldValue} />
                  <ErrorMessage name="categoryId" component="div" className="text-sm text-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitOfMeasure">Unit of Measure *</Label>
                  <Field as={Input} id="unitOfMeasure" name="unitOfMeasure" />
                  <ErrorMessage name="unitOfMeasure" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packageSize">Package Size *</Label>
                  <Field as={Input} id="packageSize" name="packageSize" />
                  <ErrorMessage name="packageSize" component="div" className="text-sm text-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Field as={Input} id="weight" name="weight" type="number" />
                  <ErrorMessage name="weight" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                  <Field as={Input} id="stockQuantity" name="stockQuantity" type="number" />
                  <ErrorMessage name="stockQuantity" component="div" className="text-sm text-red-500" />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
