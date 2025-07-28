"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { PenBox } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { RoomTypeSelect } from "./room-type-select";
import { WarehouseSelect } from "./warehouse";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { catchError } from "@/lib";
import { WarehouseService } from "@/services";

type UpdateRoomDialogProps = {
  room: Room;
  onUpdatedSuccess: (updatedRoom: Room) => void;
};

const validationSchema = Yup.object({
  name: Yup.string().required("Room name is required"),
  maxCapacity: Yup.number().min(1).required("Max capacity is required"),
  envSettings: Yup.string().required("Environment settings are required"),
  storageTypeId: Yup.string().required("Storage Type is required"),
  warehouseId: Yup.string().required("Warehouse ID is required"),
});

export const UpdateRoomDialog = ({ room, onUpdatedSuccess }: UpdateRoomDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: UpdateRoomRequest) => {
    toast.promise(WarehouseService.updateRoom(room.id, values), {
      loading: "Updating room...",
      success: (updatedRoom) => {
        onUpdatedSuccess(updatedRoom);
        setOpen(false);
        return "Room updated successfully!";
      },
      error: catchError,
    });
  };

  const initialData: UpdateRoomRequest = {
    name: room.name,
    maxCapacity: room.maxCapacity,
    envSettings: room.envSettings,
    storageTypeId: room.storageType.id,
    warehouseId: room.warehouse.id,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PenBox className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Room</DialogTitle>
          <DialogDescription>Update the room information below.</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialData} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Field as={Input} id="name" name="name" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Field as={Input} type="number" id="maxCapacity" name="maxCapacity" />
                <ErrorMessage name="maxCapacity" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="envSettings">Environment Settings</Label>
                <Field as={Input} id="envSettings" name="envSettings" />
                <ErrorMessage name="envSettings" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageTypeId">Storage Type ID</Label>
                <RoomTypeSelect setFieldValue={setFieldValue} value={values.storageTypeId} />
                <ErrorMessage name="storageTypeId" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseId">Warehouse ID</Label>
                <WarehouseSelect setFieldValue={setFieldValue} value={values.warehouseId} />
                <ErrorMessage name="warehouseId" component="div" className="text-red-500 text-sm" />
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  Update
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
