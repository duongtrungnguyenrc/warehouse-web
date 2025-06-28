"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

interface Warehouse {
  id: string;
  name: string;
  address: string;
  area: number;
  capacity: number;
  status: "active" | "warning" | "inactive";
  manager: string;
  phone: string;
  email: string;
}

interface UpdateWarehouseDialogProps {
  warehouse: Warehouse | null;
  children?: React.ReactNode;
  onUpdate: (warehouse: Warehouse) => void;
}

export function UpdateWarehouseDialog({ warehouse, children, onUpdate }: UpdateWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    capacity: "",
    status: "",
    manager: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        address: warehouse.address,
        area: warehouse.area.toString(),
        capacity: warehouse.capacity.toString(),
        status: warehouse.status,
        manager: warehouse.manager,
        phone: warehouse.phone,
        email: warehouse.email,
      });
    }
  }, [warehouse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouse) return;

    const updatedWarehouse: Warehouse = {
      ...warehouse,
      name: formData.name,
      address: formData.address,
      area: parseInt(formData.area),
      capacity: parseInt(formData.capacity),
      status: formData.status as "active" | "warning" | "inactive",
      manager: formData.manager,
      phone: formData.phone,
      email: formData.email,
    };

    onUpdate(updatedWarehouse);
  };

  if (!warehouse) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập Nhật Kho Hàng</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin kho hàng {warehouse.id}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Kho *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa Chỉ *</Label>
            <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Diện Tích (m²) *</Label>
              <Input id="area" type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Sức Chứa (m³) *</Label>
              <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Người Quản Lý *</Label>
            <Input id="manager" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số Điện Thoại *</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>

            <Button type="submit">Cập Nhật</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
