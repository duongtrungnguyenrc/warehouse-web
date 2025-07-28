"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Edit } from "lucide-react";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { CategoryService } from "@/services";

interface UpdateCategoryDialogProps {
  category: Category;
  onSuccess: (category: Category) => void;
  children?: React.ReactNode;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Category name is required").min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: Yup.string().max(200, "Description must be less than 200 characters"),
});

export function UpdateCategoryDialog({ category, onSuccess, children }: UpdateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const initialValues = {
    name: category.name,
    description: category.description,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      const updatedCategory = await CategoryService.update(category.id, values);
      onSuccess(updatedCategory);
      toast.success("Category updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize={true}>
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>Update Category</DialogTitle>
                <DialogDescription>Edit the category information.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Field name="name">
                    {({ field }: any) => <Input {...field} id="name" placeholder="Enter category name" className={errors.name && touched.name ? "border-red-500" : ""} />}
                  </Field>
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Field name="description">
                    {({ field }: any) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Enter category description"
                        rows={3}
                        className={errors.description && touched.description ? "border-red-500" : ""}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
