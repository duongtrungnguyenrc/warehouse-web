import { Download, Edit, Package, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

interface EquipmentDetailProps {
  equipment: Equipment;
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: "p1",
    sku: "SKU001",
    slug: "laptop-dell-xps-13",
    name: "Laptop Dell XPS 13",
    price: 25000000,
    unitOfMeasure: "piece",
    packageSize: "1 unit",
    weight: 1.2,
    stockQuantity: 25,
    category: {
      id: "cat-1",
      name: "Electronics",
      description: "Electronic devices and accessories",
    },
  },
];

export function EquipmentDetail({ equipment }: EquipmentDetailProps) {
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || (product.stockQuantity > 0 ? (product.stockQuantity < 10 ? "low-stock" : "in-stock") : "out-of-stock") === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-50 text-green-700";
      case "low-stock":
        return "bg-yellow-50 text-yellow-700";
      case "out-of-stock":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-stock":
        return "Còn hàng";
      case "low-stock":
        return "Sắp hết";
      case "out-of-stock":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const totalValue = filteredProducts.reduce((sum, product) => sum + product.price * product.stockQuantity, 0);
  const totalQuantity = filteredProducts.reduce((sum, product) => sum + product.stockQuantity, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{equipment.products.length}</div>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Tổng số lượng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
            <p className="text-sm text-gray-600">Tổng giá trị</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold font-mono">{equipment.lpn}</div>
            <p className="text-sm text-gray-600">LPN</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin thiết bị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">LPN</label>
              <p className="font-semibold">{equipment.lpn}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dung tích tối đa</label>
              <p>{equipment.maxSize.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Dung tích còn lại</label>
              <p>{equipment.remainingSize.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Danh sách sản phẩm
              </CardTitle>
              <CardDescription>Các sản phẩm được lưu trữ trong thiết bị</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="in-stock">Còn hàng</SelectItem>
                <SelectItem value="low-stock">Sắp hết</SelectItem>
                <SelectItem value="out-of-stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                  <TableHead className="text-right">Giá</TableHead>
                  <TableHead className="text-right">Tổng giá trị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell className="text-right">{product.stockQuantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price * product.stockQuantity)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(product.stockQuantity > 0 ? (product.stockQuantity < 10 ? "low-stock" : "in-stock") : "out-of-stock")}>
                        {getStatusText(product.stockQuantity > 0 ? (product.stockQuantity < 10 ? "low-stock" : "in-stock") : "out-of-stock")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && <div className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào phù hợp với bộ lọc</div>}
        </CardContent>
      </Card>
    </div>
  );
}
