"use client";

import { Form, Formik } from "formik";
import { AlertTriangle, Droplets, Shield, Thermometer } from "lucide-react";
import type { ReactNode } from "react";
import * as Yup from "yup";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";

interface UpdateRoomDialogProps {
  zone: Room | null;
  children?: ReactNode;
  onUpdatedSuccess: (zone: Room) => void;
}

const RoomSchema = Yup.object({
  name: Yup.string().required("Tên không được để trống"),
  maxCapacity: Yup.number().required("Dung lượng không được để trống"),
  storageTypeName: Yup.string().required("Loại lưu trữ không được để trống"),
});

export function UpdateRoomDialog({ zone, children, onUpdatedSuccess }: UpdateRoomDialogProps) {
  const initialValues = {
    name: zone?.name || "",
    maxCapacity: zone?.maxCapacity || 0,
    storageTypeName: zone?.storageType.name || "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    if (!zone) return;
    onUpdatedSuccess({ ...zone, ...values });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "cold":
        return <Thermometer className="h-4 w-4 text-blue-500" />;
      case "dry":
        return <Droplets className="h-4 w-4 text-yellow-500" />;
      case "hazardous":
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cold":
        return "bg-blue-50 text-blue-700";
      case "dry":
        return "bg-yellow-50 text-yellow-700";
      case "hazardous":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  if (!zone) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTypeIcon(zone.storageType.name)}
            <span>Cập Nhật Khu Vực {zone.id}</span>
            <Badge className={getTypeColor(zone.storageType.name)}>{zone.storageType.name}</Badge>
          </DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin cơ bản của khu vực</DialogDescription>
        </DialogHeader>

        <Formik initialValues={initialValues} validationSchema={RoomSchema} onSubmit={handleSubmit} enableReinitialize>
          {({ values, handleChange, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên khu vực *</Label>
                <Input id="name" name="name" value={values.name} onChange={handleChange} className={errors.name && touched.name ? "border-red-500" : ""} />
                {errors.name && touched.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Dung lượng tối đa (m³) *</Label>
                <Input
                  id="maxCapacity"
                  name="maxCapacity"
                  type="number"
                  value={values.maxCapacity}
                  onChange={handleChange}
                  className={errors.maxCapacity && touched.maxCapacity ? "border-red-500" : ""}
                />
                {errors.maxCapacity && touched.maxCapacity && <p className="text-red-500 text-sm">{errors.maxCapacity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageTypeName">Loại lưu trữ *</Label>
                <Select value={values.storageTypeName} onValueChange={(value) => handleChange({ target: { name: "storageTypeName", value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Khu vực lạnh</SelectItem>
                    <SelectItem value="dry">Khu vực khô</SelectItem>
                    <SelectItem value="hazardous">Nguy hiểm</SelectItem>
                    <SelectItem value="normal">Thường</SelectItem>
                  </SelectContent>
                </Select>
                {errors.storageTypeName && touched.storageTypeName && <p className="text-red-500 text-sm">{errors.storageTypeName}</p>}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </DialogClose>
                <Button type="submit">Cập nhật</Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
