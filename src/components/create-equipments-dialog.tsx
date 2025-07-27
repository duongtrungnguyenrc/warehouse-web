"use client";

import { Formik, FormikHelpers } from "formik";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { catchError } from "@/lib";
import { WarehouseService } from "@/services";

type AddEquipmentDialogProps = {
  onSuccess: (equipments: Equipment[]) => void;
};

const validationSchema = Yup.object({
  quantity: Yup.number().min(1).required(),
  maxSize: Yup.number().min(1).required(),
});

export const CreateEquipmentsDialog = ({ onSuccess }: AddEquipmentDialogProps) => {
  const [open, setOpen] = useState(false);

  const initialValues = {
    quantity: 1,
    maxSize: 0,
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<typeof initialValues>) => {
    await toast.promise(WarehouseService.createEquipments(values), {
      loading: "Creating equipments...",
      success: (equipments) => {
        onSuccess(equipments);
        setOpen(false);
        return "Equipments created successfully!";
      },
      error: catchError,
    });

    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Create Equipment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Equipments</DialogTitle>
          <DialogDescription>Enter quantity and max size of each equipment.</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" value={values.quantity} onChange={handleChange} />
                {errors.quantity && <div className="text-red-500 text-sm mt-1">{errors.quantity}</div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSize">Max Size</Label>
                <Input id="maxSize" name="maxSize" type="number" value={values.maxSize} onChange={handleChange} />
                {errors.maxSize && <div className="text-red-500 text-sm mt-1">{errors.maxSize}</div>}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
