"use client";
import { AlertTriangle, Barcode, Calendar, Edit, History, MapPin, Package, QrCode, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Progress } from "@/components/shadcn/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

interface ProductDetailDialogProps {
  product: Product | null;
  children: ReactNode;
}

export function ProductDetailDialog({ product, children }: ProductDetailDialogProps) {
  if (!product) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-50 text-green-700";
      case "expiring":
        return "bg-yellow-50 text-yellow-700";
      case "expired":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "Tốt";
      case "expiring":
        return "Sắp hết hạn";
      case "expired":
        return "Hết hạn";
      default:
        return "Không xác định";
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case "inbound":
        return "bg-green-50 text-green-700";
      case "outbound":
        return "bg-red-50 text-red-700";
      case "transfer":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getMovementTypeText = (type: string) => {
    switch (type) {
      case "inbound":
        return "Nhập kho";
      case "outbound":
        return "Xuất kho";
      case "transfer":
        return "Chuyển kho";
      default:
        return "Không xác định";
    }
  };

  const stockPercentage = Math.round((product.totalStock / product.maxStock) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{product.name}</span>
            <Badge variant="outline" className="font-mono">
              {product.sku}
            </Badge>
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết sản phẩm và quản lý tồn kho</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="batches">Lô Hàng</TabsTrigger>
            <TabsTrigger value="movements">Lịch Sử</TabsTrigger>
            <TabsTrigger value="settings">Cài Đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Image & Basic Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Thông Tin Sản Phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img src={product.image || "/placeholder.svg?height=120&width=120"} alt={product.name} width={120} height={120} className="rounded-lg border object-cover" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Mã SKU</label>
                          <p className="font-mono flex items-center">
                            <Barcode className="h-4 w-4 mr-2" />
                            {product.sku}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Danh Mục</label>
                          <p>{product.category}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Đơn Vị</label>
                          <p>{product.unit}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Quy Cách</label>
                          <p>{product.packaging}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Nhà Cung Cấp</label>
                        <p>{product.supplier}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Mô Tả</label>
                    <p className="text-sm">{product.description}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Kích Thước & Trọng Lượng</label>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>D: {product.dimensions.length}cm</div>
                      <div>R: {product.dimensions.width}cm</div>
                      <div>C: {product.dimensions.height}cm</div>
                      <div>KL: {product.dimensions.weight}kg</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Tình Trạng Tồn Kho</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.totalStock.toLocaleString()}</div>
                    <p className="text-sm text-gray-500">Tổng tồn kho</p>
                  </div>

                  <Progress value={stockPercentage} className="h-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Khả dụng:</span>
                      <span className="font-medium text-green-600">{product.availableStock.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã đặt:</span>
                      <span className="font-medium text-yellow-600">{product.reservedStock.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tối thiểu:</span>
                      <span className="font-medium">{product.minStock.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tối đa:</span>
                      <span className="font-medium">{product.maxStock.toLocaleString()}</span>
                    </div>
                  </div>

                  {product.totalStock < product.minStock && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Dưới mức tối thiểu</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{product.batches.length}</p>
                      <p className="text-sm text-gray-500">Lô hàng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-gray-500">Vị trí lưu trữ</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-500">Giao dịch/tháng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">30</p>
                      <p className="text-sm text-gray-500">Ngày luân chuyển</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Quản Lý Lô Hàng</h3>
                <p className="text-sm text-gray-500">Theo dõi các lô hàng và hạn sử dụng</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Số Lô</TableHead>
                      <TableHead>Số Lượng</TableHead>
                      <TableHead>Vị Trí</TableHead>
                      <TableHead>Ngày Nhập</TableHead>
                      <TableHead>Hạn Sử Dụng</TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead>Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.batches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono">{batch.batchNumber}</TableCell>
                        <TableCell>
                          {batch.quantity.toLocaleString()} {product.unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {batch.location}
                          </div>
                        </TableCell>
                        <TableCell>{batch.receivedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {batch.expiryDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)}>{getStatusText(batch.status)}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movements" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Lịch Sử Giao Dịch</h3>
                <p className="text-sm text-gray-500">Theo dõi các hoạt động nhập xuất kho</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loại</TableHead>
                      <TableHead>Số Lượng</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Vị Trí</TableHead>
                      <TableHead>Tham Chiếu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <Badge className={getMovementTypeColor(movement.type)}>{getMovementTypeText(movement.type)}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={movement.type === "outbound" ? "text-red-600" : "text-green-600"}>
                            {movement.type === "outbound" ? "-" : "+"}
                            {movement.quantity.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>{movement.date}</TableCell>
                        <TableCell>{movement.location}</TableCell>
                        <TableCell className="font-mono">{movement.reference}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài Đặt Sản Phẩm</CardTitle>
                <CardDescription>Cấu hình và quản lý thông tin sản phẩm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh Sửa Thông Tin
                  </Button>
                  <Button variant="outline">
                    <History className="mr-2 h-4 w-4" />
                    Lịch Sử Thay Đổi
                  </Button>
                  <Button variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    In Mã QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
