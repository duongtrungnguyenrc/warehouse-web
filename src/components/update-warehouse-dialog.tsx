"use client";

import { Form, Formik, type FormikHelpers } from "formik";
import { type ReactNode, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { UserSelect } from "@/components";
import { WarehouseStatusSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { catchError } from "@/lib";
import { WarehouseService } from "@/services";

interface UpdateWarehouseDialogProps {
  warehouse: Warehouse | null;
  children?: ReactNode;
  onUpdatedSuccess?: (warehouse: Warehouse) => void;
}

const WarehouseSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  areaSize: Yup.number().required("Required"),
  status: Yup.string().oneOf(["ACTIVE", "MAINTENANCE", "CLOSED"]).required(),
  manager: Yup.string().required("Required"),
});

export function UpdateWarehouseDialog({ warehouse, children, onUpdatedSuccess }: UpdateWarehouseDialogProps) {
  const [open, setOpen] = useState(false);
  if (!warehouse) return null;

  const onUpdateWarehouse = async (values: UpdateWarehouseRequest, helpers: FormikHelpers<UpdateWarehouseRequest>) => {
    await toast.promise(WarehouseService.update(warehouse.id, values), {
      success: (updated) => {
        helpers.resetForm();
        setOpen(false);
        onUpdatedSuccess?.(updated);
        return "Warehouse created success";
      },
      error: catchError,
      loading: "Creating warehouse",
    });
  };

  const initialValues: UpdateWarehouseRequest = {
    name: warehouse.name,
    address: warehouse.address,
    areaSize: warehouse.areaSize,
    status: warehouse.status,
    manager: warehouse.manager || "",
    type: warehouse.type,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Warehouse</DialogTitle>
          <DialogDescription>Edit warehouse information: {warehouse.id}</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={WarehouseSchema} onSubmit={onUpdateWarehouse}>
          {({ values, handleChange, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Warehouse Name *</Label>
                  <Input id="name" name="name" value={values.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <WarehouseStatusSelect value={values.status} handleChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" name="address" value={values.address} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaSize">Area Size (m²) *</Label>
                <Input id="areaSize" name="areaSize" type="number" value={values.areaSize} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Manager *</Label>
                <UserSelect role={["MANAGER"]} value={values.manager} setFieldValue={setFieldValue} />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
