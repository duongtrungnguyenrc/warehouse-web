"use client";

import { Form, Formik } from "formik";
import { Plus } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

import { FormSelect } from "@/components";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";

export type CreateRoomRequest = {
  name: string;
  maxCapacity: number;
  envSettings: string;
  storageTypeId: string;
  warehouseId: string;
};

interface CreateRoomDialogProps {
  children?: React.ReactNode;
  warehouseId: string;
}

const storageTypes = [
  { value: "normal", label: "Normal Area" },
  { value: "cold", label: "Cold Storage" },
  { value: "dry", label: "Dry Area" },
  { value: "hazardous", label: "Hazardous Zone" },
];

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required"),
  maxCapacity: Yup.number().required("Capacity is required").min(1, "Capacity must be greater than 0"),
  envSettings: Yup.string(),
  storageTypeId: Yup.string().required("Storage type is required"),
});

export function CreateRoomDialog({ children, warehouseId }: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4" />
            Create
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>Create a new storage room in warehouse {warehouseId}</DialogDescription>
        </DialogHeader>

        <Formik<CreateRoomRequest>
          initialValues={{
            name: "",
            maxCapacity: 0,
            envSettings: "",
            storageTypeId: "",
            warehouseId,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            console.log("CreateRoomRequest:", values);
            setOpen(false);
            resetForm();
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input id="name" name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., Zone A - Frozen Goods" />
                {touched.name && errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacity (m³) *</Label>
                <Input id="maxCapacity" name="maxCapacity" type="number" value={values.maxCapacity} onChange={handleChange} onBlur={handleBlur} placeholder="e.g., 1000" />
                {touched.maxCapacity && errors.maxCapacity && <p className="text-sm text-red-500">{errors.maxCapacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageTypeId">Storage Type *</Label>
                <FormSelect name="storageTypeId" placeholder="Select storage type" options={storageTypes} value={values.storageTypeId} setFieldValue={setFieldValue} />
                {touched.storageTypeId && errors.storageTypeId && <p className="text-sm text-red-500">{errors.storageTypeId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="envSettings">Environmental Settings</Label>
                <Textarea
                  id="envSettings"
                  name="envSettings"
                  value={values.envSettings}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Temp: -18 to -15°C, Humidity: 60-70%"
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Create Room</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
