"use client";

import { Edit, History, Package, QrCode } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Progress } from "@/components/shadcn/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

interface ProductDetailDialogProps {
  product: Product | null;
  children: ReactNode;
}

export function ProductDetailDialog({ product, children }: ProductDetailDialogProps) {
  if (!product) return null;

  const stockPercentage = Math.round((product.stockQuantity / 1000) * 100); // giả định 1000 là max

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{product.name}</span>
            <Badge variant="outline" className="font-mono">
              {product.sku}
            </Badge>
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết sản phẩm</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="settings">Cài Đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Cơ Bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>Mã SKU:</strong> {product.sku}
                  </p>
                  <p>
                    <strong>Slug:</strong> {product.slug}
                  </p>
                  <p>
                    <strong>Tên:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Giá:</strong> {product.price.toLocaleString()}đ
                  </p>
                  <p>
                    <strong>Đơn Vị:</strong> {product.unitOfMeasure}
                  </p>
                  <p>
                    <strong>Quy Cách:</strong> {product.packageSize}
                  </p>
                  <p>
                    <strong>Trọng Lượng:</strong> {product.weight} kg
                  </p>
                  <p>
                    <strong>Danh Mục:</strong> {product.category.name}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tồn Kho</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.stockQuantity.toLocaleString()}</div>
                    <p className="text-sm text-gray-500">Tổng tồn kho</p>
                  </div>
                  <Progress value={stockPercentage} className="h-3" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài Đặt Sản Phẩm</CardTitle>
                <CardDescription>Các thao tác cấu hình</CardDescription>
              </CardHeader>
              <CardContent className="flex space-x-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh Sửa
                </Button>
                <Button variant="outline">
                  <History className="mr-2 h-4 w-4" />
                  Lịch Sử
                </Button>
                <Button variant="outline">
                  <QrCode className="mr-2 h-4 w-4" />
                  In QR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
