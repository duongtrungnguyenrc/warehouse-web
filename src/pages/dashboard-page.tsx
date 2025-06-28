import { AlertTriangle, FileText, Package, TrendingUp, Warehouse } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";

function getDashboardStats() {
  return {
    totalWarehouses: 5,
    totalProducts: 1250,
    totalInbound: 45,
    totalOutbound: 38,
    lowStockItems: 12,
    expiringSoon: 8,
  };
}

export const DashboardPage = () => {
  const stats = getDashboardStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Quản Lý Kho</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Tổng quan hệ thống quản lý kho hàng</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Số Kho</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Mặt hàng trong kho</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhập Kho Hôm Nay</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInbound}</div>
            <p className="text-xs text-muted-foreground">Lô hàng nhập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xuất Kho Hôm Nay</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOutbound}</div>
            <p className="text-xs text-muted-foreground">Đơn hàng xuất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hàng Sắp Hết</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp Hết Hạn</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities - Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
            <CardDescription>Các giao dịch nhập xuất kho mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nhập kho WH001</p>
                  <p className="text-sm text-muted-foreground">Lô InBatch001 - 500 sản phẩm</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Hoàn thành
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Xuất kho WH002</p>
                  <p className="text-sm text-muted-foreground">Đơn OutBatch001 - 200 sản phẩm</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Đang xử lý
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kiểm kê kho WH003</p>
                  <p className="text-sm text-muted-foreground">Khu vực A - Hoàn thành 80%</p>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Đang tiến hành
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cảnh Báo Hệ Thống</CardTitle>
            <CardDescription>Các vấn đề cần được xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-700">Hàng hết hạn</p>
                  <p className="text-sm text-muted-foreground">8 sản phẩm sắp hết hạn trong 7 ngày</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-700">Tồn kho thấp</p>
                  <p className="text-sm text-muted-foreground">12 sản phẩm dưới mức tồn kho tối thiểu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-700">Kho gần đầy</p>
                  <p className="text-sm text-muted-foreground">Kho WH001 đã sử dụng 95% dung lượng</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
