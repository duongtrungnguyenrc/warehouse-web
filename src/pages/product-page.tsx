import { AlertTriangle, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";

// Mock data
const products = [
  {
    id: "PD001",
    name: "Nước suối Aqua 330ml",
    category: "Nước uống",
    unit: "Chai",
    packaging: "1 lốc 6 chai",
    stock: 1250,
    minStock: 500,
    status: "active",
    expiry: "2024-12-31",
    supplier: "Công ty ABC",
  },
  {
    id: "PD002",
    name: "Bánh quy Oreo 137g",
    category: "Thực phẩm",
    unit: "Gói",
    packaging: "1 thùng 24 gói",
    stock: 320,
    minStock: 200,
    status: "low_stock",
    expiry: "2024-08-15",
    supplier: "Công ty XYZ",
  },
  {
    id: "PD003",
    name: "Sữa tươi TH True Milk 1L",
    category: "Sữa",
    unit: "Hộp",
    packaging: "1 thùng 12 hộp",
    stock: 45,
    minStock: 100,
    status: "critical",
    expiry: "2024-06-30",
    supplier: "TH Group",
  },
];

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";
      case "low_stock":
        return "bg-yellow-50 text-yellow-700";
      case "critical":
        return "bg-red-50 text-red-700";
      case "out_of_stock":
        return "bg-gray-50 text-gray-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Bình thường";
      case "low_stock":
        return "Sắp hết";
      case "critical":
        return "Rất ít";
      case "out_of_stock":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Hàng Hóa</h1>
          <p className="text-muted-foreground">Quản lý danh sách sản phẩm và hàng hóa trong kho</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Sản Phẩm
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,615</div>
            <p className="text-xs text-muted-foreground">Mặt hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sắp Hết Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hết Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">Cần nhập gấp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sắp Hết Hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">Trong 30 ngày</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Bộ Lọc
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Sản Phẩm</CardTitle>
          <CardDescription>Quản lý thông tin chi tiết các sản phẩm trong kho</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình Ảnh</TableHead>
                <TableHead>Mã SP</TableHead>
                <TableHead>Tên Sản Phẩm</TableHead>
                <TableHead>Danh Mục</TableHead>
                <TableHead>Tồn Kho</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Hạn Sử Dụng</TableHead>
                <TableHead>Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src="@/assets/react.svg" alt={product.name} width={40} height={40} className="rounded-md object-cover" />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.packaging}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{product.stock.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">{product.unit}</span>
                      {product.stock < product.minStock && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground">Tối thiểu: {product.minStock.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>{getStatusText(product.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{product.expiry}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                      <Button variant="outline" size="sm">
                        Chi Tiết
                      </Button>
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
