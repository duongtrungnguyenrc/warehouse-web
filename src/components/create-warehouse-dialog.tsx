"use client";

import { Form, Formik } from "formik";
import { type ReactNode, useState } from "react";
import * as Yup from "yup";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { WarehouseTypeSelect } from "@/components";
import { WarehouseService } from "@/services";

interface CreateWarehouseDialogProps {
  children: ReactNode;
  onSuccess?: (warehouse: Warehouse) => void;
}

const CreateWarehouseSchema = Yup.object().shape({
  name: Yup.string().required("Warehouse name is required"),
  address: Yup.string().required("Warehouse address is required"),
  areaSize: Yup.number().required("Warehouse area size is required").min(1),
  type: Yup.string().oneOf(["DC", "CW"]).required("Warehouse size is required"),
});

const initialFormValues: CreateWarehouseRequest = {
  name: "",
  address: "",
  areaSize: 0,
  type: "DC",
  status: "ACTIVE",
};

export function CreateWarehouseDialog({ children, onSuccess }: CreateWarehouseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Warehouse</DialogTitle>
          <DialogDescription>Fill in the details to create a new warehouse in the system</DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialFormValues}
          validationSchema={CreateWarehouseSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const warehouse = await WarehouseService.create(values);
              onSuccess?.(warehouse);
              resetForm();
              setOpen(false);
            } catch (error) {
              console.error("Failed to create warehouse:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Warehouse Name *</Label>
                  <Input id="name" name="name" placeholder="e.g., Northern Central Warehouse" value={values.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Warehouse Type *</Label>
                  <WarehouseTypeSelect value={values.type} handleChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" name="address" placeholder="Enter full address of the warehouse" value={values.address} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaSize">Area Size (m²) *</Label>
                <Input id="areaSize" name="areaSize" type="number" placeholder="e.g., 5000" value={values.areaSize} onChange={handleChange} required />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Warehouse"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
