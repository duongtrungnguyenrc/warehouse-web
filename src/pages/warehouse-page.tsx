import { AlertCircle, Eye, MapPin, Plus } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CreateWarehouseDialog } from "@/components";
import { UpdateWarehouseDialog } from "@/components/update-warehouse-dialog";

const warehouses = [
  {
    id: "WH001",
    name: "Kho Trung Tâm Miền Bắc",
    address: "Số 123, Đường ABC, Hà Nội",
    area: 5000,
    capacity: 10000,
    used: 7500,
    status: "active" as const,
    zones: [
      {
        id: "A01",
        name: "Khu A - Hàng đông lạnh",
        type: "cold" as const,
        capacity: 2000,
        used: 1500,
        temperature: "-18°C đến -15°C",
        humidity: "85-90%",
        products: 150,
        shelves: 20,
        status: "active" as const,
      },
      {
        id: "B01",
        name: "Khu B - Hàng khô",
        type: "dry" as const,
        capacity: 3000,
        used: 2200,
        temperature: "15°C đến 25°C",
        humidity: "50-60%",
        products: 200,
        shelves: 30,
        status: "active" as const,
      },
      {
        id: "C01",
        name: "Khu C - Hàng thường",
        type: "normal" as const,
        capacity: 5000,
        used: 3800,
        products: 100,
        shelves: 25,
        status: "active" as const,
      },
    ],
    products: 450,
    manager: "Nguyễn Văn An",
    phone: "024-1234-5678",
    email: "wh001@company.com",
    createdDate: "2024-01-01",
    lastInspection: "2024-01-20",
  },
  {
    id: "WH002",
    name: "Kho Trung Tâm Miền Nam",
    address: "Số 456, Đường XYZ, TP.HCM",
    area: 4500,
    capacity: 8000,
    used: 6200,
    status: "active" as const,
    zones: [
      {
        id: "A02",
        name: "Khu A - Hàng điện tử",
        type: "normal" as const,
        capacity: 2500,
        used: 2000,
        products: 180,
        shelves: 25,
        status: "active" as const,
      },
      {
        id: "B02",
        name: "Khu B - Hàng dễ vỡ",
        type: "normal" as const,
        capacity: 2000,
        used: 1700,
        products: 120,
        shelves: 20,
        status: "active" as const,
      },
      {
        id: "C02",
        name: "Khu C - Hàng nguy hiểm",
        type: "hazardous" as const,
        capacity: 1500,
        used: 1200,
        products: 80,
        shelves: 15,
        status: "maintenance" as const,
      },
    ],
    products: 380,
    manager: "Trần Thị Bình",
    phone: "028-1234-5678",
    email: "wh002@company.com",
    createdDate: "2024-01-05",
    lastInspection: "2024-01-18",
  },
  {
    id: "WH003",
    name: "Kho Miền Trung",
    address: "Số 789, Đường DEF, Đà Nẵng",
    area: 3000,
    capacity: 6000,
    used: 5800,
    status: "warning" as const,
    zones: [
      {
        id: "A03",
        name: "Khu A - Hàng thực phẩm",
        type: "cold" as const,
        capacity: 2000,
        used: 1900,
        temperature: "2°C đến 8°C",
        humidity: "80-85%",
        products: 150,
        shelves: 18,
        status: "active" as const,
      },
      {
        id: "B03",
        name: "Khu B - Hàng gia dụng",
        type: "normal" as const,
        capacity: 4000,
        used: 3900,
        products: 140,
        shelves: 22,
        status: "active" as const,
      },
    ],
    products: 290,
    manager: "Lê Văn Cường",
    phone: "0236-1234-5678",
    email: "wh003@company.com",
    createdDate: "2024-01-10",
    lastInspection: "2024-01-15",
  },
];

export const WarehousesPage = () => {
  const [] = useState<(typeof warehouses)[0] | null>(warehouses[0]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700";
      case "warning":
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
      case "warning":
        return "Cảnh báo";
      case "inactive":
        return "Ngừng hoạt động";
      default:
        return "Không xác định";
    }
  };

  const getUsagePercentage = (used: number, capacity: number) => {
    return Math.round((used / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Kho</h1>
          <p className="text-muted-foreground">Quản lý thông tin các kho hàng trong hệ thống</p>
        </div>

        <CreateWarehouseDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo Kho Mới
          </Button>
        </CreateWarehouseDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const usagePercentage = getUsagePercentage(warehouse.used, warehouse.capacity);

          return (
            <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                    <CardDescription className="font-mono text-sm">{warehouse.id}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(warehouse.status)}>{getStatusText(warehouse.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {warehouse.address}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dung lượng sử dụng</span>
                    <span className="font-medium">{usagePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 75 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {warehouse.used.toLocaleString()} / {warehouse.capacity.toLocaleString()} m³
                    </span>
                    {usagePercentage > 90 && (
                      <span className="text-red-500 flex items-center">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Gần đầy
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{warehouse.zones.length}</div>
                    <div className="text-xs text-muted-foreground">Khu vực</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{warehouse.products}</div>
                    <div className="text-xs text-muted-foreground">Sản phẩm</div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Xem Chi Tiết
                  </Button>

                  <UpdateWarehouseDialog warehouse={warehouse} onUpdate={() => console.log("Cập nhật kho", warehouse.id)}>
                    <Button variant="outline" size="sm" className="flex-1">
                      Chỉnh Sửa
                    </Button>
                  </UpdateWarehouseDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
