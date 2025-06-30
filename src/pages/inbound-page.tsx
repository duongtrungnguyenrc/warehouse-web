import { CheckCircle, Clock, FileText, Package, Plus, Search } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

// Mock data
const inboundOrders = [
  {
    id: "InBatch001",
    supplier: "Công ty ABC",
    warehouse: "WH001",
    warehouseName: "Kho Trung Tâm Miền Bắc",
    totalItems: 500,
    totalProducts: 3,
    status: "completed",
    createdDate: "2024-01-20",
    receivedDate: "2024-01-20",
    products: [
      { sku: "PD001", name: "Nước suối Aqua 330ml", quantity: 300, unit: "Chai" },
      { sku: "PD002", name: "Bánh quy Oreo 137g", quantity: 150, unit: "Gói" },
      { sku: "PD003", name: "Sữa tươi TH True Milk 1L", quantity: 50, unit: "Hộp" },
    ],
  },
  {
    id: "InBatch002",
    supplier: "Công ty XYZ",
    warehouse: "WH002",
    warehouseName: "Kho Trung Tâm Miền Nam",
    totalItems: 800,
    totalProducts: 2,
    status: "processing",
    createdDate: "2024-01-21",
    receivedDate: null,
    products: [
      { sku: "PD004", name: "Mì tôm Hảo Hảo", quantity: 600, unit: "Gói" },
      { sku: "PD005", name: "Nước ngọt Coca Cola 330ml", quantity: 200, unit: "Lon" },
    ],
  },
  {
    id: "InBatch003",
    supplier: "TH Group",
    warehouse: "WH001",
    warehouseName: "Kho Trung Tâm Miền Bắc",
    totalItems: 200,
    totalProducts: 1,
    status: "pending",
    createdDate: "2024-01-22",
    receivedDate: null,
    products: [{ sku: "PD003", name: "Sữa tươi TH True Milk 1L", quantity: 200, unit: "Hộp" }],
  },
];

export const InboundPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <FileText className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = inboundOrders.filter(
    (order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Nhập Kho</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các lô hàng nhập kho</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Phiếu Nhập
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng Phiếu Nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Hôm nay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đang Xử Lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Phiếu nhập</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chờ Xử Lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">Phiếu nhập</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">25</div>
            <p className="text-xs text-muted-foreground">Phiếu nhập</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Tìm kiếm theo mã lô hoặc nhà cung cấp..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Inbound Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Phiếu Nhập Kho</CardTitle>
          <CardDescription>Theo dõi tình trạng các lô hàng nhập kho</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Lô Nhập</TableHead>
                <TableHead>Nhà Cung Cấp</TableHead>
                <TableHead>Kho Đích</TableHead>
                <TableHead>Số Lượng</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Ngày Tạo</TableHead>
                <TableHead>Ngày Nhận</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.warehouse}</div>
                      <div className="text-sm text-muted-foreground">{order.warehouseName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.totalItems.toLocaleString()} sản phẩm</div>
                      <div className="text-sm text-muted-foreground">{order.totalProducts} loại</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{order.createdDate}</TableCell>
                  <TableCell className="text-sm">{order.receivedDate || <span className="text-muted-foreground">Chưa nhận</span>}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Chi Tiết
                      </Button>
                      {order.status === "pending" && <Button size="sm">Xử Lý</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
