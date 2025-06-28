import { Activity, Edit, MapPin, Package, Pen, Plus, Trash2, Users } from "lucide-react";

import { CreateZoneDialog } from "./create-zone-dialog";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { UpdateZoneDialog } from "./update-zone-dialog";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Progress } from "@/components/shadcn/progress";

interface WarehouseDetailDialogProps {
  warehouse: Warehouse | null;
  children?: React.ReactNode;
}

export function WarehouseDetailDialog({ warehouse, children }: WarehouseDetailDialogProps) {
  if (!warehouse) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";
      case "maintenance":
        return "bg-yellow-50 text-yellow-700";
      case "inactive":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "maintenance":
        return "Bảo trì";
      case "inactive":
        return "Ngừng hoạt động";
      default:
        return "Không xác định";
    }
  };

  const usagePercentage = Math.round((warehouse.used / warehouse.capacity) * 100);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-6xl min-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>{warehouse.name}</span>
              <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết và quản lý kho hàng</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Thông Tin Cơ Bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mã Kho</label>
                      <p className="font-mono">{warehouse.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tên Kho</label>
                      <p>{warehouse.name}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Địa Chỉ</label>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {warehouse.address}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Diện Tích</label>
                      <p>{warehouse.area.toLocaleString()} m²</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sức Chứa</label>
                      <p>{warehouse.capacity.toLocaleString()} m³</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Người Quản Lý</label>
                      <p>{warehouse.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Số Điện Thoại</label>
                      <p>{warehouse.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Tình Trạng Sử Dụng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{usagePercentage}%</div>
                    <p className="text-sm text-gray-500">Đã sử dụng</p>
                  </div>

                  <Progress value={usagePercentage} className="h-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Đã sử dụng:</span>
                      <span className="font-medium">{warehouse.used.toLocaleString()} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Còn trống:</span>
                      <span className="font-medium">{(warehouse.capacity - warehouse.used).toLocaleString()} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng cộng:</span>
                      <span className="font-medium">{warehouse.capacity.toLocaleString()} m³</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tổng Quan Khu Vực</CardTitle>
                    <CardDescription>Thống kê các khu vực trong kho</CardDescription>
                  </div>
                  <CreateZoneDialog warehouseId={warehouse.id}>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo Khu Vực
                    </Button>
                  </CreateZoneDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {warehouse.zones.map((zone) => {
                    const zoneUsage = Math.round((zone.used / zone.capacity) * 100);
                    return (
                      <div key={zone.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{zone.name}</h4>

                          <div className="flex space-x-2">
                            <UpdateZoneDialog zone={zone} warehouseId="" onUpdate={() => console.log("Cập nhật khu vực", zone.id)}>
                              <Badge className="text-black bg-gray-50">
                                <Pen className="h-4 w-4" />
                              </Badge>
                            </UpdateZoneDialog>
                            <DeleteConfirmationDialog
                              onConfirm={() => console.log("Xóa khu vực", zone.id)}
                              title="Xóa Khu Vực"
                              description={`Bạn có chắc muốn xóa khu vực "${zone.name}"?`}
                              itemName={zone.name}
                            >
                              <Badge className="text-red-500 bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Badge>
                            </DeleteConfirmationDialog>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sử dụng:</span>
                            <span>{zoneUsage}%</span>
                          </div>
                          <Progress value={zoneUsage} className="h-2" />
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>{zone.products} sản phẩm</div>
                            <div>{zone.shelves} kệ</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt Động Gần Đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nhập kho thành công</p>
                        <p className="text-xs text-gray-500">Lô InBatch001 - 500 sản phẩm</p>
                        <p className="text-xs text-gray-400">2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Xuất kho</p>
                        <p className="text-xs text-gray-500">Đơn OutBatch001 - 200 sản phẩm</p>
                        <p className="text-xs text-gray-400">4 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Kiểm kê khu vực A</p>
                        <p className="text-xs text-gray-500">Hoàn thành 80%</p>
                        <p className="text-xs text-gray-400">1 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống Kê Hôm Nay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lô nhập kho:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Đơn xuất kho:</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sản phẩm di chuyển:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cảnh báo:</span>
                      <span className="font-medium text-yellow-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Cài Đặt Kho</CardTitle>
                <CardDescription>Cấu hình và quản lý thông tin kho</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Ngày tạo kho</label>
                    <p className="text-sm text-gray-600">{warehouse.createdDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kiểm tra cuối</label>
                    <p className="text-sm text-gray-600">{warehouse.lastInspection}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh Sửa Thông Tin
                  </Button>
                  <Button variant="outline">
                    <Activity className="mr-2 h-4 w-4" />
                    Lịch Sử Hoạt Động
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Phân Quyền
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
