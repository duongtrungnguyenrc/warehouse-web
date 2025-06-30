import { AlertCircle, CheckCircle, Clock, Package, Plus, Search, Truck } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

// Mock data
const outboundOrders = [
  {
    id: "OutBatch001",
    customer: "Siêu thị BigC",
    warehouse: "WH001",
    warehouseName: "Kho Trung Tâm Miền Bắc",
    totalItems: 300,
    totalProducts: 2,
    status: "completed",
    createdDate: "2024-01-20",
    shippedDate: "2024-01-20",
    deliveryAddress: "123 Nguyễn Văn Cừ, Q.5, TP.HCM",
    products: [
      { sku: "PD001", name: "Nước suối Aqua 330ml", quantity: 200, unit: "Chai" },
      { sku: "PD002", name: "Bánh quy Oreo 137g", quantity: 100, unit: "Gói" },
    ],
  },
  {
    id: "OutBatch002",
    customer: "Cửa hàng Vinmart",
    warehouse: "WH002",
    warehouseName: "Kho Trung Tâm Miền Nam",
    totalItems: 450,
    totalProducts: 3,
    status: "picking",
    createdDate: "2024-01-21",
    shippedDate: null,
    deliveryAddress: "456 Lê Văn Việt, Q.9, TP.HCM",
    products: [
      { sku: "PD001", name: "Nước suối Aqua 330ml", quantity: 200, unit: "Chai" },
      { sku: "PD003", name: "Sữa tươi TH True Milk 1L", quantity: 150, unit: "Hộp" },
      { sku: "PD004", name: "Mì tôm Hảo Hảo", quantity: 100, unit: "Gói" },
    ],
  },
  {
    id: "OutBatch003",
    customer: "Coop Mart",
    warehouse: "WH001",
    warehouseName: "Kho Trung Tâm Miền Bắc",
    totalItems: 600,
    totalProducts: 4,
    status: "pending",
    createdDate: "2024-01-22",
    shippedDate: null,
    deliveryAddress: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
    products: [
      { sku: "PD001", name: "Nước suối Aqua 330ml", quantity: 250, unit: "Chai" },
      { sku: "PD002", name: "Bánh quy Oreo 137g", quantity: 150, unit: "Gói" },
      { sku: "PD003", name: "Sữa tươi TH True Milk 1L", quantity: 100, unit: "Hộp" },
      { sku: "PD005", name: "Nước ngọt Coca Cola 330ml", quantity: 100, unit: "Lon" },
    ],
  },
  {
    id: "OutBatch004",
    customer: "Lotte Mart",
    warehouse: "WH003",
    warehouseName: "Kho Miền Trung",
    totalItems: 200,
    totalProducts: 1,
    status: "cancelled",
    createdDate: "2024-01-19",
    shippedDate: null,
    deliveryAddress: "321 Hùng Vương, Đà Nẵng",
    products: [{ sku: "PD003", name: "Sữa tươi TH True Milk 1L", quantity: 200, unit: "Hộp" }],
  },
];

export const OutboundPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "picking":
        return "bg-blue-50 text-blue-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      case "shipping":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "picking":
        return "Đang soạn hàng";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      case "shipping":
        return "Đang giao hàng";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "picking":
        return <Package className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "shipping":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = outboundOrders.filter(
    (order) => order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Xuất Kho</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý các đơn hàng xuất kho</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Đơn Xuất
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Xuất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">Hôm nay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chờ Xử Lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">Đơn hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đang Soạn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Đơn hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đang Giao Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-xs text-muted-foreground">Đơn hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">13</div>
            <p className="text-xs text-muted-foreground">Đơn hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Tìm kiếm theo mã đơn hoặc khách hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* Outbound Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Đơn Xuất Kho</CardTitle>
          <CardDescription>Theo dõi tình trạng các đơn hàng xuất kho</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Đơn Xuất</TableHead>
                <TableHead>Khách Hàng</TableHead>
                <TableHead>Kho Xuất</TableHead>
                <TableHead>Số Lượng</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Ngày Tạo</TableHead>
                <TableHead>Ngày Giao</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-48">{order.deliveryAddress}</div>
                    </div>
                  </TableCell>
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
                  <TableCell className="text-sm">{order.shippedDate || <span className="text-muted-foreground">Chưa giao</span>}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Chi Tiết
                      </Button>
                      {order.status === "pending" && <Button size="sm">Xử Lý</Button>}
                      {order.status === "picking" && (
                        <Button size="sm" variant="secondary">
                          Hoàn Thành
                        </Button>
                      )}
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
