"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  packaging: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  supplier: string;
  description: string;
  status: "active" | "inactive";
  minStock: number;
  maxStock: number;
}

interface UpdateProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: Product) => void;
}

export function UpdateProductDialog({ product, open, onOpenChange, onUpdate }: UpdateProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    packaging: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    supplier: "",
    description: "",
    status: "",
    minStock: "",
    maxStock: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        unit: product.unit,
        packaging: product.packaging,
        length: product.dimensions.length.toString(),
        width: product.dimensions.width.toString(),
        height: product.dimensions.height.toString(),
        weight: product.dimensions.weight.toString(),
        supplier: product.supplier,
        description: product.description,
        status: product.status,
        minStock: product.minStock.toString(),
        maxStock: product.maxStock.toString(),
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      packaging: formData.packaging,
      dimensions: {
        length: Number.parseFloat(formData.length),
        width: Number.parseFloat(formData.width),
        height: Number.parseFloat(formData.height),
        weight: Number.parseFloat(formData.weight),
      },
      supplier: formData.supplier,
      description: formData.description,
      status: formData.status as "active" | "inactive",
      minStock: Number.parseInt(formData.minStock),
      maxStock: Number.parseInt(formData.maxStock),
    };

    onUpdate(updatedProduct);
    onOpenChange(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập Nhật Sản Phẩm</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin sản phẩm {product.sku}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Sản Phẩm *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh Mục *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Thực phẩm</SelectItem>
                  <SelectItem value="beverage">Đồ uống</SelectItem>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="clothing">Quần áo</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Đơn Vị *</Label>
              <Input id="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packaging">Quy Cách Đóng Gói *</Label>
              <Input id="packaging" value={formData.packaging} onChange={(e) => setFormData({ ...formData, packaging: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kích Thước & Trọng Lượng</Label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="length" className="text-xs">
                  Dài (cm)
                </Label>
                <Input id="length" type="number" step="0.1" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="width" className="text-xs">
                  Rộng (cm)
                </Label>
                <Input id="width" type="number" step="0.1" value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">
                  Cao (cm)
                </Label>
                <Input id="height" type="number" step="0.1" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="weight" className="text-xs">
                  Nặng (kg)
                </Label>
                <Input id="weight" type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Nhà Cung Cấp *</Label>
              <Input id="supplier" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Tồn Kho Tối Thiểu *</Label>
              <Input id="minStock" type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Tồn Kho Tối Đa *</Label>
              <Input id="maxStock" type="number" value={formData.maxStock} onChange={(e) => setFormData({ ...formData, maxStock: e.target.value })} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Cập Nhật</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
