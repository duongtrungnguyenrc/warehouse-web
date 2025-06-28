"use client";

import { AlertTriangle, Droplets, Shield, Thermometer } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Switch } from "@/components/shadcn/switch";
import { Textarea } from "@/components/shadcn/textarea";

interface UpdateZoneDialogProps {
  zone: Zone | null;
  children?: React.ReactNode;
  onUpdate: (zone: Zone) => void;
  warehouseId: string;
}

export function UpdateZoneDialog({ zone, children, onUpdate, warehouseId }: UpdateZoneDialogProps) {
  const [formData, setFormData] = useState({
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
    status: "",
    maxWeight: "",
    ventilationRate: "",
    lightingType: "",
    floorType: "",
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        type: zone.type,
        capacity: zone.capacity.toString(),
        temperature: zone.temperature || "",
        humidity: zone.humidity || "",
        hasTemperatureControl: zone.hasTemperatureControl,
        hasHumidityControl: zone.hasHumidityControl,
        hasFireSafety: zone.hasFireSafety,
        hasSecuritySystem: zone.hasSecuritySystem,
        allowedProductTypes: zone.allowedProductTypes,
        description: zone.description,
        status: zone.status,
        maxWeight: zone.maxWeight?.toString() || "",
        ventilationRate: zone.ventilationRate || "",
        lightingType: zone.lightingType || "",
        floorType: zone.floorType || "",
      });
    }
  }, [zone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zone) return;

    const updatedZone: Zone = {
      ...zone,
      name: formData.name,
      type: formData.type as "cold" | "dry" | "hazardous" | "normal",
      capacity: Number.parseInt(formData.capacity),
      temperature: formData.temperature,
      humidity: formData.humidity,
      hasTemperatureControl: formData.hasTemperatureControl,
      hasHumidityControl: formData.hasHumidityControl,
      hasFireSafety: formData.hasFireSafety,
      hasSecuritySystem: formData.hasSecuritySystem,
      allowedProductTypes: formData.allowedProductTypes,
      description: formData.description,
      status: formData.status as "active" | "maintenance" | "inactive",
      maxWeight: formData.maxWeight ? Number.parseFloat(formData.maxWeight) : undefined,
      ventilationRate: formData.ventilationRate,
      lightingType: formData.lightingType,
      floorType: formData.floorType,
    };

    onUpdate(updatedZone);
  };

  const handleProductTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedProductTypes: prev.allowedProductTypes?.includes(type) ? prev.allowedProductTypes.filter((t) => t !== type) : [...prev.allowedProductTypes, type],
    }));
  };

  const getZoneTypeIcon = (type: string) => {
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

  const getZoneTypeColor = (type: string) => {
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

  const productTypes = [
    { id: "food", name: "Thực phẩm" },
    { id: "beverage", name: "Đồ uống" },
    { id: "electronics", name: "Điện tử" },
    { id: "clothing", name: "Quần áo" },
    { id: "chemicals", name: "Hóa chất" },
    { id: "pharmaceuticals", name: "Dược phẩm" },
    { id: "frozen", name: "Đông lạnh" },
    { id: "fresh", name: "Tươi sống" },
  ];

  if (!zone) return null;

  const usagePercentage = Math.round((zone.used / zone.capacity) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getZoneTypeIcon(zone.type)}
            <span>Cập Nhật Khu Vực {zone.id}</span>
            <Badge className={getZoneTypeColor(zone.type)}>{zone.type}</Badge>
          </DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin khu vực lưu trữ trong kho {warehouseId}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Status Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Tình Trạng Hiện Tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{usagePercentage}%</div>
                  <div className="text-xs text-gray-500">Sử dụng</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{zone.products}</div>
                  <div className="text-xs text-gray-500">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{zone.shelves}</div>
                  <div className="text-xs text-gray-500">Kệ hàng</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Thông Tin Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên Khu Vực *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại Khu Vực *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Dung Lượng (m³) *</Label>
                  <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWeight">Tải Trọng Tối Đa (kg)</Label>
                <Input id="maxWeight" type="number" value={formData.maxWeight} onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })} placeholder="VD: 10000" />
              </div>
            </CardContent>
          </Card>

          {/* Environmental Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Điều Kiện Môi Trường</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Input
                    id="temperature"
                    placeholder="VD: -18 đến -15 hoặc 2-8"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  />
                </div>
              )}

              {formData.hasHumidityControl && (
                <div className="space-y-2">
                  <Label htmlFor="humidity">Độ Ẩm (%)</Label>
                  <Input id="humidity" placeholder="VD: 60-70" value={formData.humidity} onChange={(e) => setFormData({ ...formData, humidity: e.target.value })} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ventilationRate">Tốc Độ Thông Gió (m³/h)</Label>
                  <Input
                    id="ventilationRate"
                    placeholder="VD: 500"
                    value={formData.ventilationRate}
                    onChange={(e) => setFormData({ ...formData, ventilationRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lightingType">Loại Chiếu Sáng</Label>
                  <Select value={formData.lightingType} onValueChange={(value) => setFormData({ ...formData, lightingType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại đèn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="led">LED</SelectItem>
                      <SelectItem value="fluorescent">Huỳnh quang</SelectItem>
                      <SelectItem value="halogen">Halogen</SelectItem>
                      <SelectItem value="natural">Ánh sáng tự nhiên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floorType">Loại Sàn</Label>
                <Select value={formData.floorType} onValueChange={(value) => setFormData({ ...formData, floorType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại sàn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">Bê tông</SelectItem>
                    <SelectItem value="epoxy">Epoxy</SelectItem>
                    <SelectItem value="anti-slip">Chống trượt</SelectItem>
                    <SelectItem value="anti-static">Chống tĩnh điện</SelectItem>
                    <SelectItem value="chemical-resistant">Chống hóa chất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Safety Systems */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Hệ Thống An Toàn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Allowed Product Types */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Loại Sản Phẩm Cho Phép</CardTitle>
              <CardDescription>Chọn các loại sản phẩm có thể lưu trữ trong khu vực này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {productTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type.id}
                      checked={formData.allowedProductTypes?.includes(type.id)}
                      onChange={() => handleProductTypeToggle(type.id)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={type.id} className="text-sm">
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả thêm về khu vực (tùy chọn)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit">Cập Nhật Khu Vực</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
