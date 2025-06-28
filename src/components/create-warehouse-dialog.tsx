import type React from "react";
import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

interface CreateWarehouseDialogProps {
  children: React.ReactNode;
}

export function CreateWarehouseDialog({ children }: CreateWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    area: "",
    capacity: "",
    type: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý tạo kho mới
    console.log("Creating warehouse:", formData);
    // Reset form
    setFormData({
      code: "",
      name: "",
      address: "",
      area: "",
      capacity: "",
      type: "",
      description: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo Kho Mới</DialogTitle>
          <DialogDescription>Nhập thông tin chi tiết để tạo kho hàng mới trong hệ thống</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã Kho *</Label>
              <Input id="code" placeholder="VD: WH001" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại Kho *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại kho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Kho thường</SelectItem>
                  <SelectItem value="cold">Kho lạnh</SelectItem>
                  <SelectItem value="dry">Kho khô</SelectItem>
                  <SelectItem value="hazardous">Kho hàng nguy hiểm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên Kho *</Label>
            <Input id="name" placeholder="VD: Kho Trung Tâm Miền Bắc" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa Chỉ *</Label>
            <Textarea
              id="address"
              placeholder="Nhập địa chỉ đầy đủ của kho"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Diện Tích (m²) *</Label>
              <Input id="area" type="number" placeholder="VD: 5000" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Sức Chứa (m³) *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="VD: 10000"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả thêm về kho (tùy chọn)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit">Tạo Kho</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
