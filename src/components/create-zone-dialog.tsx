"use client";

import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Switch } from "@/components/shadcn/switch";
import { Textarea } from "@/components/shadcn/textarea";

interface CreateZoneDialogProps {
  children?: React.ReactNode;
  warehouseId: string;
}

export function CreateZoneDialog({ children, warehouseId }: CreateZoneDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    capacity: "",
    temperature: "",
    humidity: "",
    hasTemperatureControl: false,
    hasHumidityControl: false,
    hasFireSafety: false,
    hasSecuritySystem: false,
    allowedProductTypes: [] as string[],
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating zone:", { ...formData, warehouseId });
    setFormData({
      code: "",
      name: "",
      type: "",
      capacity: "",
      temperature: "",
      humidity: "",
      hasTemperatureControl: false,
      hasHumidityControl: false,
      hasFireSafety: false,
      hasSecuritySystem: false,
      allowedProductTypes: [],
      description: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Khu Vực Mới</DialogTitle>
          <DialogDescription>Tạo khu vực lưu trữ mới trong kho {warehouseId}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã Khu Vực *</Label>
              <Input id="code" placeholder="VD: A01" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại Khu Vực *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Khu vực thường</SelectItem>
                  <SelectItem value="cold">Khu vực lạnh</SelectItem>
                  <SelectItem value="dry">Khu vực khô</SelectItem>
                  <SelectItem value="hazardous">Khu vực nguy hiểm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên Khu Vực *</Label>
            <Input id="name" placeholder="VD: Khu A - Hàng đông lạnh" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Dung Lượng (m³) *</Label>
            <Input id="capacity" type="number" placeholder="VD: 1000" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
          </div>

          {/* Environmental Controls */}
          <div className="space-y-4">
            <h4 className="font-medium">Điều Kiện Môi Trường</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperatureControl">Kiểm soát nhiệt độ</Label>
                <Switch
                  id="temperatureControl"
                  checked={formData.hasTemperatureControl}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasTemperatureControl: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="humidityControl">Kiểm soát độ ẩm</Label>
                <Switch id="humidityControl" checked={formData.hasHumidityControl} onCheckedChange={(checked) => setFormData({ ...formData, hasHumidityControl: checked })} />
              </div>
            </div>

            {formData.hasTemperatureControl && (
              <div className="space-y-2">
                <Label htmlFor="temperature">Nhiệt Độ (°C)</Label>
                <Input id="temperature" placeholder="VD: -18 đến -15" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} />
              </div>
            )}

            {formData.hasHumidityControl && (
              <div className="space-y-2">
                <Label htmlFor="humidity">Độ Ẩm (%)</Label>
                <Input id="humidity" placeholder="VD: 60-70" value={formData.humidity} onChange={(e) => setFormData({ ...formData, humidity: e.target.value })} />
              </div>
            )}
          </div>

          {/* Safety Systems */}
          <div className="space-y-4">
            <h4 className="font-medium">Hệ Thống An Toàn</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fireSafety">Hệ thống chống cháy</Label>
                <Switch id="fireSafety" checked={formData.hasFireSafety} onCheckedChange={(checked) => setFormData({ ...formData, hasFireSafety: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="security">Hệ thống bảo mật</Label>
                <Switch id="security" checked={formData.hasSecuritySystem} onCheckedChange={(checked) => setFormData({ ...formData, hasSecuritySystem: checked })} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả thêm về khu vực (tùy chọn)"
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

            <Button type="submit">Tạo Khu Vực</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
